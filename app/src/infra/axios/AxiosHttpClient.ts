import { type AxiosInstance } from "axios";
import { inject, injectable } from "inversify";

import { type BindingDefinition } from "@infra/inversify/types";

import {
  type HttpClient,
  HttpClientIdentifier,
  type Options,
} from "@application/contracts/http-client";

import { AxiosIdentifier } from "./axios";
import { TokenSetterRequestInterceptor } from "./TokenSetterRequestInterceptor";
import { TokenIssuerResponseInterceptor } from "./TokenIssuerResponseInterceptor";
import { type AxiosRequestInterceptor } from "./AxiosRequestInterceptor";
import { type AxiosResponseInterceptor } from "./AxiosResponseInterceptor";

@injectable()
export class AxiosHttpClient implements HttpClient {
  private axios: AxiosInstance;
  private requestInterceptors: Array<AxiosRequestInterceptor> = [];
  private responseInterceptors: Array<AxiosResponseInterceptor> = [];

  constructor(@inject(AxiosIdentifier) axios: AxiosInstance) {
    this.axios = axios;
    this.axios.defaults.baseURL = import.meta.env.VITE_API_URL;
    this.axios.defaults.headers["Content-Type"] = "application/json";

    this.requestInterceptors.push(new TokenSetterRequestInterceptor());
    this.responseInterceptors.push(
      new TokenIssuerResponseInterceptor(this.axios)
    );
    this.addRequestInterceptors();
    this.addResponseInterceptors();
  }

  private addRequestInterceptors() {
    this.requestInterceptors.forEach((interceptor) => {
      this.axios.interceptors.request.use(
        (config) => interceptor.onFulfilled(config),
        (error) => interceptor.onRejected(error)
      );
    });
  }

  private addResponseInterceptors() {
    this.responseInterceptors.forEach((interceptor) => {
      this.axios.interceptors.response.use(
        (response) => interceptor.onSuccess(response),
        (error) => interceptor.onError(error)
      );
    });
  }

  async get<Data>(url: string, options?: Options): Promise<Data> {
    const response = await this.axios.get<Data>(url, {
      signal: options?.signal,
    });
    return response.data;
  }

  async post<Data, Body = unknown>(
    url: string,
    body: Body,
    options?: Options
  ): Promise<Data> {
    const response = await this.axios.post<Data>(url, body, {
      signal: options?.signal,
    });
    return response.data;
  }

  async put<Data, Body = unknown>(
    url: string,
    body: Body,
    options?: Options
  ): Promise<Data> {
    const response = await this.axios.put<Data>(url, body, {
      signal: options?.signal,
    });
    return response.data;
  }

  async delete<Data>(url: string, options?: Options): Promise<Data> {
    const response = await this.axios.delete<Data>(url, {
      signal: options?.signal,
    });
    return response.data;
  }

  async patch<Data, Body = unknown>(
    url: string,
    body: Body,
    options?: Options
  ): Promise<Data> {
    const response = await this.axios.patch<Data>(url, body, {
      signal: options?.signal,
    });
    return response.data;
  }
}

export const axiosHttpClientBinding: BindingDefinition = {
  token: HttpClientIdentifier,
  implementation: AxiosHttpClient,
  scope: "Singleton",
};
