import { useState } from "react";
import { RiCloseLine, RiUserLine } from "react-icons/ri";

import { useAuth } from "@presentation/hooks/use-auth";

import { Button } from "../button";
import { Icon } from "../icon";

export const AuthAlert = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { isAuthenticated } = useAuth();

  if (!isVisible || isAuthenticated) return null;

  return (
    <div role="alert" className="alert alert-info mb-4 relative">
      <Icon Icon={RiUserLine} />
      <div className="flex-1">
        <h3 className="font-bold">Not logged in?</h3>
        <div className="text-xs">
          Please log in to sync your tasks across devices. Without logging in,
          your data will be saved only in this browser.
        </div>
      </div>
      <div className="flex gap-2">
        <Button className="btn-outline btn-sm" to="/sign-in">
          Log In
        </Button>
        <Button
          aria-label="Close alert"
          className="btn-ghost btn-sm"
          onClick={() => setIsVisible(false)}
        >
          <Icon Icon={RiCloseLine} />
        </Button>
      </div>
    </div>
  );
};
