import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  type AxiosDefaults,
  AxiosError,
  type AxiosHeaderValue,
  type AxiosInstance,
  type AxiosResponse,
  type HeadersDefaults,
  type InternalAxiosRequestConfig,
} from "axios";
import Cookies from "universal-cookie";

import { TokenIssuerResponseInterceptor } from "./TokenIssuerResponseInterceptor";

const cookies = {
  remove: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
} as unknown as Cookies;

describe("TokenIssuerResponseInterceptor", () => {
  let interceptor: TokenIssuerResponseInterceptor;
  let mockAxios: AxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();

    mockAxios = vi.fn() as unknown as AxiosInstance;
    mockAxios.defaults = {
      headers: {
        common: {},
      },
    } as Omit<AxiosDefaults, "headers"> & {
      headers: HeadersDefaults & {
        [key: string]: AxiosHeaderValue;
      };
    };
    mockAxios.post = vi.fn();

    interceptor = new TokenIssuerResponseInterceptor(mockAxios, cookies);
  });

  describe("onSuccess", () => {
    it("should return the response unchanged", () => {
      const mockResponse = { data: { test: "data" } } as AxiosResponse;
      const result = interceptor.onSuccess(mockResponse);
      expect(result).toBe(mockResponse);
    });
  });

  describe("onError", () => {
    it("should reject non-axios errors", async () => {
      const error = new Error("Regular error");

      await expect(interceptor.onError(error)).rejects.toThrow("Regular error");
    });

    it("should reject axios errors without response", async () => {
      const axiosError = new AxiosError("Error without response");

      await expect(interceptor.onError(axiosError)).rejects.toBe(axiosError);
    });

    it("should handle issue-token failures by clearing cookies", async () => {
      const axiosError = new AxiosError("Issue token failed");
      axiosError.response = {
        status: 401,
        request: {
          responseURL: "https://example.com/api/auth/issue-token",
        },
        data: {},
      } as AxiosResponse;

      await expect(interceptor.onError(axiosError)).rejects.toBe(axiosError);
      expect(cookies.remove).toHaveBeenCalledWith("access_token");
      expect(cookies.remove).toHaveBeenCalledWith("refresh_token");
    });

    it("should handle expired tokens by refreshing them", async () => {
      vi.mocked(cookies.get).mockReturnValue("refresh-token-123");

      const mockPostResponse = {
        data: { accessToken: "new-access-token-123" },
      };
      vi.mocked(mockAxios.post).mockResolvedValueOnce(mockPostResponse);

      const axiosError = new AxiosError("Token expired");
      axiosError.config = {
        headers: {},
      } as InternalAxiosRequestConfig;
      axiosError.response = {
        status: 401,
        request: {
          responseURL: "https://example.com/api/resource",
        },
        data: { code: "access_token_expired" },
      } as AxiosResponse;

      const retryPromise = interceptor.onError(axiosError);

      expect(mockAxios.post).toHaveBeenCalledWith("/api/auth/issue-token", {
        refreshToken: "refresh-token-123",
      });

      const mockRetryResponse = { data: "retried successfully" };
      vi.mocked(mockAxios).mockResolvedValue(mockRetryResponse);
      vi.mocked(mockAxios.post).mockResolvedValueOnce(mockRetryResponse);

      const result = await retryPromise;

      expect(mockAxios.defaults.headers.common["Authorization"]).toBe(
        "Bearer new-access-token-123"
      );
      expect(cookies.set).toHaveBeenCalledWith(
        "access_token",
        "new-access-token-123",
        expect.objectContaining({
          httpOnly: false,
        })
      );
      expect(result).toEqual(mockRetryResponse);
    });

    it("should handle failed token refresh", async () => {
      vi.mocked(cookies.get).mockReturnValue("refresh-token-123");

      const refreshError = new AxiosError("Refresh failed");
      vi.mocked(mockAxios.post).mockRejectedValueOnce(refreshError);

      const axiosError = new AxiosError("Token expired");
      axiosError.config = {
        headers: {},
      } as InternalAxiosRequestConfig;
      axiosError.response = {
        status: 401,
        request: {
          responseURL: "https://example.com/api/resource",
        },
        data: { code: "access_token_expired" },
      } as AxiosResponse;

      const retryPromise = interceptor.onError(axiosError);

      await expect(retryPromise).rejects.toBe(refreshError);
    });

    it("should queue multiple requests during token refresh", async () => {
      vi.mocked(cookies.get).mockReturnValue("refresh-token-123");

      let resolveRefresh: (value: unknown) => void;
      const refreshPromise = new Promise((resolve) => {
        resolveRefresh = resolve;
      });

      vi.mocked(mockAxios.post).mockReturnValue(refreshPromise);

      const createExpiredTokenError = () => {
        const error = new AxiosError("Token expired");
        error.config = { headers: {} } as InternalAxiosRequestConfig;
        error.response = {
          status: 401,
          request: { responseURL: "https://example.com/api/resource" },
          data: { code: "access_token_expired" },
        } as AxiosResponse;
        return error;
      };

      const error1 = createExpiredTokenError();
      const error2 = createExpiredTokenError();

      const retry1 = interceptor.onError(error1);
      const retry2 = interceptor.onError(error2);

      expect(mockAxios.post).toHaveBeenCalledTimes(1);

      vi.mocked(mockAxios).mockResolvedValueOnce({
        data: "retry1 success",
      });
      vi.mocked(mockAxios.post).mockResolvedValueOnce({
        data: "retry1 success",
      });
      vi.mocked(mockAxios).mockResolvedValueOnce({
        data: "retry2 success",
      });
      vi.mocked(mockAxios.post).mockResolvedValueOnce({
        data: "retry2 success",
      });

      resolveRefresh!({
        data: { accessToken: "new-access-token-123" },
      });

      const [result1, result2] = await Promise.all([retry1, retry2]);

      expect(mockAxios).toHaveBeenCalledTimes(2);
      expect(result1).toEqual({ data: "retry1 success" });
      expect(result2).toEqual({ data: "retry2 success" });
    });
  });
});
