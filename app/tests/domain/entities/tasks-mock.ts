import { faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";

import { Task } from "@domain/entities/task";

export const generateTask = (data?: Partial<Task>): Task => {
  return {
    id: createId(),
    title: faker.lorem.words(3),
    description: faker.datatype.boolean() ? faker.lorem.sentence() : null,
    completed: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...(data ?? {}),
  };
};
