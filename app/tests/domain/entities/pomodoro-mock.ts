import type { CreatePomodoroDTO } from "@application/dtos/create-pomodoro-dto";
import type { Pomodoro } from "@domain/entities/pomodoro";
import { faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";
import { add } from "date-fns";

export const generatePomodoro = (data?: Partial<Pomodoro>): Pomodoro => {
  const startedAt = data?.startedAt ?? faker.date.recent();
  const duration = data?.duration ?? faker.helpers.arrayElement([5, 25]);
  const completedAt = add(startedAt, { minutes: duration });

  return {
    id: createId(),
    taskId: createId(),
    duration: duration,
    startedAt,
    completedAt,
    type: faker.helpers.arrayElement(["work", "break"]),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...(data ?? {}),
  };
};

export const generateCreatePomodoroDTO = (
  data?: Partial<CreatePomodoroDTO>
): CreatePomodoroDTO => {
  const startedAt = data?.startedAt ?? faker.date.recent();
  const duration = data?.duration ?? faker.helpers.arrayElement([5, 25]);
  const completedAt = add(startedAt, { minutes: duration });
  return {
    taskId: createId(),
    duration,
    startedAt,
    completedAt,
    type: faker.helpers.arrayElement(["work", "break"]),
  };
};
