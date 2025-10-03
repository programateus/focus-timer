import type { Task } from "@domain/entities/task";
import { useTasks } from "@presentation/hooks/use-tasks";

import { Button } from "../button";

type DeleteTaskProps = {
  onClose: () => void;
  task: Task;
};

export const DeleteTask = ({ onClose, task }: DeleteTaskProps) => {
  const { deleteTask } = useTasks();

  const handleDelete = () => {
    deleteTask(task.id);
    onClose();
  };

  return (
    <div
      role="region"
      aria-label="Delete task confirmation"
      className="flex flex-col gap-4"
    >
      <p>
        Are you sure you want to delete this task? This action cannot be undone.
      </p>

      <div className="border-neutral border p-4 rounded-box">
        <h3 className="font-medium mb-1">{task.title}</h3>
        {task.description && <p className="text-sm">{task.description}</p>}
      </div>

      <div className="flex gap-3 justify-between">
        <Button className="btn-outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className="btn-error" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};
