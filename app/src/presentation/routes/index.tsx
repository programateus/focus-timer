import type { RouteObject } from "react-router";

import { HomeScreen } from "@presentation/screens/home/home-screen";
import { SignInScreen } from "@presentation/screens/sign-in/sign-in-screen";
import { SignUpScreen } from "@presentation/screens/sign-up/sign-up-screen";
import { GuestGuard } from "@presentation/guards/guest-guard";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomeScreen />,
  },
  {
    path: "/sign-in",
    element: (
      <GuestGuard>
        <SignInScreen />
      </GuestGuard>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <GuestGuard>
        <SignUpScreen />
      </GuestGuard>
    ),
  },
];
