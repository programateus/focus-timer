import { useMemo } from "react";
import { useAuth } from "./use-auth";
import {
  usePomodoroStore,
  type PomodoroSession,
} from "@presentation/stores/pomodoro-store";
import { useListPomodoro } from "./react-query/hooks/pomodoro/use-list-pomodoro";
import { useCreatePomodoro } from "./react-query/hooks/pomodoro/use-create-pomodoro";
import type { CreatePomodoroDTO } from "@application/dtos/create-pomodoro-dto";

export const usePomodoros = () => {
  const { isAuthenticated } = useAuth();
  const { sessions: localPomodoros, addSession } = usePomodoroStore();

  const { data: serverPomodoros = [] } = useListPomodoro({
    enabled: isAuthenticated,
  });
  const createPomodoroMutation = useCreatePomodoro();

  const pomodoros = useMemo(() => {
    return isAuthenticated ? serverPomodoros : localPomodoros;
  }, [isAuthenticated, serverPomodoros, localPomodoros]);

  const addPomodoro = async (data: CreatePomodoroDTO) => {
    if (isAuthenticated) {
      return createPomodoroMutation.mutateAsync(data);
    } else {
      const localPomodoro: PomodoroSession = {
        id: crypto.randomUUID(),
        ...data,
      };
      addSession(localPomodoro);
      return localPomodoro;
    }
  };

  return {
    pomodoros,
    addPomodoro,
    isLoading: isAuthenticated ? createPomodoroMutation.isPending : false,
  };
};
