import { inject, injectable } from "inversify";

import {
  ProfileClientIdentifier,
  type ProfileClient,
} from "@application/contracts/clients/profile-client";
import type { BindingDefinition } from "@infra/inversify/types";

@injectable()
export class ProfileDataLoaderUseCase {
  constructor(
    @inject(ProfileClientIdentifier) private profileClient: ProfileClient
  ) {}

  execute() {
    return this.profileClient.getProfileData();
  }
}

export const profileDataLoaderUseCaseBinding: BindingDefinition = {
  token: ProfileDataLoaderUseCase,
  implementation: ProfileDataLoaderUseCase,
};
