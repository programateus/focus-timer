import { beforeEach, describe, it, expect, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import { render, screen } from "@testing-library/react";
import { useAuth } from "@presentation/hooks/use-auth";

import { GuestGuard } from "./guest-guard";

vi.mock("@presentation/hooks/use-auth");

describe("GuestGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render children when isAuthenticated is not true and hasLoaded is true", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      hasLoaded: true,
      loadData: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <GuestGuard>
                <div>Guest Content</div>
              </GuestGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Guest Content")).toBeInTheDocument();
  });

  it("should not render children when hasLoaded is false or isAuthenticated is true", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", name: "Test User", email: "test@example.com" },
      hasLoaded: false,
      loadData: vi.fn(),
    });
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <GuestGuard>
                <div>Guest Content</div>
              </GuestGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText("Guest Content")).not.toBeInTheDocument();
  });
});
