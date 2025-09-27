import type { BindingDefinition } from "@infra/inversify/types";
import { signUpUseCaseBinding } from "./use-cases/auth/sign-up-use-case";
import { signInUseCaseBinding } from "./use-cases/auth/sign-in-use-case";
import { profileDataLoaderUseCaseBinding } from "./use-cases/profile/profile-data-loader-use-case";
import { createTaskUseCaseBinding } from "./use-cases/task/create-task-use-case";
import { listTaskUseCaseBinding } from "./use-cases/task/list-task-use-case";
import { updateTaskUseCaseBinding } from "./use-cases/task/update-task-use-case";
import { deleteTaskUseCaseBinding } from "./use-cases/task/delete-task-use-case";
import { syncLocalTasksUseCaseBinding } from "./use-cases/task/sync-local-tasks-use-case";
import { createPomodoroUseCaseBinding } from "./use-cases/pomodoro/create-pomodoro-use-case";
import { listPomodoroUseCaseBinding } from "./use-cases/pomodoro/list-pomodoro-use-case";
import { syncLocalPomodorosUseCaseBinding } from "./use-cases/pomodoro/sync-local-pomodoros-use-case";

export const applicationBindings: BindingDefinition[] = [
  signUpUseCaseBinding,
  signInUseCaseBinding,
  profileDataLoaderUseCaseBinding,
  createTaskUseCaseBinding,
  listTaskUseCaseBinding,
  updateTaskUseCaseBinding,
  deleteTaskUseCaseBinding,
  syncLocalTasksUseCaseBinding,
  createPomodoroUseCaseBinding,
  listPomodoroUseCaseBinding,
  syncLocalPomodorosUseCaseBinding,
];
