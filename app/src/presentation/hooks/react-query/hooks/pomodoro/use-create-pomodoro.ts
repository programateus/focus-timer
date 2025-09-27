import { useMutation, useQueryClient } from "@tanstack/react-query";

import container from "@infra/inversify/container";
import type { CreatePomodoroDTO } from "@application/dtos/create-pomodoro-dto";
import type { Pomodoro } from "@domain/entities/pomodoro";
import { CreatePomodoroUseCase } from "@application/use-cases/pomodoro/create-pomodoro-use-case";
import { queryKeys } from "../../query-keys";

const createPomodoroUseCase = container.get(CreatePomodoroUseCase);

export const useCreatePomodoro = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePomodoroDTO) =>
      createPomodoroUseCase.execute(data),
    onSuccess: (newPomodoro) => {
      queryClient.setQueryData(
        queryKeys.pomodoro.list().queryKey,
        (old: Pomodoro[] = []) => [...old, newPomodoro]
      );
    },
  });
};
