import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";

import { useTasks } from "@presentation/hooks/use-tasks";
import { useToast } from "@presentation/hooks/use-toast";
import { generateTask } from "@tests/domain/entities/tasks-mock";
import type { ToastContextParams } from "@presentation/contexts/toast-context";

import { Task } from "./task";

vi.mock("@presentation/hooks/use-tasks");
vi.mock("@presentation/hooks/use-toast");

describe("Task", () => {
  const mockUpdateTask = vi.fn();
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useTasks).mockReturnValue({
      tasks: [],
      isLoading: false,
      selectedTask: null,
      selectTask: vi.fn(),
      addTask: vi.fn(),
      updateTask: mockUpdateTask,
      deleteTask: vi.fn(),
    });
    vi.mocked(useToast).mockReturnValue({
      addToast: vi.fn(),
    } as unknown as ToastContextParams);
  });

  it("should render task with title and description", () => {
    const task = generateTask({
      title: "Test Task",
      description: "Test Description",
    });

    render(<Task task={task} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("should render task without description", () => {
    const task = generateTask({
      title: "Test Task",
      description: "",
    });

    render(<Task task={task} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
  });

  it("should show checkbox as unchecked when task is not completed", () => {
    const task = generateTask({ completed: false });

    render(<Task task={task} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("should show checkbox as checked when task is completed", () => {
    const task = generateTask({ completed: true });

    render(<Task task={task} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("should apply line-through style to completed task", () => {
    const task = generateTask({
      title: "Completed Task",
      completed: true,
    });

    render(<Task task={task} />);

    const title = screen.getByText("Completed Task");
    expect(title).toHaveClass("line-through");
  });

  it("should call onSelect when task is clicked", () => {
    const task = generateTask();

    render(<Task task={task} onSelect={mockOnSelect} />);

    const taskCard = screen.getByTestId(`task-${task.id}`);
    taskCard?.click();

    expect(mockOnSelect).toHaveBeenCalledWith(task);
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it("should toggle task completion when checkbox is clicked", () => {
    const task = generateTask({
      id: "task-123",
      completed: false,
    });

    render(<Task task={task} />);

    const checkbox = screen.getByRole("checkbox");
    checkbox.click();

    expect(mockUpdateTask).toHaveBeenCalledWith("task-123", {
      completed: true,
    });
  });

  it("should not call onSelect when checkbox is clicked", () => {
    const task = generateTask();

    render(<Task task={task} onSelect={mockOnSelect} />);

    const checkbox = screen.getByRole("checkbox");
    checkbox.click();

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it("should highlight selected task", () => {
    const task = generateTask({ id: "selected-task" });

    vi.mocked(useTasks).mockReturnValue({
      tasks: [],
      isLoading: false,
      selectedTask: task,
      selectTask: vi.fn(),
      addTask: vi.fn(),
      updateTask: mockUpdateTask,
      deleteTask: vi.fn(),
    });

    render(<Task task={task} />);

    const taskCard = screen.getByText(task.title).closest(".card");
    expect(taskCard).toHaveClass("border-primary");
    expect(taskCard).toHaveClass("bg-primary/10");
  });

  it("should not highlight unselected task", () => {
    const task = generateTask({ id: "task-1" });
    const selectedTask = generateTask({ id: "task-2" });

    vi.mocked(useTasks).mockReturnValue({
      tasks: [],
      isLoading: false,
      selectedTask: selectedTask,
      selectTask: vi.fn(),
      addTask: vi.fn(),
      updateTask: mockUpdateTask,
      deleteTask: vi.fn(),
    });

    render(<Task task={task} />);

    const taskCard = screen.getByText(task.title).closest(".card");
    expect(taskCard).not.toHaveClass("border-primary");
    expect(taskCard).toHaveClass("border-base-300");
  });

  it("should open update dialog when update menu item is clicked", async () => {
    const task = generateTask({ title: "Task to Update" });

    render(<Task task={task} />);

    const menuButton = screen.getByRole("button", { name: /menu/i });
    await act(async () => menuButton.click());
    const updateButton = screen.getByRole("button", { name: /update/i });
    await act(async () => updateButton.click());
    expect(screen.getByText("Update Task")).toBeInTheDocument();
  });

  it("should open delete dialog when delete menu item is clicked", async () => {
    const task = generateTask({ title: "Task to Delete" });

    render(<Task task={task} />);
    const menuButton = screen.getByRole("button", { name: /menu/i });
    await act(async () => menuButton.click());
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await act(async () => deleteButton.click());
    expect(screen.getByText("Delete Task")).toBeInTheDocument();
  });

  it("should close dialog when onClose is called", async () => {
    const task = generateTask();
    render(<Task task={task} />);

    const menuButton = screen.getByRole("button", { name: /menu/i });
    await act(async () => menuButton.click());
    const updateButton = screen.getByRole("button", { name: /update/i });
    await act(async () => updateButton.click());

    expect(screen.getByText("Update Task")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i });
    await act(async () => closeButton.click());

    expect(screen.queryByText("Update Task")).not.toBeInTheDocument();
  });

  it("should render TaskMenu component", () => {
    const task = generateTask();

    render(<Task task={task} />);

    const menuButton = screen.getByRole("button", { name: /menu/i });
    expect(menuButton).toBeInTheDocument();
  });
});
