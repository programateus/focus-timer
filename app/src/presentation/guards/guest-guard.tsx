import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

import { useAuth } from "@presentation/hooks/use-auth";

interface Props {
  children: React.ReactNode;
}

export function GuestGuard({ children }: Props) {
  const { isAuthenticated, hasLoaded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    if (isAuthenticated) {
      navigate("/", { replace: true, state: { from: location } });
    }
  }, [isAuthenticated, navigate, location, hasLoaded]);

  if (!hasLoaded || isAuthenticated) return null;

  return <>{children}</>;
}
