import { type AxiosResponse } from "axios";

export interface AxiosResponseInterceptor {
  onSuccess(
    response: AxiosResponse<unknown, unknown>
  ): AxiosResponse<unknown, unknown> | Promise<AxiosResponse<unknown, unknown>>;
  onError(error: Error): void;
}
