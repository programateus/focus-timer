import { useCallback, useEffect, useState } from "react";

import { User } from "@domain/entities/user";
import { AuthContext } from "@presentation/contexts/auth-context";
import { ProfileDataLoaderUseCase } from "@application/use-cases/profile/profile-data-loader-use-case";
import { SyncLocalTasksUseCase } from "@application/use-cases/task/sync-local-tasks-use-case";
import { SyncLocalPomodorosUseCase } from "@application/use-cases/pomodoro/sync-local-pomodoros-use-case";
import { useTaskStore } from "@presentation/stores/task-store";
import { usePomodoroStore } from "@presentation/stores/pomodoro-store";

type AuthProviderProps = {
  children: React.ReactNode;
  profileDataLoaderUseCase: ProfileDataLoaderUseCase;
  syncLocalTasksUseCase: SyncLocalTasksUseCase;
  syncLocalPomodorosUseCase: SyncLocalPomodorosUseCase;
};

export const AuthProvider = ({
  children,
  profileDataLoaderUseCase,
  syncLocalTasksUseCase,
  syncLocalPomodorosUseCase,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { localTasks, clearLocalTasks } = useTaskStore();
  const { sessions: localPomodoros, clearLocalPomodoros } = usePomodoroStore();

  const syncLocalTasks = useCallback(async () => {
    if (localTasks.length === 0) return;

    try {
      await syncLocalTasksUseCase.execute(localTasks);
      clearLocalTasks();
    } catch (error) {
      console.error("Failed to sync local tasks:", error);
    }
  }, [localTasks, syncLocalTasksUseCase, clearLocalTasks]);

  const syncLocalPomodoros = useCallback(async () => {
    if (localPomodoros.length === 0) return;

    try {
      await syncLocalPomodorosUseCase.execute(localPomodoros);
      clearLocalPomodoros();
    } catch (error) {
      console.error("Failed to sync local pomodoros:", error);
    }
  }, [localPomodoros, syncLocalPomodorosUseCase, clearLocalPomodoros]);

  const loadData = useCallback(async () => {
    try {
      const userData = await profileDataLoaderUseCase.execute();
      const wasLoggedIn = isAuthenticated;

      setUser(userData);
      setIsAuthenticated(!!userData);
      setHasLoaded(true);

      if (!!userData && !wasLoggedIn) {
        await Promise.all([syncLocalTasks(), syncLocalPomodoros()]);
      }
    } catch (e) {
      console.log(e);
      setUser(null);
      setIsAuthenticated(false);
      setHasLoaded(true);
    }
  }, [
    profileDataLoaderUseCase,
    isAuthenticated,
    syncLocalTasks,
    syncLocalPomodoros,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        hasLoaded,
        user,
        loadData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
