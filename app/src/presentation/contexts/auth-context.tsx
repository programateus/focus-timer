import { createContext } from "react";

import { User } from "@domain/entities/user";

type AuthContextParams = {
  isAuthenticated: boolean;
  hasLoaded: boolean;
  user: User | null;
  loadData: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextParams | null>(null);
