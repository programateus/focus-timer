import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";

import { TaskForm } from "./task-form";
import { useTasks } from "@presentation/hooks/use-tasks";
import { useToast } from "@presentation/hooks/use-toast";
import type { ToastContextParams } from "@presentation/contexts/toast-context";
import type { Task } from "@domain/entities/task";

vi.mock("@presentation/hooks/use-tasks");
vi.mock("@presentation/hooks/use-toast");

describe("TaskForm", () => {
  const mockAddTask = vi.fn();
  const mockUpdateTask = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useTasks).mockReturnValue({
      tasks: [],
      isLoading: false,
      selectedTask: null,
      selectTask: vi.fn(),
      addTask: mockAddTask,
      updateTask: mockUpdateTask,
      deleteTask: vi.fn(),
    });
    vi.mocked(useToast).mockReturnValue({
      addToast: vi.fn(),
    } as unknown as ToastContextParams);
  });

  it("should render the TaskForm component", () => {
    render(<TaskForm onClose={mockOnClose} />);
    expect(screen.getByTestId("task-form")).toBeInTheDocument();
  });

  it("should call addTask when form is submitted with new task", async () => {
    render(<TaskForm onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText<HTMLInputElement>("Task Title");
    const descriptionInput = screen.getByLabelText<HTMLTextAreaElement>(
      "Description (optional)"
    );
    const submitButton = screen.getByRole("button", { name: /Create Task/i });

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: "New Task" } });
      fireEvent.change(descriptionInput, {
        target: { value: "Task Description" },
      });
    });

    await act(async () => {
      submitButton.click();
    });

    expect(mockAddTask).toHaveBeenCalledWith({
      title: "New Task",
      description: "Task Description",
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should call updateTask when form is submitted with existing task", async () => {
    const existingTask: Task = {
      id: "1",
      title: "Existing Task",
      description: "Existing Description",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<TaskForm onClose={mockOnClose} task={existingTask} />);

    const titleInput = screen.getByLabelText<HTMLInputElement>("Task Title");
    const descriptionInput = screen.getByLabelText<HTMLTextAreaElement>(
      "Description (optional)"
    );
    const submitButton = screen.getByRole("button", { name: /Update Task/i });

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: "Updated Task" } });
      fireEvent.change(descriptionInput, {
        target: { value: "Updated Description" },
      });
    });

    await act(async () => {
      submitButton.click();
    });

    expect(mockUpdateTask).toHaveBeenCalledWith("1", {
      title: "Updated Task",
      description: "Updated Description",
    });
    expect(mockOnClose).toHaveBeenCalled();
  });
});
