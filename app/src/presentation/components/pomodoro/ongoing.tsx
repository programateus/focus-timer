import { Timer } from "./timer";

export const Ongoing = () => {
  const handleSessionComplete = () => {
    console.log("Focus session completed!");
  };

  return (
    <Timer
      initialMinutes={25}
      title="Focus Session"
      progressColor="primary"
      buttonColor="btn-primary"
      taskTitle="A veeeeeeeeeeeeeeeery very long task title that should be truncated more longer a little bit"
      onComplete={handleSessionComplete}
    />
  );
};
