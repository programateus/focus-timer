import { useMemo } from "react";
import { useAuth } from "./use-auth";
import { useTaskStore } from "@presentation/stores/task-store";
import { useListTask } from "./react-query/hooks/task/use-list-task";
import { useCreateTask } from "./react-query/hooks/task/use-create-task";
import { useUpdateTask } from "./react-query/hooks/task/use-update-task";
import { useDeleteTask } from "./react-query/hooks/task/use-delete-task";
import type { CreateTaskDTO } from "@application/dtos/create-task-dto";
import type { UpdateTaskDTO } from "@application/dtos/update-task-dto";

export const useTasks = () => {
  const { isAuthenticated } = useAuth();
  const {
    selectedTask,
    localTasks,
    selectTask,
    addLocalTask,
    updateLocalTask,
    deleteLocalTask,
  } = useTaskStore();

  const { data: serverTasks = [] } = useListTask({
    enabled: isAuthenticated,
  });
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const tasks = useMemo(() => {
    return isAuthenticated ? serverTasks : localTasks;
  }, [isAuthenticated, serverTasks, localTasks]);

  const addTask = async (data: CreateTaskDTO) => {
    if (isAuthenticated) {
      return createTaskMutation.mutateAsync(data);
    } else {
      return addLocalTask(data);
    }
  };

  const updateTask = async (id: string, data: UpdateTaskDTO) => {
    if (isAuthenticated) {
      return updateTaskMutation.mutateAsync({ id, data });
    } else {
      updateLocalTask(id, data);
    }
  };

  const deleteTask = async (id: string) => {
    if (isAuthenticated) {
      return deleteTaskMutation.mutateAsync(id);
    } else {
      deleteLocalTask(id);
    }
  };

  return {
    tasks,
    selectedTask,
    selectTask,
    addTask,
    updateTask,
    deleteTask,
    isLoading: isAuthenticated
      ? createTaskMutation.isPending ||
        updateTaskMutation.isPending ||
        deleteTaskMutation.isPending
      : false,
  };
};
