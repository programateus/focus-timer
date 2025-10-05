import { BrowserRouter, useRoutes } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@presentation/react-query/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastProvider } from "@presentation/providers/toast-provider";
import { AuthProvider } from "@presentation/providers/auth-provider";
import { SyncLocalTasksUseCase } from "@application/use-cases/task/sync-local-tasks-use-case";
import { SyncLocalPomodorosUseCase } from "@application/use-cases/pomodoro/sync-local-pomodoros-use-case";
import { ProfileDataLoaderUseCase } from "@application/use-cases/profile/profile-data-loader-use-case";

import { routes } from "./presentation/routes";
import container from "@infra/inversify/container";

const profileDataLoaderUseCase = container.get(ProfileDataLoaderUseCase);
const syncLocalTasksUseCase = container.get(SyncLocalTasksUseCase);
const syncLocalPomodorosUseCase = container.get(SyncLocalPomodorosUseCase);

const AppRoutes = () => {
  return useRoutes(routes);
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider
            profileDataLoaderUseCase={profileDataLoaderUseCase}
            syncLocalTasksUseCase={syncLocalTasksUseCase}
            syncLocalPomodorosUseCase={syncLocalPomodorosUseCase}
          >
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
