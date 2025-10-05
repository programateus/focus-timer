import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import type { User } from "@domain/entities/user";
import { useAuth } from "@presentation/hooks/use-auth";
import { useTaskStore } from "@presentation/stores/task-store";
import { generateTask } from "@tests/domain/entities/tasks-mock";
import { usePomodoroStore } from "@presentation/stores/pomodoro-store";
import type { SyncLocalTasksUseCase } from "@application/use-cases/task/sync-local-tasks-use-case";
import type { ProfileDataLoaderUseCase } from "@application/use-cases/profile/profile-data-loader-use-case";
import type { SyncLocalPomodorosUseCase } from "@application/use-cases/pomodoro/sync-local-pomodoros-use-case";

import { AuthProvider } from "./auth-provider";

vi.mock("@presentation/stores/task-store");
vi.mock("@presentation/stores/pomodoro-store");

const profileDataLoader = {
  execute: vi.fn(),
};
const syncLocalTasks = {
  execute: vi.fn(),
};
const syncLocalPomodoros = {
  execute: vi.fn(),
};

const TestComponent = () => {
  const { isAuthenticated, hasLoaded, user } = useAuth();

  return (
    <div>
      <div data-testid="is-authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="has-loaded">{hasLoaded.toString()}</div>
      <div data-testid="user-name">{user?.name || "no-user"}</div>
    </div>
  );
};

