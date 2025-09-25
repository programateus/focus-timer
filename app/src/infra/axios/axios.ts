import Axios, { type AxiosInstance } from "axios";
import { type ServiceIdentifier } from "inversify";

import { type BindingDefinition } from "@infra/inversify/types";

export const axios = Axios.create();

export const AxiosIdentifier: ServiceIdentifier<AxiosInstance> =
  "AxiosIdentifier";

export const axiosBinding: BindingDefinition = {
  token: AxiosIdentifier,
  value: axios,
};
