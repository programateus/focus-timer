import { useReducer } from "react";

import cn from "@presentation/utils/cn";
import { useTasks } from "@presentation/hooks/use-tasks";
import type { Task as TaskType } from "@domain/entities/task";

import Dialog from "../dialog";
import { TaskForm } from "../task-form";
import { DeleteTask } from "../delete-task";
import { dialogReducer, initialState } from "../dialog/dialog-reducer";

import { TaskMenu } from "./menu";

interface TaskProps {
  task: TaskType;
  onSelect?: (task: TaskType) => void;
}

export const Task = ({ task, onSelect }: TaskProps) => {
  const { selectedTask, updateTask } = useTasks();
  const isSelected = selectedTask?.id === task.id;
  const [dialogState, dispatch] = useReducer(dialogReducer, initialState);

  const handleClick = () => {
    onSelect?.(task);
  };

  const handleToggleComplete = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    updateTask(task.id, {
      completed: !task.completed,
    });
  };

  const handleUpdateClick = () => {
    dispatch({
      type: "OPEN",
      payload: {
        title: "Update Task",
        content: <TaskForm onClose={handleCloseDialog} task={task} />,
      },
    });
  };

  const handleDeleteClick = () => {
    dispatch({
      type: "OPEN",
      payload: {
        title: "Delete Task",
        content: <DeleteTask onClose={handleCloseDialog} task={task} />,
      },
    });
  };

  const handleCloseDialog = () => {
    dispatch({ type: "CLOSE" });
  };

  return (
    <div
      className={cn(
        "card bg-base-100 shadow-sm border cursor-pointer transition-colors",
        {
          "border-primary bg-primary/10": isSelected,
          "border-base-300 hover:border-base-400": !isSelected,
        }
      )}
      onClick={handleClick}
      data-testid={`task-${task.id}`}
    >
      <div className="card-body p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <input
              type="checkbox"
              className="checkbox checkbox-sm mt-1"
              checked={task.completed}
              onChange={handleToggleComplete}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex-1 min-w-0">
              <h3
                className={cn("font-medium truncate", {
                  "line-through text-base-content/50": task.completed,
                })}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-base-content/70 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <TaskMenu
              onDelete={handleDeleteClick}
              onUpdate={handleUpdateClick}
            />
          </div>
        </div>
      </div>

      <Dialog
        isOpen={dialogState.isOpen}
        title={dialogState.title || ""}
        description={dialogState.description || ""}
        onClose={handleCloseDialog}
      >
        {dialogState.content}
      </Dialog>
    </div>
  );
};
