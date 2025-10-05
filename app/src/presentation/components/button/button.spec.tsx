import { describe, expect, it, vi } from "vitest";
import { screen, render } from "@testing-library/react";

import { mockNavLink } from "@tests/presentation/mocks/react-router";

vi.mock("react-router", () => ({
  useLocation: vi.fn(),
  NavLink: mockNavLink,
}));

import { Button } from "./button";

describe("Button component", () => {
  it("should render a nav link", () => {
    render(<Button to="/home">Go Home</Button>);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/home");
    expect(link).toHaveTextContent("Go Home");
  });

  it("should render a button", () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Click Me");
  });
});
