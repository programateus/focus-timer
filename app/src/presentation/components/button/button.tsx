import cn from "@presentation/utils/cn";
import type { ButtonHTMLAttributes } from "react";
import { NavLink, type NavLinkProps } from "react-router";

type ButtonBaseProps = {
  isLoading?: boolean;
};

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: undefined;
    disabled?: boolean;
  };

type ButtonAsAnchor = ButtonBaseProps &
  NavLinkProps & {
    to: NavLinkProps["to"];
    disabled?: boolean;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export const Button = ({
  children,
  className,
  isLoading,
  disabled,
  to,
  ...rest
}: ButtonProps) => {
  const classes = cn(
    "btn",
    isLoading && "opacity-75 pointer-events-none",
    className
  );

  if (to) {
    return (
      <NavLink
        {...(rest as NavLinkProps)}
        className={classes}
        to={to}
        aria-disabled={isLoading || disabled}
      >
        {(props) => (
          <>
            {typeof children === "function" ? children(props) : children}
            {isLoading && (
              <span className="loading loading-spinner loading-xs"></span>
            )}
          </>
        )}
      </NavLink>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      disabled={isLoading || disabled}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children as React.ReactNode}
      {isLoading && (
        <span className="loading loading-spinner loading-xs"></span>
      )}
    </button>
  );
};
