import { useState, useEffect, useCallback } from "react";

interface UseCountdownProps {
  initialMinutes: number;
  onComplete?: () => void;
}

interface UseCountdownReturn {
  time: number;
  isRunning: boolean;
  progress: number;
  formattedTime: string;
  start: () => void;
  pause: () => void;
  stop: () => void;
  reset: () => void;
}

export const useCountdown = ({
  initialMinutes,
  onComplete,
}: UseCountdownProps): UseCountdownReturn => {
  const initialTime = initialMinutes * 60;
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, time, onComplete]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    setTime(initialTime);
  }, [initialTime]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTime(initialTime);
  }, [initialTime]);

  const progress = ((initialTime - time) / initialTime) * 100;
  const formattedTime = formatTime(time);

  return {
    time,
    isRunning,
    progress,
    formattedTime,
    start,
    pause,
    stop,
    reset,
  };
};
