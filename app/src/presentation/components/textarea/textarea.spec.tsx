import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("should render", () => {
    render(<Textarea placeholder="test" />);
    expect(screen.getByPlaceholderText("test")).toBeInTheDocument();
  });

  it("should render the floating label", () => {
    render(<Textarea label="test" placeholder="test" />);
    const label = screen.getByLabelText("Field test");
    expect(label).toBeInTheDocument();
  });

  it("should render helper text", () => {
    render(
      <Textarea label="test" placeholder="test" helperText="Helper text" />
    );
    expect(screen.getByText("Helper text")).toBeInTheDocument();
  });

  it("should render error state", () => {
    render(
      <Textarea label="test" placeholder="test" helperText="Error text" error />
    );
    expect(screen.getByText("Error text")).toBeInTheDocument();
    expect(screen.getByText("Error text")).toHaveClass("text-error");
  });
});
