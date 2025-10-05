import { RiPlayFill, RiPauseFill, RiStopFill } from "react-icons/ri";

import { Button } from "@presentation/components/button";
import { Icon } from "@presentation/components/icon";
import { useCountdown } from "@presentation/hooks/use-countdown";
import { useMemo, useEffect } from "react";
import { useTasks } from "../../hooks/use-tasks";
import {
  usePomodoroStore,
  type PomodoroSession,
} from "../../stores/pomodoro-store";
import { usePomodoros } from "../../hooks/use-pomodoros";

interface TimerProps {
  initialMinutes: number;
  title: string;
  progressColor?: "primary" | "success" | "warning";
  buttonColor?: "btn-primary" | "btn-success" | "btn-warning";
  type: "work" | "break";
}

export const Timer = ({
  initialMinutes,
  title,
  progressColor = "primary",
  buttonColor = "btn-primary",
  type,
}: TimerProps) => {
  const { selectedTask } = useTasks();
  const { setCurrentSession, currentSession } = usePomodoroStore();
  const { addPomodoro } = usePomodoros();

  const handleSessionComplete = async (session: PomodoroSession) => {
    try {
      await addPomodoro({
        taskId: session.taskId,
        duration: session.duration,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        type: session.type,
      });
    } catch (error) {
      console.error("Failed to sync pomodoro:", error);
    }
  };

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
    onComplete: async () => {
      if (currentSession && selectedTask) {
        const completedAt = new Date();
        const completedSession = {
          ...currentSession,
          completedAt,
        };
        await handleSessionComplete(completedSession);
      }
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
    handleSessionComplete({
      id: currentSession?.id || crypto.randomUUID(),
      taskId: currentSession?.taskId || selectedTask?.id || "",
      duration: initialMinutes * 60 - time,
      startedAt: currentSession?.startedAt || new Date(),
      completedAt: new Date(),
      type,
    });
    setCurrentSession(null);
    stop();
  };

  useEffect(() => {
    reset();
  }, [selectedTask?.id, reset]);

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
    <div
      className="flex flex-col items-center justify-center h-full gap-4 min-w-0"
      data-testid="timer-component"
      aria-label={`${title} timer`}
    >
      <div className="flex flex-col space-y-4 my-auto w-full min-w-0">
        <div
          className="flex flex-col items-center max-w-[270px] mx-auto"
          role="timer"
          aria-label={`${title} timer: ${formattedTime}`}
          data-testid="timer-display"
        >
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
            data-testid="start-button"
          >
            <Icon Icon={RiPlayFill} />
            Start
          </Button>
        ) : (
          <Button
            onClick={handlePause}
            className="btn-warning"
            data-testid="pause-button"
          >
            <Icon Icon={RiPauseFill} />
            Pause
          </Button>
        )}

        <Button
          onClick={handleStop}
          className="btn-outline"
          disabled={!isRunning}
          data-testid="stop-button"
        >
          <Icon Icon={RiStopFill} />
          Stop
        </Button>
      </div>
    </div>
  );
};
