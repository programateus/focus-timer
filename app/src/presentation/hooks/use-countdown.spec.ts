import { beforeEach, describe, expect, it, vi } from "vitest";

import { act, renderHook } from "@testing-library/react";

import { useCountdown } from "./use-countdown";

describe("useCountdown", () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  it("should start counting down from the initial time when started", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCountdown({ initialMinutes: 25 }));

    expect(result.current.time).toBe(25 * 60);

    act(() => {
      result.current.start();
    });

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.time).toBe(25 * 60 - 1);

    vi.useRealTimers();
  });

  it("should pause the countdown when paused", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCountdown({ initialMinutes: 25 }));

    act(() => {
      result.current.start();
    });

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.time).toBe(25 * 60 - 3);

    act(() => {
      result.current.pause();
    });

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.time).toBe(25 * 60 - 3);

    vi.useRealTimers();
  });
});
