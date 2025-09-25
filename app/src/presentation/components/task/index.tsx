import { RiTimeLine } from "react-icons/ri";
import { useTaskStore, type Task as TaskType } from "../../stores/task-store";
import { Icon } from "../icon";
import cn from "@presentation/utils/cn";

interface TaskProps {
  task: TaskType;
  onSelect?: (task: TaskType) => void;
}

export const Task = ({ task, onSelect }: TaskProps) => {
  const { selectedTask, updateTask } = useTaskStore();
  const isSelected = selectedTask?.id === task.id;

  const handleClick = () => {
    onSelect?.(task);
  };

  const handleToggleComplete = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    updateTask(task.id, {
      completed: !task.completed,
      updatedAt: new Date(),
    });
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
          <div className="flex items-center gap-2">
            {isSelected && (
              <div className="badge badge-primary badge-sm">
                <Icon Icon={RiTimeLine} size="xs" />
                Ativa
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
