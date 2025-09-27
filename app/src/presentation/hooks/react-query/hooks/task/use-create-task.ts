import { useMutation, useQueryClient } from "@tanstack/react-query";

import container from "@infra/inversify/container";
import type { CreateTaskDTO } from "@application/dtos/create-task-dto";
import { CreateTaskUseCase } from "@application/use-cases/task/create-task-use-case";
import { queryKeys } from "../../query-keys";

const createTaskUseCase = container.get(CreateTaskUseCase);

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTaskDTO) => createTaskUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.task._def });
    },
  });
};
