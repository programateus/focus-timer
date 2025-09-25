import { Timer } from "./timer";

export const Ongoing = () => {
  const handleSessionComplete = () => {
    console.log("Focus session completed!");
  };

  return (
    <Timer
      initialMinutes={25}
      title="Focus"
      progressColor="primary"
      buttonColor="btn-primary"
      type="work"
      onComplete={handleSessionComplete}
    />
  );
};
