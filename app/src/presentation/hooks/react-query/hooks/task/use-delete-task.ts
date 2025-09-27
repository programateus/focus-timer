import { useMutation, useQueryClient } from "@tanstack/react-query";

import container from "@infra/inversify/container";
import type { Task } from "@domain/entities/task";
import { DeleteTaskUseCase } from "@application/use-cases/task/delete-task-use-case";
import { queryKeys } from "../../query-keys";

const deleteTaskUseCase = container.get(DeleteTaskUseCase);

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => deleteTaskUseCase.execute(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(
        queryKeys.task.list().queryKey,
        (old: Task[] = []) => old.filter((task) => task.id !== deletedId)
      );
    },
  });
};
