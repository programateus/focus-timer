import { useState } from "react";
import { Ongoing } from "./ongoing";
import { Break } from "./break";

type Tabs = "ongoing" | "break";

export const Pomodoro = () => {
  const [pomodoroTabs, setPomodoroTabs] = useState<Tabs>("ongoing");

  return (
    <div className="space-y-2 flex flex-col h-full">
      <div className="tabs tabs-box justify-center">
        <input
          type="radio"
          name="pomodoroTabs"
          className="tab"
          aria-label="Ongoing"
          checked={pomodoroTabs === "ongoing"}
          onChange={() => setPomodoroTabs("ongoing")}
        />
        <input
          type="radio"
          name="pomodoroTabs"
          className="tab"
          aria-label="Break"
          checked={pomodoroTabs === "break"}
          onChange={() => setPomodoroTabs("break")}
        />
      </div>
      {pomodoroTabs === "ongoing" && <Ongoing />}
      {pomodoroTabs === "break" && <Break />}
    </div>
  );
};
