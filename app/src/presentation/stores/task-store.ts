import type { Task } from "@domain/entities/task";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TaskState {
  selectedTask: Task | null;
  selectTask: (task: Task | null) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      selectedTask: null,
      selectTask: (task) => set({ selectedTask: task }),
    }),
    {
      name: "task-storage",
      partialize: (state) => ({
        selectedTask: state.selectedTask,
      }),
    }
  )
);