describe("AuthProvider", () => {
  const mockClearLocalTasks = vi.fn();
  const mockClearLocalPomodoros = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useTaskStore).mockReturnValue({
      localTasks: [],
      clearLocalTasks: mockClearLocalTasks,
      selectedTask: null,
      selectTask: vi.fn(),
      addLocalTask: vi.fn(),
      updateLocalTask: vi.fn(),
      deleteLocalTask: vi.fn(),
    });

    vi.mocked(usePomodoroStore).mockReturnValue({
      sessions: [],
      clearLocalPomodoros: mockClearLocalPomodoros,
      addSession: vi.fn(),
    });
  });

  describe("initialization", () => {
    it("should start with unauthenticated state", async () => {
      profileDataLoader.execute.mockResolvedValue(null);

      render(
        <AuthProvider
          profileDataLoaderUseCase={
            profileDataLoader as unknown as ProfileDataLoaderUseCase
          }
          syncLocalTasksUseCase={
            syncLocalTasks as unknown as SyncLocalTasksUseCase
          }
          syncLocalPomodorosUseCase={
            syncLocalPomodoros as unknown as SyncLocalPomodorosUseCase
          }
        >
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("has-loaded")).toHaveTextContent("true");
      });

      expect(screen.getByTestId("is-authenticated")).toHaveTextContent("false");
      expect(screen.getByTestId("user-name")).toHaveTextContent("no-user");
    });

    it("should load user data on mount", async () => {
      const mockUser: User = {
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
      };

      profileDataLoader.execute.mockResolvedValue(mockUser);

      render(
        <AuthProvider
          profileDataLoaderUseCase={
            profileDataLoader as unknown as ProfileDataLoaderUseCase
          }
          syncLocalTasksUseCase={
            syncLocalTasks as unknown as SyncLocalTasksUseCase
          }
          syncLocalPomodorosUseCase={
            syncLocalPomodoros as unknown as SyncLocalPomodorosUseCase
          }
        >
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("has-loaded")).toHaveTextContent("true");
      });

      expect(screen.getByTestId("is-authenticated")).toHaveTextContent("true");
      expect(screen.getByTestId("user-name")).toHaveTextContent("Test User");
      expect(profileDataLoader.execute).toHaveBeenCalled();
    });

    it("should set hasLoaded to true even when user data loading fails", async () => {
      const consoleLogSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {});

      profileDataLoader.execute.mockRejectedValue(
        new Error("Failed to load user")
      );

      render(
        <AuthProvider
          profileDataLoaderUseCase={
            profileDataLoader as unknown as ProfileDataLoaderUseCase
          }
          syncLocalTasksUseCase={
            syncLocalTasks as unknown as SyncLocalTasksUseCase
          }
          syncLocalPomodorosUseCase={
            syncLocalPomodoros as unknown as SyncLocalPomodorosUseCase
          }
        >
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("has-loaded")).toHaveTextContent("true");
      });

      expect(screen.getByTestId("is-authenticated")).toHaveTextContent("false");
      expect(screen.getByTestId("user-name")).toHaveTextContent("no-user");

      consoleLogSpy.mockRestore();
    });
  });

  describe("syncing local data", () => {
    it("should sync local tasks when user logs in", async () => {
      const mockUser: User = {
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
      };

      const localTasks = Array.from({ length: 3 }, () => generateTask());

      vi.mocked(useTaskStore).mockReturnValue({
        localTasks,
        clearLocalTasks: mockClearLocalTasks,
        selectedTask: null,
        selectTask: vi.fn(),
        addLocalTask: vi.fn(),
        updateLocalTask: vi.fn(),
        deleteLocalTask: vi.fn(),
      });

      profileDataLoader.execute.mockResolvedValue(mockUser);
      syncLocalTasks.execute.mockResolvedValue(undefined);

      render(
        <AuthProvider
          profileDataLoaderUseCase={
            profileDataLoader as unknown as ProfileDataLoaderUseCase
          }
          syncLocalTasksUseCase={
            syncLocalTasks as unknown as SyncLocalTasksUseCase
          }
          syncLocalPomodorosUseCase={
            syncLocalPomodoros as unknown as SyncLocalPomodorosUseCase
          }
        >
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("has-loaded")).toHaveTextContent("true");
      });

      expect(syncLocalTasks.execute).toHaveBeenCalledWith(localTasks);
      expect(mockClearLocalTasks).toHaveBeenCalled();
    });

    it("should sync local pomodoros when user logs in", async () => {
      const mockUser: User = {
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
      };

      const localPomodoros = [
        {
          id: "local-pomo-1",
          taskId: "task-1",
          duration: 25,
          type: "work" as const,
        },
      ];

      vi.mocked(usePomodoroStore).mockReturnValue({
        sessions: localPomodoros,
        clearLocalPomodoros: mockClearLocalPomodoros,
        addSession: vi.fn(),
      });

      profileDataLoader.execute.mockResolvedValue(mockUser);
      syncLocalPomodoros.execute.mockResolvedValue(undefined);

      render(
        <AuthProvider
          profileDataLoaderUseCase={
            profileDataLoader as unknown as ProfileDataLoaderUseCase
          }
          syncLocalTasksUseCase={
            syncLocalTasks as unknown as SyncLocalTasksUseCase
          }
          syncLocalPomodorosUseCase={
            syncLocalPomodoros as unknown as SyncLocalPomodorosUseCase
          }
        >
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("has-loaded")).toHaveTextContent("true");
      });

      expect(syncLocalPomodoros.execute).toHaveBeenCalledWith(localPomodoros);
      expect(mockClearLocalPomodoros).toHaveBeenCalled();
    });

    it("should not sync when there are no local tasks", async () => {
      const mockUser: User = {
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
      };

      profileDataLoader.execute.mockResolvedValue(mockUser);

      render(
        <AuthProvider
          profileDataLoaderUseCase={
            profileDataLoader as unknown as ProfileDataLoaderUseCase
          }
          syncLocalTasksUseCase={
            syncLocalTasks as unknown as SyncLocalTasksUseCase
          }
          syncLocalPomodorosUseCase={
            syncLocalPomodoros as unknown as SyncLocalPomodorosUseCase
          }
        >
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("has-loaded")).toHaveTextContent("true");
      });

      expect(syncLocalTasks.execute).not.toHaveBeenCalled();
      expect(mockClearLocalTasks).not.toHaveBeenCalled();
    });

    it("should handle sync errors gracefully", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const mockUser: User = {
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
      };

      const localTasks = [
        {
          id: "local-1",
          title: "Local Task 1",
          description: "",
          completed: false,
          createdAt: new Date(),
        },
      ];

      vi.mocked(useTaskStore).mockReturnValue({
        localTasks,
        clearLocalTasks: mockClearLocalTasks,
        selectedTask: null,
        selectTask: vi.fn(),
        addLocalTask: vi.fn(),
        updateLocalTask: vi.fn(),
        deleteLocalTask: vi.fn(),
      });

      profileDataLoader.execute.mockResolvedValue(mockUser);
      syncLocalTasks.execute.mockRejectedValue(new Error("Sync failed"));

      render(
        <AuthProvider
          profileDataLoaderUseCase={
            profileDataLoader as unknown as ProfileDataLoaderUseCase
          }
          syncLocalTasksUseCase={
            syncLocalTasks as unknown as SyncLocalTasksUseCase
          }
          syncLocalPomodorosUseCase={
            syncLocalPomodoros as unknown as SyncLocalPomodorosUseCase
          }
        >
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("has-loaded")).toHaveTextContent("true");
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to sync local tasks:",
        expect.any(Error)
      );
      expect(mockClearLocalTasks).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("loadData function", () => {
    it("should expose loadData function in context", async () => {
      const mockUser: User = {
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
      };

      profileDataLoader.execute.mockResolvedValue(mockUser);

      const TestComponentWithLoadData = () => {
        const { loadData, hasLoaded } = useAuth();

        return (
          <div>
            <div data-testid="has-loaded">{hasLoaded.toString()}</div>
            <button onClick={loadData} data-testid="reload-button">
              Reload
            </button>
          </div>
        );
      };

      render(
        <AuthProvider
          profileDataLoaderUseCase={
            profileDataLoader as unknown as ProfileDataLoaderUseCase
          }
          syncLocalTasksUseCase={
            syncLocalTasks as unknown as SyncLocalTasksUseCase
          }
          syncLocalPomodorosUseCase={
            syncLocalPomodoros as unknown as SyncLocalPomodorosUseCase
          }
        >
          <TestComponentWithLoadData />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("has-loaded")).toHaveTextContent("true");
      });

      profileDataLoader.execute.mockClear();

      const reloadButton = screen.getByTestId("reload-button");
      reloadButton.click();

      await waitFor(() => {
        expect(profileDataLoader.execute).toHaveBeenCalled();
      });
    });
  });
});
