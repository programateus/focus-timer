import { usePomodoroStore } from "../../stores/pomodoro-store";
import { useTaskStore } from "../../stores/task-store";

export const PomodoroStats = () => {
  const { getStats } = usePomodoroStore();
  const { tasks } = useTaskStore();

  const stats = getStats();
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="rounded-box bg-base-200 p-4">
      <div className="flex items-center gap-4">
        <div className="space-y-2">
          <h2>Daily Progress</h2>
          <div className="flex items-baseline gap-2">
            <span className="badge badge-primary">
              {completedTasks}/{totalTasks}
            </span>
            <span>Completed Tasks</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="badge badge-secondary">
              {stats.totalPomodoros}
            </span>
            <span>Pomodoros</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="badge badge-accent">{stats.totalBreaks}</span>
            <span>Breaks</span>
          </div>
          {stats.totalWorkTime > 0 && (
            <div className="flex items-baseline gap-2">
              <span className="badge badge-info">
                {formatTime(stats.totalWorkTime)}
              </span>
              <span>Total time</span>
            </div>
          )}
        </div>
        <div className="ml-auto">
          <div
            className="radial-progress bg-primary text-primary-content border-primary border-4"
            style={
              {
                "--value":
                  totalTasks > 0
                    ? Math.round((completedTasks / totalTasks) * 100)
                    : 0,
              } as React.CSSProperties
            }
            aria-valuenow={
              totalTasks > 0
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0
            }
            role="progressbar"
          >
            {totalTasks > 0
              ? Math.round((completedTasks / totalTasks) * 100)
              : 0}
            %
          </div>
        </div>
      </div>
    </div>
  );
};
