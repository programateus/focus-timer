import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import { mockNavLink } from "@tests/presentation/mocks/react-router";

vi.mock("react-router", () => ({
  useLocation: vi.fn(),
  NavLink: mockNavLink,
}));

import { Button } from "./button";

describe("Button component", () => {
  it("should render a nav link", () => {
    const { getByRole } = render(<Button to="/home">Go Home</Button>);
    const link = getByRole("link");
    expect(link).toHaveAttribute("href", "/home");
    expect(link).toHaveTextContent("Go Home");
  });

  it("should render a button", () => {
    const { getByRole } = render(<Button>Click Me</Button>);
    const button = getByRole("button");
    expect(button).toHaveTextContent("Click Me");
  });
});
