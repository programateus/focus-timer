import { mergeQueryKeys } from "@lukemorales/query-key-factory";

import { taskKeys } from "./task";
import { pomodoroKeys } from "./pomodoro";

export const queryKeys = mergeQueryKeys(taskKeys, pomodoroKeys);
