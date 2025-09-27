import { mergeQueryKeys } from "@lukemorales/query-key-factory";

import { taskKeys } from "./task";

export const queryKeys = mergeQueryKeys(taskKeys);
