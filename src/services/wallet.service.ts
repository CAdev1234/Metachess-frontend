import Web3 from 'web3';
import WAValidator from 'multicoin-address-validator'
import { checkNull } from '../lib/utils';
import { NETWORK_LIST } from '../constants/walletData';
import {wCSPR_ABI} from '../abi/wCSPR'
declare var window: any
interface NativeCurrencyData {
    name: string,
    symbol: string,
    decimal: number
}
interface NetworkData {
    title: string,
    logo: string,
    networkName: string,
    chainId: number,
    chainIdHex: string,
    nativeCurrency: NativeCurrencyData,
    rpcUrl: string,
    blockExplorerUrl: string
}

interface WalletData {
    address: string,
    chainId: number,
    balance: number
}

interface WalletResponse {
    status: string,
    data: any
}

class WalletService {
    public userObj: any;
    window: any;
    // public
    public isConnected = false;
    public walletData:WalletData = {
        address: null,
        chainId: null,
        balance: 0
    }
    public cryptoData:any = null;

    constructor() {
        this.cryptoData = process.env.NODE_ENV === 'development' ? NETWORK_LIST.dev : NETWORK_LIST.prod
    }

    public initListener = () => {
        window.ethereum.on('accountsChanged', this.handleAccountChange)
        window.ethereum.on('chainChanged', this.handleChainChange)
    }

    public handleAccountChange = async(accounts: any) => {
        console.log("accounts=", accounts)
        let chainId = await this.getActiveChainID()
        if (accounts.length > 0) {
            this.walletData.address = accounts[0]
            this.walletData.chainId = chainId
        } else {
            this.walletData.address = null
            this.walletData.chainId = null
        }
    }
    public handleChainChange = async(networkID: number) => {
        this.walletData.chainId = networkID
    }
    public removeListener = () => {
        window.ethereum.removeListener('accountChanged', this.handleAccountChange)
        window.ethereum.removeListener('chainChanged', this.handleChainChange)
    }

    public getActiveChainID = async() => {
        try {
            const chainID = await new Web3(Web3.givenProvider).eth.net.getId()
            return chainID
        } catch (error) {
            console.log(error)
            return null
        }
    }

    public checkWalletInstall = () => {
        if (window.ethereum) {
            return true
        }else {
            return false
        }
    }
    
    
    private getAccounts = async () => {
        try {
            return await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (e) {
            return [];
        }
    }

    public validateAddress = async (address: string, currency: string) => {
        return WAValidator.validate(address, currency)
    }

    public checkConnectWallet = async () => {
        let accounts = await this.getAccounts();
        if (accounts.length === 0) {
            this.isConnected = false;
        } else {
            this.isConnected = true;
            this.openMetamask();
        }
        setInterval(async () => {
            accounts = await this.getAccounts();
            if (accounts.length === 0) {
                this.isConnected = false;
            } else {
                this.isConnected = true;
                this.openMetamask();
            }
        }, 2000);
    }
    public openMetamask = async (networkData: any = null) => {
        try {
            const isInstalled = this.checkWalletInstall()
            if (!isInstalled) {
                return {
                    status: 'error',
                    data: 'Please install metamask.'
                }
            }
            window.web3 = new Web3(window.ethereum);
            let addresses = await this.getAccounts();
            if (!checkNull(networkData)) this.switchNetwork(networkData);
            if (addresses.length > 0) this.walletData.address = addresses[0];
            console.log(this.walletData)
            return {
                status: 'success',
                data: this.walletData
            };    
        } catch (error) {
            console.log(error)
            return {
                status: 'error',
                data: error
            }
        }
        
    }
    
    public switchNetwork = async (networkData : NetworkData) => {
        try {
            console.log(networkData)
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: networkData.chainIdHex }],
            });
            return {
                status: 'success',
                msg: ''
            }
        } catch (switchError: any) {
            console.log("switchError=", switchError)
            if (switchError.code === 4902) {
                try {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                          chainId: networkData.chainIdHex,
                          chainName: networkData.title,
                          rpcUrls: [networkData.rpcUrl],
                          nativeCurrency: networkData.nativeCurrency,
                      },
                    ],
                  });
                } catch (addError) {
                  // handle "add" error
                  console.log("addError=", addError)
                  return {
                      status: 'error',
                      msg: addError
                  }
                }
            }else {
                return {
                    status: 'error',
                    msg: switchError
                }
            }
        }
    }

    public getToken = async (tokenAbi: any, tokenAddress: string) => {
        let web3Provider = new Web3(Web3.givenProvider);
        return new web3Provider.eth.Contract(tokenAbi, tokenAddress);
    }

    public getTokenBalance = async () => {
        const token = await this.getToken(wCSPR_ABI, this.cryptoData.tokens.wCSPR.options.address);
        if (this.walletData.address) {
            let balance = await (token as any).methods.balanceOf(this.walletData.address).call();
            balance = new Web3(Web3.givenProvider).utils.fromWei(balance, 'ether');
            this.walletData.balance = Number(balance)
            return Number(balance);
        } else {
            return 0;
        }
    }

    public truncateString = (
        longString: String,
        startChunk: number,
        endChunk: number
    ) => {

        if (!longString) return;
        return (
            longString.substring(0, startChunk) +
            '...' +
            longString.substring(longString.length - endChunk)
        );
    };

}

const WALLET = new WalletService();
export default WALLET;