import Cookies from "universal-cookie";
import { type InternalAxiosRequestConfig } from "axios";

import { type AxiosRequestInterceptor } from "./AxiosRequestInterceptor";

export class TokenSetterRequestInterceptor implements AxiosRequestInterceptor {
  constructor(private cookies: Cookies = new Cookies()) {}

  onFulfilled(config: InternalAxiosRequestConfig<unknown>) {
    const authToken = this.cookies.get("access_token");
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }
    return config;
  }

  onRejected(error: unknown) {
    return Promise.reject(error);
  }
}
