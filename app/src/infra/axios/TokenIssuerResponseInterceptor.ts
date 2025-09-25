import {
  type AxiosInstance,
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import Cookies from "universal-cookie";

import { type AxiosResponseInterceptor } from "./AxiosResponseInterceptor";
import { type FailedRequestItem } from "./types";

export class TokenIssuerResponseInterceptor
  implements AxiosResponseInterceptor
{
  private isRefreshing = false;
  private failedRequestQueue: FailedRequestItem[] = [];
  private axios: AxiosInstance;

  constructor(axios: AxiosInstance, private cookies: Cookies = new Cookies()) {
    this.axios = axios;
  }

  onSuccess(response: AxiosResponse<unknown, unknown>) {
    return response;
  }

  onError(error: Error) {
    if (!(error instanceof AxiosError)) {
      return Promise.reject(error);
    }
    if (!error.response) {
      return Promise.reject(error);
    }
    if (error.response.status === 401 || error.response.status === 429) {
      if (error.response.request.responseURL.includes("/issue-token")) {
        this.cookies.remove("access_token");
        this.cookies.remove("refresh_token");
        this.isRefreshing = false;
        return Promise.reject(error);
      }

      if (error.response.data.code === "access_token_expired") {
        const originalRequest: AxiosRequestConfig = error.config ?? {};
        const refreshToken = this.cookies.get("refresh_token");
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          this.axios
            .post<{ accessToken: string }>("/api/auth/issue-token", {
              refreshToken,
            })
            .then((res) => {
              this.axios.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${res.data.accessToken}`;
              this.cookies.set("access_token", res.data.accessToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                domain: "localhost",
              });
              this.failedRequestQueue.forEach((request) =>
                request.onSuccess(res.data.accessToken)
              );
              this.failedRequestQueue = [];
            })
            .catch((err) => {
              this.failedRequestQueue.forEach((request) =>
                request.onFailure(err)
              );
              this.failedRequestQueue = [];
            })
            .finally(() => {
              this.isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          this.failedRequestQueue.push({
            onSuccess: (token: string) => {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(this.axios(originalRequest));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      }
    }

    return Promise.reject(error);
  }
}
