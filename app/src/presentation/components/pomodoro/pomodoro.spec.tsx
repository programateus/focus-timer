import { beforeEach, expect, describe, it, vi } from "vitest";

import { useAuth } from "@presentation/hooks/use-auth";
import { usePomodoros } from "@presentation/hooks/use-pomodoros";
import { useTasks } from "@presentation/hooks/use-tasks";
import { generateTask } from "@tests/domain/entities/tasks-mock";
import { act, render, screen } from "@testing-library/react";
import { Pomodoro } from "./pomodoro";

vi.mock("@presentation/hooks/use-auth");
vi.mock("@presentation/hooks/use-pomodoros");
vi.mock("@presentation/hooks/use-tasks");

describe("Pomodoro", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", name: "Test User", email: "test@example.com" },
      hasLoaded: true,
      loadData: vi.fn(),
    });

    vi.mocked(usePomodoros).mockReturnValue({
      addPomodoro: vi.fn(),
      pomodoros: [],
      isLoading: false,
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
  });

  it("should render with Ongoing tab selected by default", () => {
    render(<Pomodoro />);
    const ongoingTab = screen.getByLabelText("Ongoing");
    const breakTab = screen.getByLabelText("Break");
    expect(ongoingTab).toBeChecked();
    expect(breakTab).not.toBeChecked();
  });

  it("should switch to Break tab when clicked", async () => {
    render(<Pomodoro />);
    const ongoingTab = screen.getByLabelText("Ongoing");
    const breakTab = screen.getByLabelText("Break");
    await act(async () => {
      breakTab.click();
    });
    expect(breakTab).toBeChecked();
    expect(ongoingTab).not.toBeChecked();
  });

  it("should display Focus timer when Ongoing tab is selected", () => {
    render(<Pomodoro />);
    expect(screen.getByText("Focus")).toBeInTheDocument();
    expect(screen.getByTestId("timer-display")).toHaveTextContent("25:00");
  });
});
