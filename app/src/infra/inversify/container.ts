import { Container } from "inversify";

import { applicationBindings } from "@application/application-bindings";
import { infraBindings } from "@infra/infra-bindings";

import type { BindingDefinition } from "./types";

const container = new Container();

function registerBindings(container: Container, bindings: BindingDefinition[]) {
  for (const binding of bindings) {
    if (binding.implementation) {
      const bind = container.bind(binding.token).to(binding.implementation);
      if (binding.scope === "Singleton") bind.inSingletonScope();
      else if (binding.scope === "Transient") bind.inTransientScope();
      else if (binding.scope === "Request") bind.inRequestScope();
      if (binding.name) bind.whenNamed(binding.name);
    } else if (binding.value !== undefined) {
      container.bind(binding.token).toConstantValue(binding.value);
    } else {
      throw new Error(
        `Binding for ${String(
          binding.token
        )} is missing implementation or value`
      );
    }
  }
}

registerBindings(container, [...applicationBindings, ...infraBindings]);

export default container;
