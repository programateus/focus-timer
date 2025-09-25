import { type InternalAxiosRequestConfig } from "axios";

export interface AxiosRequestInterceptor {
  onFulfilled(
    config: InternalAxiosRequestConfig<unknown>
  ):
    | InternalAxiosRequestConfig<unknown>
    | Promise<InternalAxiosRequestConfig<unknown>>;
  onRejected(error: unknown): unknown;
}
