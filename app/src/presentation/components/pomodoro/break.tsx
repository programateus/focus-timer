import { Timer } from "./timer";

export const Break = () => {
  const handleBreakComplete = () => {
    console.log("Break completed!");
  };

  return (
    <Timer
      initialMinutes={5}
      title="Pause"
      progressColor="success"
      buttonColor="btn-success"
      type="break"
      onComplete={handleBreakComplete}
    />
  );
};
