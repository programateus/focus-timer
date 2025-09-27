import { Timer } from "./timer";

export const Break = () => {
  return (
    <Timer
      initialMinutes={5}
      title="Pause"
      progressColor="success"
      buttonColor="btn-success"
      type="break"
    />
  );
};
