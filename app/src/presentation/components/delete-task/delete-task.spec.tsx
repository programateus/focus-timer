import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { mockNavLink } from "@tests/presentation/mocks/react-router";
import { generateTask } from "@tests/domain/entities/tasks-mock";

vi.mock("react-router", () => ({
  useLocation: vi.fn(),
  NavLink: mockNavLink,
}));
vi.mock("@presentation/hooks/use-tasks");

import { DeleteTask } from "./delete-task";
import { useTasks } from "@presentation/hooks/use-tasks";

const task = generateTask();
const onClose = vi.fn();

describe("DeleteTask", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly", () => {
    vi.mocked(useTasks).mockReturnValue({
      deleteTask: vi.fn(),
      addTask: vi.fn(),
      updateTask: vi.fn(),
      tasks: [task],
      isLoading: false,
      selectedTask: task,
      selectTask: vi.fn(),
    });
    render(<DeleteTask task={task} onClose={onClose} />);
    expect(
      screen.getByRole("region", { name: /Delete task confirmation/i })
    ).toBeInTheDocument();
  });

  it("should delete task and call close on delete button click", async () => {
    vi.mocked(useTasks).mockReturnValue({
      deleteTask: vi.fn(),
      addTask: vi.fn(),
      updateTask: vi.fn(),
      tasks: [task],
      isLoading: false,
      selectedTask: task,
      selectTask: vi.fn(),
    });
    render(<DeleteTask task={task} onClose={onClose} />);
    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    await deleteButton.click();
    expect(useTasks().deleteTask).toHaveBeenCalledWith(task.id);
    expect(onClose).toHaveBeenCalled();
  });
});
