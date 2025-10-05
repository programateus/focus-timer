import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { act, render, screen, cleanup } from "@testing-library/react";
import { useAuth } from "@presentation/hooks/use-auth";
import { useTasks } from "@presentation/hooks/use-tasks";
import { usePomodoros } from "@presentation/hooks/use-pomodoros";
import { Timer } from "./timer";
import { generateTask } from "@tests/domain/entities/tasks-mock";

vi.mock("@presentation/hooks/use-auth");
vi.mock("@presentation/hooks/use-tasks");
vi.mock("@presentation/hooks/use-pomodoros");

describe("Timer", () => {
  beforeEach(() => {
    vi.clearAllTimers();
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", name: "Test User", email: "test@example.com" },
      hasLoaded: true,
      loadData: vi.fn(),
    });

    const task = generateTask();
    vi.mocked(useTasks).mockReturnValue({
      tasks: [task],
      isLoading: false,
      selectedTask: task,
      selectTask: vi.fn(),
      addTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
    });

    vi.mocked(usePomodoros).mockReturnValue({
      addPomodoro: vi.fn(),
      pomodoros: [],
      isLoading: false,
    });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  it("should render the Timer component", () => {
    vi.mocked(useTasks).mockReturnValue({
      tasks: [],
      isLoading: false,
      selectedTask: null,
      selectTask: vi.fn(),
      addTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
    });

    render(
      <Timer
        initialMinutes={25}
        title="Focus"
        progressColor="primary"
        buttonColor="btn-primary"
        type="work"
      />
    );

    expect(screen.getByTestId("timer-component")).toBeInTheDocument();
  });

  it("should start timer when clicking start button", async () => {
    vi.useFakeTimers();

    render(
      <Timer
        initialMinutes={25}
        title="Focus"
        progressColor="primary"
        buttonColor="btn-primary"
        type="work"
      />
    );

    const startButton = screen.getByTestId("start-button");
    expect(startButton).not.toBeDisabled();

    // Usar fireEvent ao invés de userEvent com fake timers
    await act(async () => {
      startButton.click();
    });

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    const timerDisplay = screen.getByTestId("timer-display");
    expect(timerDisplay).toHaveTextContent("24:59");
  });

  it("should pause timer when clicking pause button", async () => {
    vi.useFakeTimers();

    render(
      <Timer
        initialMinutes={25}
        title="Focus"
        progressColor="primary"
        buttonColor="btn-primary"
        type="work"
      />
    );

    const startButton = screen.getByTestId("start-button");

    await act(async () => {
      startButton.click();
    });

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    const pauseButton = screen.getByTestId("pause-button");

    await act(async () => {
      pauseButton.click();
    });

    const timerDisplay = screen.getByTestId("timer-display");
    expect(timerDisplay).toHaveTextContent("24:59");
  });

  it("should stop timer when clicking stop button", async () => {
    vi.useFakeTimers();

    render(
      <Timer
        initialMinutes={25}
        title="Focus"
        progressColor="primary"
        buttonColor="btn-primary"
        type="work"
      />
    );

    const startButton = screen.getByTestId("start-button");

    await act(async () => {
      startButton.click();
    });

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId("timer-display")).toHaveTextContent("24:59");

    const stopButton = screen.getByTestId("stop-button");

    await act(async () => {
      stopButton.click();
    });

    expect(screen.getByTestId("timer-display")).toHaveTextContent("25:00");
  });
});
