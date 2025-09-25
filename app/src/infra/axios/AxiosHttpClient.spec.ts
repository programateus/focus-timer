import { type AxiosInstance } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AxiosHttpClient } from "./AxiosHttpClient";

describe("AxiosHttpClient", () => {
  let axiosHttpClient: AxiosHttpClient;
  let mockAxios: AxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxios = vi.fn() as unknown as AxiosInstance;
    mockAxios.defaults = {
      headers: {
        common: {},
      },
    } as unknown as AxiosInstance["defaults"];
    mockAxios.get = vi.fn();
    mockAxios.post = vi.fn();
    mockAxios.patch = vi.fn();
    mockAxios.put = vi.fn();
    mockAxios.delete = vi.fn();
    mockAxios.interceptors = {
      request: {
        use: vi.fn(),
      } as unknown as AxiosInstance["interceptors"]["request"],
      response: {
        use: vi.fn(),
      } as unknown as AxiosInstance["interceptors"]["response"],
    };

    axiosHttpClient = new AxiosHttpClient(mockAxios);
  });

  describe("get", () => {
    it("should call axios.get with the correct parameters", async () => {
      const url = "https://example.com";
      const options = { signal: new AbortController().signal };
      const mockResponse = { data: "response data" };

      vi.mocked(mockAxios.get).mockResolvedValueOnce(mockResponse);

      const result = await axiosHttpClient.get(url, options);

      expect(mockAxios.get).toHaveBeenCalledWith(url, {
        signal: options.signal,
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("post", () => {
    it("should call axios.post with the correct parameters", async () => {
      const url = "https://example.com";
      const body = { key: "value" };
      const options = { signal: new AbortController().signal };
      const mockResponse = { data: "response data" };

      vi.mocked(mockAxios.post).mockResolvedValueOnce(mockResponse);

      const result = await axiosHttpClient.post(url, body, options);

      expect(mockAxios.post).toHaveBeenCalledWith(url, body, {
        signal: options.signal,
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("put", () => {
    it("should call axios.put with the correct parameters", async () => {
      const url = "https://example.com";
      const body = { key: "value" };
      const options = { signal: new AbortController().signal };
      const mockResponse = { data: "response data" };

      vi.mocked(mockAxios.put).mockResolvedValueOnce(mockResponse);

      const result = await axiosHttpClient.put(url, body, options);

      expect(mockAxios.put).toHaveBeenCalledWith(url, body, {
        signal: options.signal,
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("delete", () => {
    it("should call axios.delete with the correct parameters", async () => {
      const url = "https://example.com";
      const options = { signal: new AbortController().signal };
      const mockResponse = { data: "response data" };

      vi.mocked(mockAxios.delete).mockResolvedValueOnce(mockResponse);

      const result = await axiosHttpClient.delete(url, options);

      expect(mockAxios.delete).toHaveBeenCalledWith(url, {
        signal: options.signal,
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("patch", () => {
    it("should call axios.patch with the correct parameters", async () => {
      const url = "https://example.com";
      const body = { key: "value" };
      const options = { signal: new AbortController().signal };
      const mockResponse = { data: "response data" };

      vi.mocked(mockAxios.patch).mockResolvedValueOnce(mockResponse);

      const result = await axiosHttpClient.patch(url, body, options);

      expect(mockAxios.patch).toHaveBeenCalledWith(url, body, {
        signal: options.signal,
      });
      expect(result).toEqual(mockResponse.data);
    });
  });
});
