import { BrowserRouter, useRoutes } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@presentation/react-query/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastProvider } from "@presentation/providers/toast-provider";
import { AuthProvider } from "@presentation/providers/auth-provider";

import { routes } from "./presentation/routes";

const AppRoutes = () => {
  return useRoutes(routes);
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
