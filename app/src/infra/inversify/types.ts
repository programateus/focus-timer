import type { Newable, ServiceIdentifier } from "inversify";

export type BindingDefinition = {
  token: ServiceIdentifier<unknown>;
  implementation?: Newable<unknown>;
  value?: unknown;
  name?: string;
  scope?: "Singleton" | "Transient" | "Request";
};
