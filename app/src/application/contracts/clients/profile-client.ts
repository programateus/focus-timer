import type { ServiceIdentifier } from "inversify";

import type { ProfileDataDTO } from "@application/dtos/profile-data-dto";

export interface ProfileClient {
  getProfileData(): Promise<ProfileDataDTO>;
  updateProfileData(data: Partial<ProfileDataDTO>): Promise<ProfileDataDTO>;
}

export const ProfileClientIdentifier: ServiceIdentifier<ProfileClient> =
  "ProfileClient";
