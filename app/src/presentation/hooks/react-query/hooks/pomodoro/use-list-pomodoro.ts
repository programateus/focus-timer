import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../query-keys";
import { ListPomodoroUseCase } from "@application/use-cases/pomodoro/list-pomodoro-use-case";
import container from "@infra/inversify/container";

const listPomodoroUseCase = container.get(ListPomodoroUseCase);

export const useListPomodoro = (options?: { enabled?: boolean }) => {
  return useQuery({
    initialData: [],
    queryKey: queryKeys.pomodoro.list().queryKey,
    queryFn: () => listPomodoroUseCase.execute(),
    ...options,
  });
};
