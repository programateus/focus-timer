import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PomodoroSession {
  id: string;
  taskId: string;
  duration: number;
  startedAt: Date;
  completedAt: Date;
  type: "work" | "break";
}

interface PomodoroState {
  currentSession: PomodoroSession | null;
  sessions: PomodoroSession[];
  totalPomodoros: number;
  totalBreaks: number;
  setCurrentSession: (session: PomodoroSession | null) => void;
  addSession: (session: PomodoroSession) => void;
  setSessions: (sessions: PomodoroSession[]) => void;
  clearLocalPomodoros: () => void;
  setLocalPomodoros: (sessions: PomodoroSession[]) => void;
  getStats: () => {
    totalPomodoros: number;
    totalBreaks: number;
    totalWorkTime: number;
  };
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      sessions: [],
      totalPomodoros: 0,
      totalBreaks: 0,
      setCurrentSession: (session: PomodoroSession | null) =>
        set({ currentSession: session }),
      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, session],
          totalPomodoros:
            session.type === "work"
              ? state.totalPomodoros + 1
              : state.totalPomodoros,
          totalBreaks:
            session.type === "break"
              ? state.totalBreaks + 1
              : state.totalBreaks,
        })),
      setSessions: (sessions) => {
        const pomodoros = sessions.filter(
          (session) => session.type === "work"
        ).length;
        const breaks = sessions.filter(
          (session) => session.type === "break"
        ).length;
        set({ sessions, totalPomodoros: pomodoros, totalBreaks: breaks });
      },
      clearLocalPomodoros: () => set({ sessions: [] }),
      setLocalPomodoros: (sessions) => set({ sessions }),
      getStats: () => {
        const { sessions } = get();
        const workSessions = sessions.filter(
          (session) => session.type === "work"
        );
        return {
          totalPomodoros: workSessions.length,
          totalBreaks: sessions.filter((session) => session.type === "break")
            .length,
          totalWorkTime: workSessions.reduce(
            (total, session) => total + session.duration,
            0
          ),
        };
      },
    }),
    {
      name: "pomodoro-storage",
    }
  )
);
