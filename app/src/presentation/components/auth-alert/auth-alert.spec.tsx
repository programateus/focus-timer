import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { useAuth } from "@presentation/hooks/use-auth";
import { mockNavLink } from "@tests/presentation/mocks/react-router";

vi.mock("react-router", () => ({
  useLocation: vi.fn(),
  NavLink: mockNavLink,
}));
vi.mock("@presentation/hooks/use-auth");

import { AuthAlert } from "./auth-alert";

describe("AuthAlert", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly when user is not authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      hasLoaded: true,
      loadData: vi.fn(),
    });
    render(<AuthAlert />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("should not render when user is authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", name: "Test User", email: "test@example.com" },
      hasLoaded: true,
      loadData: vi.fn(),
    });
    render(<AuthAlert />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("should close the alert when the close button is clicked", async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      hasLoaded: true,
      loadData: vi.fn(),
    });
    render(<AuthAlert />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    const closeButton = screen.getByRole("button", { name: /Close alert/i });
    await closeButton.click();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
