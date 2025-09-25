import { type ServiceIdentifier } from "inversify";

export interface Options {
  signal?: AbortSignal;
}

export const HttpClientIdentifier: ServiceIdentifier<HttpClient> = "HttpClient";

export interface HttpClient {
  get<Data>(url: string, options?: Options): Promise<Data>;
  post<Data, Body = unknown>(
    url: string,
    body?: Body,
    options?: Options
  ): Promise<Data>;
  put<Data, Body = unknown>(
    url: string,
    body: Body,
    options?: Options
  ): Promise<Data>;
  delete<Data>(url: string, options?: Options): Promise<Data>;
  patch<Data, Body = unknown>(
    url: string,
    body: Body,
    options?: Options
  ): Promise<Data>;
}
