import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

import { useAuth } from "@presentation/hooks/use-auth";

interface Props {
  children: React.ReactNode;
}

export function AuthGuard({ children }: Props) {
  const { isAuthenticated, hasLoaded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }
  }, [isAuthenticated, navigate, location, hasLoaded]);

  if (!hasLoaded) return null;

  return <>{children}</>;
}
