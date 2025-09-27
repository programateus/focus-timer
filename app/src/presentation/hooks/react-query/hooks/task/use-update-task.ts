import { useMutation, useQueryClient } from "@tanstack/react-query";

import container from "@infra/inversify/container";
import type { UpdateTaskDTO } from "@application/dtos/update-task-dto";
import type { Task } from "@domain/entities/task";
import { UpdateTaskUseCase } from "@application/use-cases/task/update-task-use-case";
import { queryKeys } from "../../query-keys";

const updateTaskUseCase = container.get(UpdateTaskUseCase);

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTaskDTO }) =>
      updateTaskUseCase.execute(id, data),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(
        queryKeys.task.list().queryKey,
        (old: Task[] = []) =>
          old.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    },
  });
};
