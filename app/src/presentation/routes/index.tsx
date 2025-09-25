import type { RouteObject } from "react-router";

import { HomeScreen } from "@presentation/screens/home/home-screen";
import { SignInScreen } from "@presentation/screens/sign-in/sign-in-screen";
import { SignUpScreen } from "@presentation/screens/sign-up/sign-up-screen";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomeScreen />,
  },
  {
    path: "/sign-in",
    element: <SignInScreen />,
  },
  {
    path: "/sign-up",
    element: <SignUpScreen />,
  },
];
