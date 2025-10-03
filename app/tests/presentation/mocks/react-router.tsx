import { vi } from "vitest";
import { type ReactNode } from "react";

export const mockNavigate = vi.fn();
export const mockUseNavigate = vi.fn(() => mockNavigate);
export const mockUseLocation = vi.fn(() => ({
  pathname: "/",
  search: "",
  hash: "",
  state: null,
  key: "default",
}));

export const mockNavLink = ({
  children,
  to,
  ...rest
}: {
  children:
    | ReactNode
    | ((props: { isActive: boolean; isPending: boolean }) => ReactNode);
  to: string;
}) => (
  <a href={to} {...rest}>
    {typeof children === "function"
      ? children({ isActive: false, isPending: false })
      : children}
  </a>
);

export const mockLink = ({
  children,
  to,
  ...rest
}: {
  children: ReactNode;
  to: string;
}) => (
  <a href={to} {...rest}>
    {children}
  </a>
);
