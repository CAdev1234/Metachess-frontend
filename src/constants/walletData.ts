export const NETWORK_LIST = {
    prod: {
        networkList: {
            casper: {
                title: 'Casper Network',
                logo: 'https://cryptologos.cc/logos/casper-cspr-logo.png?v=022',
                networkName: 'Casper',
                chainId: 0,
                nativeCurrency: {
                    name: '',
                    symbol: '',
                    decimals: 18
                },
                rpcUrl: '',
                blockExplorerUrl: 'https://cspr.live'
            },
            bsc: {
                title: 'Binance Smart Chain',
                logo: 'https://chainstack.com/wp-content/uploads/2021/06/bsc-icon-logo-1-1.png',
                networkName: 'Binance',
                chainId: 56,
                chainIdHex: '0x38',
                nativeCurrency: {
                    name: '',
                    symbol: '',
                    decimals: 18
                },
                rpcUrl: 'https://bsc-dataseed3.binance.org',
                blockExplorerUrl: 'https://bscscan.com'
            }
        },
        contracts: {
            casper: {
                bridgeContract: {
                    address: 'contract-bb0388974d2d445d31801785f8938a8f1fad5315338079db4fa11be1ecd53cec'
                }
            },
            bsc: {
                bridgeContract: {
                    address: '0xF8DE6EEDBAA4982CcA6D546f5E453461E10ae187'
                },
            }
        },
        tokens: {
            wCSPR: {
                type: 'BEP20',
                options: {
                    address: '0xa5033ad7F1928566225057Fa3e6F704e8401BC25',
                    symbol: 'wCSPR',
                    decimals: 18
                },
            },
        }
    },
    dev: {
        networkList: {
            casper: {
                title: 'Casper Testnet',
                chainId: 0,
                networkName: 'Casper',
                logo: 'https://cryptologos.cc/logos/casper-cspr-logo.png?v=022',
                nativeCurrency: {
                    name: '',
                    symbol: '',
                    decimals: 18
                },
                rpcUrl: '',
                blockExplorerUrl: 'https://testnet.cspr.live'
            },
            bsc: {
                title: 'Binance Smart Chain Testnet',
                networkName: 'Binance',
                logo: 'https://chainstack.com/wp-content/uploads/2021/06/bsc-icon-logo-1-1.png',
                chainId: 97,
                chainIdHex: '0x61',
                nativeCurrency: {
                    name: '',
                    symbol: 'BNB',
                    decimals: 18
                },
                rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
                blockExplorerUrl: 'https://testnet.bscscan.com'
            }
        },
        contracts: {
            casper: {
                bridgeContract: {
                    address: 'contract-bb0388974d2d445d31801785f8938a8f1fad5315338079db4fa11be1ecd53cec'
                }
            },
            bsc: {
                bridgeContract: {
                    address: '0x3D2e0bc53C27C8BbD49346d44e3e666e41Eeb27F'
                },
            }
        },
        tokens: {
            wCSPR: {
                type: 'BEP20',
                options: {
                    address: '0xf7ce9fcd2cab252a7c2c34aa1dcc867b7827fe9e',
                    symbol: 'wCSPR',
                    decimals: 18
                },
            },
        }
    }
}
