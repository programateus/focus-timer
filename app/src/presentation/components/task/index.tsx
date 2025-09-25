import { useState } from "react";
import cn from "@presentation/utils/cn";

export const Task = () => {
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <div className="flex gap-4 p-2">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => setIsCompleted(!isCompleted)}
        />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span
          className={cn("font-bold", {
            "line-through text-base-content/70": isCompleted,
          })}
        >
          Task title
        </span>
        <span className="text-sm text-base-content/50 truncate">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione omnis
          necessitatibus optio nisi reprehenderit eius corrupti qui error. In
          molestias repellendus quae consequuntur recusandae iure excepturi.
          Molestias sit debitis quia.
        </span>
      </div>
      <div className="flex ml-auto items-end">
        <span className="text-sm text-base-content/50 whitespace-nowrap">
          At 07:30
        </span>
      </div>
    </div>
  );
};
