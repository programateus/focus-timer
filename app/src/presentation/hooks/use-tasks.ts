import { useListTask } from "./react-query/hooks/task/use-list-task";
import { useCreateTask } from "./react-query/hooks/task/use-create-task";
import { useUpdateTask } from "./react-query/hooks/task/use-update-task";
import { useDeleteTask } from "./react-query/hooks/task/use-delete-task";
import { useTaskStore } from "@presentation/stores/task-store";
import type { CreateTaskDTO } from "@application/dtos/create-task-dto";
import type { UpdateTaskDTO } from "@application/dtos/update-task-dto";

export const useTasks = () => {
  const { selectedTask, selectTask } = useTaskStore();

  // React Query hooks para dados do servidor
  const { data: tasks = [], isLoading, error } = useListTask();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const addTask = async (data: CreateTaskDTO) => {
    await createTaskMutation.mutateAsync(data);
  };

  const updateTask = async (id: string, data: UpdateTaskDTO) => {
    await updateTaskMutation.mutateAsync({ id, data });
  };

  const deleteTask = async (id: string) => {
    await deleteTaskMutation.mutateAsync(id);
  };

  return {
    // Dados do servidor (React Query)
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,

    // Estado local (Zustand)
    selectedTask,
    selectTask,

    // Status das mutations
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
};
