import { Timer } from "./timer";

export const Ongoing = () => {
  return (
    <Timer
      initialMinutes={25}
      title="Focus"
      progressColor="primary"
      buttonColor="btn-primary"
      type="work"
    />
  );
};
