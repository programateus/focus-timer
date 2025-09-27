import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../query-keys";
import { ListTaskUseCase } from "@application/use-cases/task/list-task-use-case";
import container from "@infra/inversify/container";

const listTaskUseCase = container.get(ListTaskUseCase);

export const useListTask = () => {
  return useQuery({
    initialData: [],
    queryKey: queryKeys.task.list().queryKey,
    queryFn: () => listTaskUseCase.execute(),
  });
};
