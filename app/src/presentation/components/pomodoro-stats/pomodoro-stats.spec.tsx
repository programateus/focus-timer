import { beforeEach, expect, describe, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { PomodoroStats } from "./pomodoro-stats";

import { useAuth } from "@presentation/hooks/use-auth";
import { useTasks } from "@presentation/hooks/use-tasks";
import { usePomodoroStore } from "@presentation/stores/pomodoro-store";
import { generateTask } from "@tests/domain/entities/tasks-mock";

vi.mock("@presentation/hooks/use-auth");
vi.mock("@presentation/hooks/use-tasks");
vi.mock("@presentation/stores/pomodoro-store");

const mockTasks = Array.from({ length: 4 }, () => generateTask());

describe("PomodoroStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", name: "Test User", email: "test@example.com" },
      hasLoaded: true,
      loadData: vi.fn(),
    });
  });

  it("should render correctly", () => {
    vi.mocked(useTasks).mockReturnValue({
      tasks: [],
      addTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      isLoading: false,
      selectedTask: null,
      selectTask: vi.fn(),
    });

    vi.mocked(usePomodoroStore).mockReturnValue({
      pomodoros: [],
      addPomodoro: vi.fn(),
      updatePomodoro: vi.fn(),
      deletePomodoro: vi.fn(),
      isLoading: false,
      selectedPomodoro: null,
      selectPomodoro: vi.fn(),
      getStats: vi.fn().mockReturnValue({
        totalPomodoros: 0,
        totalBreaks: 0,
        totalWorkTime: 0,
      }),
    });

    render(<PomodoroStats />);
    expect(screen.getByText("Daily Progress")).toBeInTheDocument();
  });

  it("should display completed tasks correctly", () => {
    vi.mocked(useTasks).mockReturnValue({
      tasks: mockTasks,
      addTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      isLoading: false,
      selectedTask: null,
      selectTask: vi.fn(),
    });

    vi.mocked(usePomodoroStore).mockReturnValue({
      pomodoros: [],
      addPomodoro: vi.fn(),
      updatePomodoro: vi.fn(),
      deletePomodoro: vi.fn(),
      isLoading: false,
      selectedPomodoro: null,
      selectPomodoro: vi.fn(),
      getStats: vi.fn().mockReturnValue({
        totalPomodoros: 0,
        totalBreaks: 0,
        totalWorkTime: 0,
      }),
    });

    render(<PomodoroStats />);

    const completedTasksElement = screen.getByTestId("completed-tasks");
    expect(completedTasksElement).toHaveTextContent(
      mockTasks.filter((t) => t.completed).length.toString()
    );
    expect(completedTasksElement).toHaveTextContent("Completed Tasks");
  });

  it("should display total pomodoros correctly", () => {
    vi.mocked(useTasks).mockReturnValue({
      tasks: [],
      addTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      isLoading: false,
      selectedTask: null,
      selectTask: vi.fn(),
    });

    vi.mocked(usePomodoroStore).mockReturnValue({
      pomodoros: [],
      addPomodoro: vi.fn(),
      updatePomodoro: vi.fn(),
      deletePomodoro: vi.fn(),
      isLoading: false,
      selectedPomodoro: null,
      selectPomodoro: vi.fn(),
      getStats: vi.fn().mockReturnValue({
        totalPomodoros: 5,
        totalBreaks: 0,
        totalWorkTime: 0,
      }),
    });

    render(<PomodoroStats />);

    const pomodorosElement = screen.getByTestId("total-pomodoros");
    expect(pomodorosElement).toHaveTextContent("5");
    expect(pomodorosElement).toHaveTextContent("Pomodoros");
  });

  it("should display total breaks correctly", () => {
    vi.mocked(useTasks).mockReturnValue({
      tasks: [],
      addTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      isLoading: false,
      selectedTask: null,
      selectTask: vi.fn(),
    });

    vi.mocked(usePomodoroStore).mockReturnValue({
      pomodoros: [],
      addPomodoro: vi.fn(),
      updatePomodoro: vi.fn(),
      deletePomodoro: vi.fn(),
      isLoading: false,
      selectedPomodoro: null,
      selectPomodoro: vi.fn(),
      getStats: vi.fn().mockReturnValue({
        totalPomodoros: 0,
        totalBreaks: 3,
        totalWorkTime: 0,
      }),
    });

    render(<PomodoroStats />);

    const breaksElement = screen.getByTestId("total-breaks");
    expect(breaksElement).toHaveTextContent("3");
    expect(breaksElement).toHaveTextContent("Breaks");
  });

  it("should display total time when work time is greater than 0", () => {
    vi.mocked(useTasks).mockReturnValue({
      tasks: [],
      addTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      isLoading: false,
      selectedTask: null,
      selectTask: vi.fn(),
    });

    vi.mocked(usePomodoroStore).mockReturnValue({
      pomodoros: [],
      addPomodoro: vi.fn(),
      updatePomodoro: vi.fn(),
      deletePomodoro: vi.fn(),
      isLoading: false,
      selectedPomodoro: null,
      selectPomodoro: vi.fn(),
      getStats: vi.fn().mockReturnValue({
        totalPomodoros: 0,
        totalBreaks: 0,
        totalWorkTime: 3665, // 1h 1m 5s
      }),
    });

    render(<PomodoroStats />);

    const totalTimeElement = screen.getByTestId("total-time");
    expect(totalTimeElement).toHaveTextContent("1h 1m 5s");
    expect(totalTimeElement).toHaveTextContent("Total time");
  });

  it("should not display total time when work time is 0", () => {
    vi.mocked(useTasks).mockReturnValue({
      tasks: [],
      addTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      isLoading: false,
      selectedTask: null,
      selectTask: vi.fn(),
    });

    vi.mocked(usePomodoroStore).mockReturnValue({
      pomodoros: [],
      addPomodoro: vi.fn(),
      updatePomodoro: vi.fn(),
      deletePomodoro: vi.fn(),
      isLoading: false,
      selectedPomodoro: null,
      selectPomodoro: vi.fn(),
      getStats: vi.fn().mockReturnValue({
        totalPomodoros: 0,
        totalBreaks: 0,
        totalWorkTime: 0,
      }),
    });

    render(<PomodoroStats />);

    expect(screen.queryByTestId("total-time")).not.toBeInTheDocument();
  });

  it("should display progress percentage correctly", () => {
    vi.mocked(useTasks).mockReturnValue({
      tasks: mockTasks,
      addTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      isLoading: false,
      selectedTask: null,
      selectTask: vi.fn(),
    });

    vi.mocked(usePomodoroStore).mockReturnValue({
      pomodoros: [],
      addPomodoro: vi.fn(),
      updatePomodoro: vi.fn(),
      deletePomodoro: vi.fn(),
      isLoading: false,
      selectedPomodoro: null,
      selectPomodoro: vi.fn(),
      getStats: vi.fn().mockReturnValue({
        totalPomodoros: 0,
        totalBreaks: 0,
        totalWorkTime: 0,
      }),
    });

    render(<PomodoroStats />);

    const progressElement = screen.getByRole("progressbar");
    expect(progressElement).toHaveTextContent(
      mockTasks.filter((t) => t.completed).length * 25 + "%"
    );
    expect(progressElement).toHaveAttribute(
      "aria-valuenow",
      (mockTasks.filter((t) => t.completed).length * 25).toString()
    );
  });

  it("should display 0% progress when no tasks exist", () => {
    vi.mocked(useTasks).mockReturnValue({
      tasks: [],
      addTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      isLoading: false,
      selectedTask: null,
      selectTask: vi.fn(),
    });

    vi.mocked(usePomodoroStore).mockReturnValue({
      pomodoros: [],
      addPomodoro: vi.fn(),
      updatePomodoro: vi.fn(),
      deletePomodoro: vi.fn(),
      isLoading: false,
      selectedPomodoro: null,
      selectPomodoro: vi.fn(),
      getStats: vi.fn().mockReturnValue({
        totalPomodoros: 0,
        totalBreaks: 0,
        totalWorkTime: 0,
      }),
    });

    render(<PomodoroStats />);

    const progressElement = screen.getByRole("progressbar");
    expect(progressElement).toHaveTextContent("0%");
    expect(progressElement).toHaveAttribute("aria-valuenow", "0");
  });

  it("should format time correctly with different values", () => {
    vi.mocked(useTasks).mockReturnValue({
      tasks: [],
      addTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      isLoading: false,
      selectedTask: null,
      selectTask: vi.fn(),
    });

    vi.mocked(usePomodoroStore).mockReturnValue({
      pomodoros: [],
      addPomodoro: vi.fn(),
      updatePomodoro: vi.fn(),
      deletePomodoro: vi.fn(),
      isLoading: false,
      selectedPomodoro: null,
      selectPomodoro: vi.fn(),
      getStats: vi.fn().mockReturnValue({
        totalPomodoros: 0,
        totalBreaks: 0,
        totalWorkTime: 125, // 2m 5s
      }),
    });

    render(<PomodoroStats />);

    const totalTimeElement = screen.getByTestId("total-time");
    expect(totalTimeElement).toHaveTextContent("2m 5s");
  });
});
