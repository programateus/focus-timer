import type { Task } from "@domain/entities/task";
import type { CreateTaskDTO } from "@application/dtos/create-task-dto";
import type { UpdateTaskDTO } from "@application/dtos/update-task-dto";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TaskState {
  selectedTask: Task | null;
  localTasks: Task[];
  selectTask: (task: Task | null) => void;
  addLocalTask: (task: CreateTaskDTO) => Task;
  updateLocalTask: (id: string, data: UpdateTaskDTO) => void;
  deleteLocalTask: (id: string) => void;
  clearLocalTasks: () => void;
  setLocalTasks: (tasks: Task[]) => void;
}

const createLocalTask = (data: CreateTaskDTO): Task => ({
  id: crypto.randomUUID(),
  title: data.title,
  description: data.description || null,
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      selectedTask: null,
      localTasks: [],
      selectTask: (task) => set({ selectedTask: task }),
      addLocalTask: (data) => {
        const newTask = createLocalTask(data);
        set((state) => ({
          localTasks: [...state.localTasks, newTask],
        }));
        return newTask;
      },
      updateLocalTask: (id, data) => {
        set((state) => ({
          localTasks: state.localTasks.map((task) =>
            task.id === id ? { ...task, ...data, updatedAt: new Date() } : task
          ),
        }));
      },
      deleteLocalTask: (id) => {
        set((state) => ({
          localTasks: state.localTasks.filter((task) => task.id !== id),
          selectedTask:
            state.selectedTask?.id === id ? null : state.selectedTask,
        }));
      },
      clearLocalTasks: () => set({ localTasks: [] }),
      setLocalTasks: (tasks) => set({ localTasks: tasks }),
    }),
    {
      name: "task-storage",
      partialize: (state) => ({
        selectedTask: state.selectedTask,
        localTasks: state.localTasks,
      }),
    }
  )
);
