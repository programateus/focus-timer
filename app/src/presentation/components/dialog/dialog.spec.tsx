import { describe, expect, it, vi } from "vitest";

import { render, screen } from "@testing-library/react";

import Dialog from "./dialog";

describe("Dialog", () => {
  it("should render correctly", () => {
    render(
      <Dialog isOpen onClose={vi.fn()}>
        <div>Dialog Content</div>
      </Dialog>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should not render when isOpen is false", () => {
    render(
      <Dialog isOpen={false} onClose={vi.fn()}>
        <div>Dialog Content</div>
      </Dialog>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    render(
      <Dialog isOpen onClose={onClose}>
        <div>Dialog Content</div>
      </Dialog>
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    await closeButton.click();

    expect(onClose).toHaveBeenCalled();
  });
});
