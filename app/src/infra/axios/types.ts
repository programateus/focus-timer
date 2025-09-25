import { AxiosError } from "axios";

export type FailedRequestItem = {
  onSuccess: (token: string) => void;
  onFailure: (err: AxiosError) => void;
};
