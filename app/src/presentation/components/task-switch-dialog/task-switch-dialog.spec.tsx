import { describe, expect, it, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";

import { TaskSwitchDialog } from "./task-switch-dialog";

describe("TaskSwitchDialog", () => {
  it("should render", () => {
    render(
      <TaskSwitchDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        currentTaskTitle="Current Task"
        newTaskTitle="New Task"
      />
    );

    expect(screen.getByText("Switch Active Task?")).toBeInTheDocument();
    expect(
      screen.getByText(
        'You are currently on task "Current Task". Switching to "New Task" will reset the current timer.'
      )
    ).toBeInTheDocument();
  });

  it("should call onClose when Cancel button is clicked", async () => {
    const onClose = vi.fn();
    render(
      <TaskSwitchDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={vi.fn()}
        currentTaskTitle="Current Task"
        newTaskTitle="New Task"
      />
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await act(async () => cancelButton.click());
    expect(onClose).toHaveBeenCalled();
  });

  it("should call onConfirm when Confirm button is clicked", async () => {
    const onConfirm = vi.fn();
    render(
      <TaskSwitchDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={onConfirm}
        currentTaskTitle="Current Task"
        newTaskTitle="New Task"
      />
    );

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    await act(async () => confirmButton.click());
    expect(onConfirm).toHaveBeenCalled();
  });
});
