import {
  ProfileClientIdentifier,
  type ProfileClient,
} from "@application/contracts/clients/profile-client";
import {
  HttpClientIdentifier,
  type HttpClient,
} from "@application/contracts/http-client";
import type { ProfileDataDTO } from "@application/dtos/profile-data-dto";
import type { BindingDefinition } from "@infra/inversify/types";
import { inject, injectable } from "inversify";

@injectable()
export class HttpProfileClient implements ProfileClient {
  constructor(
    @inject(HttpClientIdentifier) private readonly httpClient: HttpClient
  ) {}

  getProfileData(): Promise<ProfileDataDTO> {
    return this.httpClient.get<ProfileDataDTO>("/api/profile");
  }

  updateProfileData(data: Partial<ProfileDataDTO>): Promise<ProfileDataDTO> {
    return this.httpClient.patch<ProfileDataDTO>("/api/profile", data);
  }
}

export const httpProfileClientBinding: BindingDefinition = {
  token: ProfileClientIdentifier,
  implementation: HttpProfileClient,
};
