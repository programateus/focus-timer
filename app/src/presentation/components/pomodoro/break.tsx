import { Timer } from "./timer";

export const Break = () => {
  const handleBreakComplete = () => {
    console.log("Break completed!");
  };

  return (
    <Timer
      initialMinutes={5}
      title="Break Time"
      progressColor="success"
      buttonColor="btn-success"
      onComplete={handleBreakComplete}
    />
  );
};
