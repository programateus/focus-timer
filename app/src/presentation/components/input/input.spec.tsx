import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Input } from "./input";
import { Icon } from "../icon";
import { HiMail } from "react-icons/hi";

describe("Input", () => {
  it("should render", () => {
    const { getByPlaceholderText } = render(<Input placeholder="test" />);
    expect(getByPlaceholderText("test")).toBeInTheDocument();
  });

  it("should render the floating label", () => {
    render(<Input label="test" placeholder="test" />);
    const label = screen.getByLabelText("Field test");
    expect(label).toBeInTheDocument();
  });

  it("should render icon to the left", () => {
    const { getByTestId } = render(
      <Input
        label="test"
        placeholder="test"
        icon={<Icon Icon={HiMail} data-testid="icon" />}
        iconPosition="left"
      />
    );
    const icon = getByTestId("icon");
    expect(icon).toBeInTheDocument();
    expect(icon.nextSibling).toHaveAttribute("placeholder", "test");
  });

  it("should render icon to the right", () => {
    const { getByTestId } = render(
      <Input
        label="test"
        placeholder="test"
        icon={<Icon Icon={HiMail} data-testid="icon" />}
        iconPosition="right"
      />
    );
    const icon = getByTestId("icon");
    expect(icon).toBeInTheDocument();
    expect(icon.previousSibling).toHaveAttribute("placeholder", "test");
  });

  it("should render helper text", () => {
    const { getByText } = render(
      <Input label="test" placeholder="test" helperText="Helper text" />
    );
    expect(getByText("Helper text")).toBeInTheDocument();
  });

  it("should render error state", () => {
    const { getByText } = render(
      <Input label="test" placeholder="test" helperText="Error text" error />
    );
    expect(getByText("Error text")).toBeInTheDocument();
    expect(getByText("Error text")).toHaveClass("text-error");
  });
});
