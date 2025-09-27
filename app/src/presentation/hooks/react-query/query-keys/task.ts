import { createQueryKeys } from "@lukemorales/query-key-factory";

export const taskKeys = createQueryKeys("task", {
  list: () => ["list"],
  detail: (id: string) => ["detail", id],
});
