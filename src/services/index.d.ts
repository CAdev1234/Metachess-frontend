declare interface IQuery {
  name: string;
  value: string;
}

declare interface IError{
  status: number;
  data: IErrorWithMessage | string;
}

declare interface IErrorWithMessage {
  error: string;
  message?: string;
}

declare type METHOD_TYPE = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

declare interface IOtherProperties {
  headers?: object;
  other?: object;
}

interface ITokenInformations {
}