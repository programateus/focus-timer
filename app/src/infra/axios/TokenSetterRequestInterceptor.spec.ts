import { beforeEach, describe, expect, it, vi } from "vitest";
import { type InternalAxiosRequestConfig } from "axios";
import Cookies from "universal-cookie";

import { TokenSetterRequestInterceptor } from "./TokenSetterRequestInterceptor";

const cookies = {
  remove: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
} as unknown as Cookies;

describe("TokenSetterRequestInterceptor", () => {
  let interceptor: TokenSetterRequestInterceptor;

  beforeEach(() => {
    vi.clearAllMocks();
    interceptor = new TokenSetterRequestInterceptor(cookies);
  });

  describe("onFulfilled", () => {
    it("should set the Authorization header with the access token", () => {
      const mockConfig = {
        headers: {},
      } as unknown as InternalAxiosRequestConfig;

      vi.mocked(cookies.get).mockReturnValueOnce("mockAccessToken");

      const result = interceptor.onFulfilled(mockConfig);

      expect(result.headers["Authorization"]).toBe("Bearer mockAccessToken");
    });

    it("should not modify the config if no access token is present", () => {
      const mockConfig = {
        headers: {},
      } as unknown as InternalAxiosRequestConfig;

      vi.mocked(cookies.get).mockReturnValueOnce(undefined);

      const result = interceptor.onFulfilled(mockConfig);

      expect(result.headers["Authorization"]).toBeUndefined();
    });
  });
});
