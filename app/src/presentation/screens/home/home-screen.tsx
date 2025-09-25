import { RiAddFill } from "react-icons/ri";
import { useState, useEffect } from "react";

import { Button } from "@presentation/components/button";
import { Icon } from "@presentation/components/icon";
import { Task } from "@presentation/components/task";
import { AuthAlert } from "@presentation/components/auth-alert";
import { TaskSwitchDialog } from "@presentation/components/task-switch-dialog";
import { AddTaskForm } from "@presentation/components/add-task-form";
import { PomodoroStats } from "@presentation/components/pomodoro-stats";
import { Pomodoro } from "@presentation/components/pomodoro/pomodoro";
import {
  useTaskStore,
  type Task as TaskType,
} from "@presentation/stores/task-store";
import Dialog from "@presentation/components/dialog";

export const HomeScreen = () => {
  const { tasks, selectedTask, selectTask, setTasks } = useTaskStore();
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const [pendingTask, setPendingTask] = useState<TaskType | null>(null);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);

  useEffect(() => {
    if (tasks.length === 0) {
      const demoTasks: TaskType[] = [
        {
          id: "1",
          title: "Estudar React e TypeScript",
          description: "Completar o curso de React com TypeScript",
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          title: "Implementar sistema de pomodoro",
          description: "Criar funcionalidade completa de pomodoro timer",
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "3",
          title: "Revisar código do projeto",
          description: "Fazer code review e melhorias",
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      setTasks(demoTasks);
    }
  }, [tasks.length, setTasks]);

  const displayTasks = tasks;

  const handleTaskSelect = (task: TaskType) => {
    if (selectedTask && selectedTask.id !== task.id) {
      setPendingTask(task);
      setShowSwitchDialog(true);
    } else {
      selectTask(task.id === selectedTask?.id ? null : task);
    }
  };

  const handleConfirmSwitch = () => {
    if (pendingTask) {
      selectTask(pendingTask);
    }
    setShowSwitchDialog(false);
    setPendingTask(null);
  };

  const handleCancelSwitch = () => {
    setShowSwitchDialog(false);
    setPendingTask(null);
  };

  return (
    <div className="container mx-auto">
      <div className="md:h-screen flex flex-col p-12">
        <AuthAlert />
        <div className="flex flex-1 gap-8">
          <div className="rounded-box bg-base-200 flex flex-col flex-1 px-4 py-2 min-w-0">
            <h2 className="py-4">
              Task List{" "}
              <span className="text-base-content/50">
                ({displayTasks.length} tasks)
              </span>
            </h2>

            <div className="list overflow-y-auto grow gap-2 px-2 space-y-2">
              {displayTasks.map((task) => (
                <Task key={task.id} task={task} onSelect={handleTaskSelect} />
              ))}

              {displayTasks.length === 0 && (
                <div className="text-center text-base-content/50 py-8">
                  <p>No task found.</p>
                  <p className="text-sm mt-2">Add a task to get started!</p>
                </div>
              )}
            </div>

            <div className="flex py-4">
              <Button
                className="btn-primary w-full"
                onClick={() => setShowAddTaskDialog(true)}
              >
                <Icon Icon={RiAddFill} />
                Add Task
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-8 flex-1 min-w-0">
            <PomodoroStats />
            <div className="rounded-box bg-base-200 flex-1 p-4">
              <Pomodoro />
            </div>
          </div>
        </div>
      </div>

      <TaskSwitchDialog
        isOpen={showSwitchDialog}
        onClose={handleCancelSwitch}
        onConfirm={handleConfirmSwitch}
        currentTaskTitle={selectedTask?.title || ""}
        newTaskTitle={pendingTask?.title || ""}
      />

      <Dialog
        isOpen={showAddTaskDialog}
        onClose={() => setShowAddTaskDialog(false)}
        title="New Task"
      >
        <AddTaskForm onClose={() => setShowAddTaskDialog(false)} />
      </Dialog>
    </div>
  );
};
