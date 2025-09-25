import type { BindingDefinition } from "@infra/inversify/types";
import { signUpUseCaseBinding } from "./use-cases/sign-up-use-case";
import { signInUseCaseBinding } from "./use-cases/sign-in-use-case";

export const applicationBindings: BindingDefinition[] = [
  signUpUseCaseBinding,
  signInUseCaseBinding,
];
