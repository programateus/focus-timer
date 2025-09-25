import { RiPlayFill, RiPauseFill, RiStopFill } from "react-icons/ri";

import { Button } from "@presentation/components/button";
import { Icon } from "@presentation/components/icon";
import { useCountdown } from "@presentation/hooks/use-countdown";
import { useMemo, useState } from "react";

interface TimerProps {
  initialMinutes: number;
  title: string;
  progressColor?: "primary" | "success" | "warning";
  buttonColor?: "btn-primary" | "btn-success" | "btn-warning";
  taskTitle?: string;
  onComplete?: () => void;
}

export const Timer = ({
  initialMinutes,
  title,
  progressColor = "primary",
  buttonColor = "btn-primary",
  taskTitle,
  onComplete,
}: TimerProps) => {
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const { formattedTime, isRunning, progress, start, pause, stop, time } =
    useCountdown({
      initialMinutes,
      onComplete,
    });

  const handleStart = () => {
    // Atualiza o startedAt sempre que o timer é iniciado/retomado
    // para recalcular o tempo de término baseado no tempo restante
    setStartedAt(new Date());
    start();
  };

  const handlePause = () => {
    pause();
  };

  const handleStop = () => {
    setStartedAt(null);
    stop();
  };

  const endTimeString = useMemo(() => {
    if (!startedAt || !isRunning) return "";
    const endTime = new Date(startedAt.getTime() + time * 1000);
    return `Ends at ${endTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }, [startedAt, time, isRunning]);

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
        </div>

        {taskTitle && (
          <div className="w-full">
            <p className="truncate text-center rounded-box bg-base-300 px-4 py-2">
              {taskTitle}
            </p>
          </div>
        )}
      </div>

      <div className="space-x-4 mt-auto">
        {!isRunning ? (
          <Button onClick={handleStart} className={buttonColor}>
            <Icon Icon={RiPlayFill} />
            Start
          </Button>
        ) : (
          <Button onClick={handlePause} className="btn-warning">
            <Icon Icon={RiPauseFill} />
            Pause
          </Button>
        )}

        <Button onClick={handleStop} className="btn-outline">
          <Icon Icon={RiStopFill} />
          Stop
        </Button>
      </div>
    </div>
  );
};
