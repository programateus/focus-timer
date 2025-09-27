import { RiPlayFill, RiPauseFill, RiStopFill } from "react-icons/ri";

import { Button } from "@presentation/components/button";
import { Icon } from "@presentation/components/icon";
import { useCountdown } from "@presentation/hooks/use-countdown";
import { useMemo, useEffect } from "react";
import { useTasks } from "../../hooks/use-tasks";
import { usePomodoroStore } from "../../stores/pomodoro-store";

interface TimerProps {
  initialMinutes: number;
  title: string;
  progressColor?: "primary" | "success" | "warning";
  buttonColor?: "btn-primary" | "btn-success" | "btn-warning";
  type: "work" | "break";
  onComplete?: () => void;
}

export const Timer = ({
  initialMinutes,
  title,
  progressColor = "primary",
  buttonColor = "btn-primary",
  type,
  onComplete,
}: TimerProps) => {
  const { selectedTask } = useTasks();
  const { addSession, setCurrentSession, currentSession } = usePomodoroStore();

  const {
    formattedTime,
    isRunning,
    progress,
    start,
    pause,
    stop,
    time,
    reset,
  } = useCountdown({
    initialMinutes,
    onComplete: () => {
      if (currentSession && selectedTask) {
        const completedAt = new Date();
        addSession({
          ...currentSession,
          completedAt,
        });
      }
      onComplete?.();
    },
  });

  const handleStart = () => {
    if (!selectedTask) {
      return;
    }
    setCurrentSession({
      id: crypto.randomUUID(),
      taskId: selectedTask.id,
      duration: initialMinutes * 60,
      startedAt: new Date(),
      completedAt: new Date(0),
      type,
    });
    start();
  };

  const handlePause = () => {
    pause();
  };

  const handleStop = () => {
    setCurrentSession(null);
    stop();
  };

  useEffect(() => {
    if (!isRunning) {
      reset();
    }
  }, [selectedTask?.id, reset, isRunning]);

  useEffect(() => {
    if (!currentSession) {
      reset();
    }
  }, [currentSession, reset]);

  const endTimeString = useMemo(() => {
    if (!currentSession?.startedAt || !isRunning) return "";
    const endTime = new Date(currentSession.startedAt.getTime() + time * 1000);
    return `Ends at ${endTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }, [currentSession?.startedAt, time, isRunning]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 min-w-0">
      <div className="flex flex-col space-y-4 my-auto w-full min-w-0">
        <div className="flex flex-col items-center max-w-[270px] mx-auto">
          <span className="text-8xl font-mono tabular-nums">
            {formattedTime}
          </span>
          <span className="text-sm text-base-content/50">{endTimeString}</span>
          <progress
            className={`progress progress-${progressColor}`}
            value={progress}
            max="100"
          />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          {selectedTask && (
            <p className="text-base-content/70 mt-1">
              <span className="font-medium">{selectedTask.title}</span>
            </p>
          )}
          {!selectedTask && type === "work" && (
            <p className="text-warning mt-1">Select a task to start</p>
          )}
        </div>
      </div>

      <div className="space-x-4 mt-auto">
        {!isRunning ? (
          <Button
            onClick={handleStart}
            className={buttonColor}
            disabled={type === "work" && !selectedTask}
          >
            <Icon Icon={RiPlayFill} />
            Start
          </Button>
        ) : (
          <Button onClick={handlePause} className="btn-warning">
            <Icon Icon={RiPauseFill} />
            Pause
          </Button>
        )}

        <Button
          onClick={handleStop}
          className="btn-outline"
          disabled={!isRunning}
        >
          <Icon Icon={RiStopFill} />
          Stop
        </Button>
      </div>
    </div>
  );
};
