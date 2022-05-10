import axios, { CancelTokenSource } from "axios";
import { constructUrl } from "./endpoints";
import TOKEN from "./token.service";

/* API SERVICE */
class ApiService {
  token: string | null = null;
  private cancelTokens: { [name: string]: CancelTokenSource } = {};

  initialize = (): void => {
    const token = TOKEN.user;
    if (token) {
      this.token = token;
    }
  };

  reinitialize = (): void => this.initialize();

  execute = (
    method: METHOD_TYPE,
    endpoint: string,
    data?: any,
    queries?: IQuery[],
    id?: string | number,
    axiosProperties?: IOtherProperties,
    otherEndpointProperties?: any
  ): Promise<any> => {
    const url = constructUrl(
      endpoint,
      data,
      queries,
      id,
      otherEndpointProperties
    );
    console.log("url " + url, queries);
    return this._fetch(method, url, data, axiosProperties);
  };

  private async _fetch(
    method: METHOD_TYPE,
    url: string,
    body: any,
    otherProperties?: IOtherProperties
  ): Promise<any> {
    try {
      const headers = otherProperties?.headers ? otherProperties.headers : {};
      const otherConfig = otherProperties?.other ? otherProperties.other : {};
      const response = await axios({
        method,
        url,
        headers: {
          Authorization: `${this.token}`,
          ...headers,
        },
        data: body,
        ...otherConfig,
      });
      if (response.status >= 200 || response.status <= 299) {
        return response.data;
      }
      throw response;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw { isRequestCancelled: true };
      }
      console.log(`Error fetching ${method}: ${url}`, error?.response?.data);
      throw { data: error?.response?.data, status: error?.response?.status };
    }
  }

  private addCancelToken = (cancelTokenName: string) => {
    this.cancelTokens[cancelTokenName] = axios.CancelToken.source();
  };

  getTokenByName = (cancelTokenName: string) =>
    this.cancelTokens[cancelTokenName]
      ? this.cancelTokens[cancelTokenName].token
      : null;

  cancelRequestByName = (cancelTokenName: string) => {
    if (this.cancelTokens[cancelTokenName]) {
      this.cancelTokens[cancelTokenName].cancel();
    }
    this.addCancelToken(cancelTokenName);
  };
}

const API = new ApiService();

// export { API };

export default API;
