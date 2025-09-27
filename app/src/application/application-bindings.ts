import type { BindingDefinition } from "@infra/inversify/types";
import { signUpUseCaseBinding } from "./use-cases/auth/sign-up-use-case";
import { signInUseCaseBinding } from "./use-cases/auth/sign-in-use-case";
import { profileDataLoaderUseCaseBinding } from "./use-cases/profile/profile-data-loader-use-case";

export const applicationBindings: BindingDefinition[] = [
  signUpUseCaseBinding,
  signInUseCaseBinding,
  profileDataLoaderUseCaseBinding,
];
