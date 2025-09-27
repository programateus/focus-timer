import { useCallback, useEffect, useState } from "react";

import { User } from "@domain/entities/User";
import container from "@infra/inversify/container";
import { AuthContext } from "@presentation/contexts/auth-context";
import { ProfileDataLoaderUseCase } from "@application/use-cases/profile/profile-data-loader-use-case";

type AuthProviderProps = {
  children: React.ReactNode;
};

const profileDataLoaderUseCase = container.get(ProfileDataLoaderUseCase);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const userData = await profileDataLoaderUseCase.execute();
      setUser(userData);
      setIsAuthenticated(!!userData);
      setHasLoaded(true);
    } catch (e) {
      console.log(e);
      setUser(null);
      setIsAuthenticated(false);
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        hasLoaded,
        user,
        loadData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
