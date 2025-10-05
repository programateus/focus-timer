import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("should render", () => {
    const { getByPlaceholderText } = render(<Textarea placeholder="test" />);
    expect(getByPlaceholderText("test")).toBeInTheDocument();
  });

  it("should render the floating label", () => {
    render(<Textarea label="test" placeholder="test" />);
    const label = screen.getByLabelText("Field test");
    expect(label).toBeInTheDocument();
  });

  it("should render helper text", () => {
    const { getByText } = render(
      <Textarea label="test" placeholder="test" helperText="Helper text" />
    );
    expect(getByText("Helper text")).toBeInTheDocument();
  });

  it("should render error state", () => {
    const { getByText } = render(
      <Textarea label="test" placeholder="test" helperText="Error text" error />
    );
    expect(getByText("Error text")).toBeInTheDocument();
    expect(getByText("Error text")).toHaveClass("text-error");
  });
});
