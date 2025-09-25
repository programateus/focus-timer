import { RiAddFill } from "react-icons/ri";

import { Button } from "@presentation/components/button";
import { Icon } from "@presentation/components/icon";
import { Task } from "@presentation/components/task";
import { Pomodoro } from "../../components/pomodoro/pomodoro";

export const HomeScreen = () => {
  return (
    <div className="container mx-auto">
      <div className="md:h-screen flex gap-8 p-12">
        <div className="rounded-box bg-base-200 flex flex-col flex-1 px-4 py-2 min-w-0">
          <h2 className="py-4">
            Task List <span className="text-base-content/50">(6 tasks)</span>
          </h2>
          <div className="list overflow-y-auto grow gap-2 px-2">
            <Task />
            <Task />
            <Task />
            <Task />
            <Task />
            <Task />
            <Task />
            <Task />
            <Task />
            <Task />
            <Task />
            <Task />
            <Task />
          </div>
          <div className="flex py-4">
            <Button className="btn-primary btn-ghost mx-auto">
              <Icon Icon={RiAddFill} />
              Create task
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-8 flex-1 min-w-0">
          <div className="rounded-box bg-base-200 p-4">
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <h2>Daily Progress</h2>
                <div className="flex items-baseline gap-2">
                  <span className="badge badge-primary">3/8</span>{" "}
                  <span>Tasks was done</span>
                </div>
              </div>
              <div className="ml-auto">
                <div
                  className="radial-progress bg-primary text-primary-content border-primary border-4"
                  style={{ "--value": 70 } as React.CSSProperties}
                  aria-valuenow={70}
                  role="progressbar"
                >
                  70%
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-box bg-base-200 flex-1 p-4">
            <Pomodoro />
          </div>
        </div>
      </div>
    </div>
  );
};
