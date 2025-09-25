import Cookies from "universal-cookie";

import type { BindingDefinition } from "@infra/inversify/types";

export const cookies = new Cookies();

export const cookiesBinding: BindingDefinition = {
  token: Cookies,
  value: cookies,
};
