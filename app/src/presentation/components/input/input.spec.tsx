import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Input } from "./input";
import { Icon } from "../icon";
import { HiMail } from "react-icons/hi";

describe("Input", () => {
  it("should render", () => {
    render(<Input placeholder="test" />);
    expect(screen.getByPlaceholderText("test")).toBeInTheDocument();
  });

  it("should render the floating label", () => {
    render(<Input label="test" placeholder="test" />);
    const label = screen.getByLabelText("Field test");
    expect(label).toBeInTheDocument();
  });

  it("should render icon to the left", () => {
    render(
      <Input
        label="test"
        placeholder="test"
        icon={<Icon Icon={HiMail} data-testid="icon" />}
        iconPosition="left"
      />
    );
    const icon = screen.getByTestId("icon");
    expect(icon).toBeInTheDocument();
    expect(icon.nextSibling).toHaveAttribute("placeholder", "test");
  });

  it("should render icon to the right", () => {
    render(
      <Input
        label="test"
        placeholder="test"
        icon={<Icon Icon={HiMail} data-testid="icon" />}
        iconPosition="right"
      />
    );
    const icon = screen.getByTestId("icon");
    expect(icon).toBeInTheDocument();
    expect(icon.previousSibling).toHaveAttribute("placeholder", "test");
  });

  it("should render helper text", () => {
    render(<Input label="test" placeholder="test" helperText="Helper text" />);
    expect(screen.getByText("Helper text")).toBeInTheDocument();
  });

  it("should render error state", () => {
    render(
      <Input label="test" placeholder="test" helperText="Error text" error />
    );
    expect(screen.getByText("Error text")).toBeInTheDocument();
    expect(screen.getByText("Error text")).toHaveClass("text-error");
  });
});
