import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type {
  DefinedUseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";

import type { Pomodoro } from "@domain/entities/pomodoro";
import { usePomodoroStore } from "@presentation/stores/pomodoro-store";
import {
  generateCreatePomodoroDTO,
  generatePomodoro,
} from "@tests/domain/entities/pomodoro-mock";

import { useAuth } from "./use-auth";
import { usePomodoros } from "./use-pomodoros";
import { useListPomodoro } from "./react-query/hooks/pomodoro/use-list-pomodoro";
import { useCreatePomodoro } from "./react-query/hooks/pomodoro/use-create-pomodoro";
import type { CreatePomodoroDTO } from "@application/dtos/create-pomodoro-dto";

vi.mock("@presentation/hooks/use-auth");
vi.mock("@presentation/stores/pomodoro-store");
vi.mock("@presentation/hooks/react-query/hooks/pomodoro/use-list-pomodoro");
vi.mock("@presentation/hooks/react-query/hooks/pomodoro/use-create-pomodoro");

describe("usePomodoros", () => {
  const mockAddSession = vi.fn();
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", name: "Test User", email: "test@example.com" },
      hasLoaded: true,
      loadData: vi.fn(),
    });

    vi.mocked(usePomodoroStore).mockReturnValue({
      sessions: [],
      addSession: mockAddSession,
    });

    vi.mocked(useListPomodoro).mockReturnValue({
      data: [],
    } as unknown as DefinedUseQueryResult<Pomodoro[], Error>);

    vi.mocked(useCreatePomodoro).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as unknown as UseMutationResult<Pomodoro, Error, CreatePomodoroDTO, unknown>);
  });

  it("should return empty pomodoros list initially", async () => {
    const { result } = renderHook(() => usePomodoros());

    expect(result.current.pomodoros).toEqual([]);
  });

  it("should add pomodoro when authenticated", async () => {
    const pomodoroDto = generateCreatePomodoroDTO();
    const createdPomodoro: Pomodoro = {
      id: "pomodoro-123",
      ...pomodoroDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockMutateAsync.mockResolvedValue(createdPomodoro);
    const { result } = renderHook(() => usePomodoros());

    const returnedPomodoro = await result.current.addPomodoro(pomodoroDto);

    expect(mockMutateAsync).toHaveBeenCalledWith(pomodoroDto);
    expect(mockAddSession).not.toHaveBeenCalled();
    expect(returnedPomodoro).toEqual(createdPomodoro);
  });

  it("should add a pomodoro locally when not authenticated", async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      hasLoaded: true,
      loadData: vi.fn(),
    });

    const pomodoroDto = generateCreatePomodoroDTO();
    const { result } = renderHook(() => usePomodoros());
    const returnedPomodoro = await result.current.addPomodoro(pomodoroDto);
    expect(mockAddSession).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        ...pomodoroDto,
      })
    );
    expect(mockMutateAsync).not.toHaveBeenCalled();
    expect(returnedPomodoro).toMatchObject(pomodoroDto);
  });

  it("should return server pomodoros when authenticated", () => {
    const serverPomodoros: Pomodoro[] = Array.from({ length: 3 }, () =>
      generatePomodoro()
    );

    vi.mocked(useListPomodoro).mockReturnValue({
      data: serverPomodoros,
    } as unknown as DefinedUseQueryResult<Pomodoro[], Error>);

    const { result } = renderHook(() => usePomodoros());

    expect(result.current.pomodoros).toEqual(serverPomodoros);
  });

  it("should return local pomodoros when not authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      hasLoaded: true,
      loadData: vi.fn(),
    });

    const localPomodoros = Array.from({ length: 3 }, () => generatePomodoro());

    vi.mocked(usePomodoroStore).mockReturnValue({
      sessions: localPomodoros,
      addSession: mockAddSession,
    });

    const { result } = renderHook(() => usePomodoros());

    expect(result.current.pomodoros).toEqual(localPomodoros);
  });
});
