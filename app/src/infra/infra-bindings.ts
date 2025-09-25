import type { BindingDefinition } from "./inversify/types";
import { httpAuthClientBinding } from "./clients/http-auth-client";
import { cookieTokenStorageBinding } from "./jwt/cookie-token-storage";
import { axiosHttpClientBinding } from "./axios/AxiosHttpClient";
import { axiosBinding } from "./axios/axios";
import { cookiesBinding } from "./cookies/universal-cookies";
import { httpProfileClientBinding } from "./clients/http-profile-client";

export const infraBindings: BindingDefinition[] = [
  cookieTokenStorageBinding,
  axiosBinding,
  cookiesBinding,
  axiosHttpClientBinding,
  httpAuthClientBinding,
  httpProfileClientBinding,
];
