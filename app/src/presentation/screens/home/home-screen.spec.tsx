import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTasks } from "@presentation/hooks/use-tasks";
import { usePomodoroStore } from "@presentation/stores/pomodoro-store";
import { useAuth } from "@presentation/hooks/use-auth";
import { useToast } from "@presentation/hooks/use-toast";
import { generateTask } from "@tests/domain/entities/tasks-mock";
import { mockNavLink } from "@tests/presentation/mocks/react-router";

vi.mock("react-router", () => ({
  useLocation: vi.fn(),
  NavLink: mockNavLink,
}));

import { HomeScreen } from "./home-screen";
import type { Task } from "@domain/entities/task";

vi.mock("@presentation/hooks/use-tasks");
vi.mock("@presentation/hooks/use-auth");
vi.mock("@presentation/stores/pomodoro-store");
vi.mock("@presentation/hooks/use-toast");

vi.mock("@presentation/components/pomodoro-stats", () => ({
  PomodoroStats: () => <div data-testid="pomodoro-stats">Pomodoro Stats</div>,
}));

vi.mock("@presentation/components/pomodoro/pomodoro", () => ({
  Pomodoro: () => <div data-testid="pomodoro">Pomodoro Timer</div>,
}));

describe("HomeScreen - Integration Tests", () => {
  const mockSelectTask = vi.fn();
  const mockAddTask = vi.fn();
  const mockUpdateTask = vi.fn();
  const mockDeleteTask = vi.fn();
  const mockSetCurrentSession = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      hasLoaded: true,
      loadData: vi.fn(),
    });

    vi.mocked(useTasks).mockReturnValue({
      tasks: [],
      isLoading: false,
      selectedTask: null,
      selectTask: mockSelectTask,
      addTask: mockAddTask,
      updateTask: mockUpdateTask,
      deleteTask: mockDeleteTask,
    });

    vi.mocked(useToast).mockReturnValue({
      addToast: vi.fn(),
    } as unknown as ReturnType<typeof useToast>);

    vi.mocked(usePomodoroStore).mockReturnValue({
      currentSession: null,
      setCurrentSession: mockSetCurrentSession,
      sessions: [],
      addSession: vi.fn(),
    });
  });

  describe("Initial Render", () => {
    it("should render all main sections", () => {
      render(<HomeScreen />);

      expect(screen.getByTestId("home-screen")).toBeInTheDocument();
      expect(screen.getByText("Task List")).toBeInTheDocument();
      expect(screen.getByTestId("pomodoro-stats")).toBeInTheDocument();
      expect(screen.getByTestId("pomodoro")).toBeInTheDocument();
    });

    it("should show empty state when no tasks", () => {
      render(<HomeScreen />);

      expect(screen.getByText("No task found.")).toBeInTheDocument();
      expect(
        screen.getByText("Add a task to get started!")
      ).toBeInTheDocument();
      expect(screen.getByText("(0 tasks)")).toBeInTheDocument();
    });

    it("should show add task button", () => {
      render(<HomeScreen />);

      const addButton = screen.getByRole("button", { name: /add task/i });
      expect(addButton).toBeInTheDocument();
    });
  });

  describe("Task List Display", () => {
    it("should display multiple tasks", () => {
      const tasks = [
        generateTask({ title: "Task 1" }),
        generateTask({ title: "Task 2" }),
        generateTask({ title: "Task 3" }),
      ];

      vi.mocked(useTasks).mockReturnValue({
        tasks,
        isLoading: false,
        selectedTask: null,
        selectTask: mockSelectTask,
        addTask: mockAddTask,
        updateTask: mockUpdateTask,
        deleteTask: mockDeleteTask,
      });

      render(<HomeScreen />);

      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
      expect(screen.getByText("Task 3")).toBeInTheDocument();
      expect(screen.getByText("(3 tasks)")).toBeInTheDocument();
    });

    it("should highlight selected task", () => {
      const task1 = generateTask({ id: "1", title: "Selected Task" });
      const task2 = generateTask({ id: "2", title: "Other Task" });

      vi.mocked(useTasks).mockReturnValue({
        tasks: [task1, task2],
        isLoading: false,
        selectedTask: task1,
        selectTask: mockSelectTask,
        addTask: mockAddTask,
        updateTask: mockUpdateTask,
        deleteTask: mockDeleteTask,
      });

      render(<HomeScreen />);

      const selectedTaskCard = screen
        .getByText("Selected Task")
        .closest(".card");
      expect(selectedTaskCard).toHaveClass("border-primary");
    });
  });

  describe("Task Selection", () => {
    it("should select task when clicked", async () => {
      const user = userEvent.setup();
      const task = generateTask({ title: "Task to Select" });

      vi.mocked(useTasks).mockReturnValue({
        tasks: [task],
        isLoading: false,
        selectedTask: null,
        selectTask: mockSelectTask,
        addTask: mockAddTask,
        updateTask: mockUpdateTask,
        deleteTask: mockDeleteTask,
      });

      render(<HomeScreen />);

      const taskCard = screen.getByText("Task to Select").closest(".card");
      await user.click(taskCard!);

      expect(mockSelectTask).toHaveBeenCalledWith(task);
    });

    it("should allow selecting the same task twice", async () => {
      const user = userEvent.setup();
      const task = generateTask({ title: "Same Task" });

      vi.mocked(useTasks).mockReturnValue({
        tasks: [task],
        isLoading: false,
        selectedTask: task,
        selectTask: mockSelectTask,
        addTask: mockAddTask,
        updateTask: mockUpdateTask,
        deleteTask: mockDeleteTask,
      });

      render(<HomeScreen />);

      const taskCard = screen.getByText("Same Task").closest(".card");
      await user.click(taskCard!);

      expect(mockSelectTask).toHaveBeenCalledWith(task);
    });
  });

  describe("Task Switching - Without Active Session", () => {
    it("should switch tasks immediately when no session is active", async () => {
      const user = userEvent.setup();
      const task1 = generateTask({ id: "1", title: "Task 1" });
      const task2 = generateTask({ id: "2", title: "Task 2" });

      vi.mocked(useTasks).mockReturnValue({
        tasks: [task1, task2],
        isLoading: false,
        selectedTask: task1,
        selectTask: mockSelectTask,
        addTask: mockAddTask,
        updateTask: mockUpdateTask,
        deleteTask: mockDeleteTask,
      });

      vi.mocked(usePomodoroStore).mockReturnValue({
        currentSession: null,
        setCurrentSession: mockSetCurrentSession,
        sessions: [],
        addSession: vi.fn(),
      });

      render(<HomeScreen />);

      const task2Card = screen.getByText("Task 2").closest(".card");
      await user.click(task2Card!);

      expect(mockSelectTask).toHaveBeenCalledWith(task2);
      expect(mockSetCurrentSession).toHaveBeenCalledWith(null);
      // Dialog não deve aparecer
      expect(screen.queryByText(/switch task/i)).not.toBeInTheDocument();
    });
  });

  describe("Task Switching - With Active Session", () => {
    it("should show confirmation dialog when switching tasks during active session", async () => {
      const user = userEvent.setup();
      const task1 = generateTask({ id: "1", title: "Current Task" });
      const task2 = generateTask({ id: "2", title: "New Task" });

      vi.mocked(useTasks).mockReturnValue({
        tasks: [task1, task2],
        isLoading: false,
        selectedTask: task1,
        selectTask: mockSelectTask,
        addTask: mockAddTask,
        updateTask: mockUpdateTask,
        deleteTask: mockDeleteTask,
      });

      vi.mocked(usePomodoroStore).mockReturnValue({
        currentSession: { id: "session-1", taskId: task1.id, type: "work" },
        setCurrentSession: mockSetCurrentSession,
        sessions: [],
        addSession: vi.fn(),
      });

      render(<HomeScreen />);

      const task2Card = screen.getByText("New Task").closest(".card");
      await user.click(task2Card!);

      // Dialog deve aparecer
      expect(screen.getByText("Current Task")).toBeInTheDocument();
      expect(screen.getByText("New Task")).toBeInTheDocument();
    });

    it("should switch tasks when user confirms in dialog", async () => {
      const user = userEvent.setup();
      const task1 = generateTask({ id: "1", title: "Old Task" });
      const task2 = generateTask({ id: "2", title: "New Task" });

      vi.mocked(useTasks).mockReturnValue({
        tasks: [task1, task2],
        isLoading: false,
        selectedTask: task1,
        selectTask: mockSelectTask,
        addTask: mockAddTask,
        updateTask: mockUpdateTask,
        deleteTask: mockDeleteTask,
      });

      vi.mocked(usePomodoroStore).mockReturnValue({
        currentSession: { id: "session-1", taskId: task1.id, type: "work" },
        setCurrentSession: mockSetCurrentSession,
        sessions: [],
        addSession: vi.fn(),
      });

      render(<HomeScreen />);

      const task2Card = screen.getByText("New Task").closest(".card");
      await user.click(task2Card!);

      const confirmButton = screen.getByRole("button", {
        name: /confirm/i,
      });
      await user.click(confirmButton);

      expect(mockSelectTask).toHaveBeenCalledWith(task2);
      expect(mockSetCurrentSession).toHaveBeenCalledWith(null);
    });

    it("should cancel task switch when user cancels in dialog", async () => {
      const user = userEvent.setup();
      const task1 = generateTask({ id: "1", title: "Current Task" });
      const task2 = generateTask({ id: "2", title: "New Task" });

      vi.mocked(useTasks).mockReturnValue({
        tasks: [task1, task2],
        isLoading: false,
        selectedTask: task1,
        selectTask: mockSelectTask,
        addTask: mockAddTask,
        updateTask: mockUpdateTask,
        deleteTask: mockDeleteTask,
      });

      vi.mocked(usePomodoroStore).mockReturnValue({
        currentSession: { id: "session-1", taskId: task1.id, type: "work" },
        setCurrentSession: mockSetCurrentSession,
        sessions: [],
        addSession: vi.fn(),
      });

      render(<HomeScreen />);

      const task2Card = screen.getByText("New Task").closest(".card");
      await user.click(task2Card!);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockSelectTask).not.toHaveBeenCalled();
      expect(mockSetCurrentSession).not.toHaveBeenCalled();
    });
  });

  describe("Add Task Dialog", () => {
    it("should open add task dialog when clicking add button", async () => {
      const user = userEvent.setup();

      render(<HomeScreen />);

      const addButton = screen.getByRole("button", { name: /add task/i });
      await user.click(addButton);

      expect(screen.getByText("New Task")).toBeInTheDocument();
      expect(screen.getByTestId("task-form")).toBeInTheDocument();
    });

    it("should close add task dialog when form is submitted", async () => {
      const user = userEvent.setup();
      mockAddTask.mockResolvedValue({});

      render(<HomeScreen />);

      const addButton = screen.getByRole("button", { name: /add task/i });
      await user.click(addButton);

      const titleInput = screen.getByLabelText("Task Title");
      await user.type(titleInput, "New Test Task");

      const saveButton = screen.getByRole("button", { name: /Create Task/i });
      await user.click(saveButton);

      expect(screen.queryByText("New Task")).not.toBeInTheDocument();
    });
  });

  describe("Authentication Integration", () => {
    it("should show auth alert when not authenticated", () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        user: null,
        hasLoaded: true,
        loadData: vi.fn(),
      });

      render(<HomeScreen />);

      expect(screen.getByTestId("auth-alert")).toBeInTheDocument();
    });

    it("should not show auth alert when authenticated", () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: true,
        user: { id: "1", name: "Test User", email: "test@test.com" },
        hasLoaded: true,
        loadData: vi.fn(),
      });

      render(<HomeScreen />);

      expect(screen.queryByTestId("auth-alert")).not.toBeInTheDocument();
    });
  });

  describe("Complete User Flow", () => {
    it("should complete full task workflow: add, select, switch", async () => {
      const user = userEvent.setup();
      let currentTasks: Task[] = [];
      let currentSelectedTask: Task | null = null;

      vi.mocked(useTasks).mockImplementation(() => ({
        tasks: currentTasks,
        isLoading: false,
        selectedTask: currentSelectedTask,
        selectTask: (task) => {
          currentSelectedTask = task;
          mockSelectTask(task);
        },
        addTask: async (data) => {
          const newTask = generateTask({
            ...data,
            id: `task-${currentTasks.length + 1}`,
          });
          currentTasks = [...currentTasks, newTask];
          mockAddTask(data);
          return newTask;
        },
        updateTask: mockUpdateTask,
        deleteTask: mockDeleteTask,
      }));

      const { rerender } = render(<HomeScreen />);

      await user.click(screen.getByRole("button", { name: /add task/i }));
      await user.type(screen.getByLabelText("Task Title"), "First Task");
      await user.click(screen.getByRole("button", { name: /Create Task/i }));

      expect(mockAddTask).toHaveBeenCalled();

      currentTasks = [generateTask({ id: "1", title: "First Task" })];
      rerender(<HomeScreen />);

      await user.click(screen.getByText("First Task").closest(".card")!);
      expect(mockSelectTask).toHaveBeenCalled();

      currentTasks = [
        generateTask({ id: "1", title: "First Task" }),
        generateTask({ id: "2", title: "Second Task" }),
      ];
      rerender(<HomeScreen />);

      vi.mocked(usePomodoroStore).mockReturnValue({
        currentSession: { id: "session-1", taskId: "1", type: "work" },
        setCurrentSession: mockSetCurrentSession,
        sessions: [],
        addSession: vi.fn(),
      });
      rerender(<HomeScreen />);

      await user.click(screen.getByText("Second Task").closest(".card")!);

      expect(screen.getByText("First Task")).toBeInTheDocument();
      expect(screen.getByText("Second Task")).toBeInTheDocument();
    });
  });
});
