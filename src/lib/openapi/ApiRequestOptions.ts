/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
 

export type ApiRequestOptions = {
  BASE: string;
  VERSION: string;
  WITH_CREDENTIALS: boolean;
  CREDENTIALS: 'include' | 'omit' | 'same-origin';
  TOKEN?: string | ((options: ApiRequestOptions) => Promise<string>) | undefined;
  USERNAME?: string | ((options: ApiRequestOptions) => Promise<string>) | undefined;
  PASSWORD?: string | ((options: ApiRequestOptions) => Promise<string>) | undefined;
  HEADERS?: Record<string, string> | ((options: ApiRequestOptions) => Promise<Record<string, string>>) | undefined;
  ENCODE_PATH?: ((path: string) => string) | undefined;
};