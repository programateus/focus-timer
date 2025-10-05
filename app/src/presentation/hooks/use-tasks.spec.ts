import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type {
  DefinedUseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import type { Task } from "@domain/entities/task";
import { useTaskStore } from "@presentation/stores/task-store";
import { generateTask } from "@tests/domain/entities/tasks-mock";
import { useAuth } from "./use-auth";
import { useTasks } from "./use-tasks";
import { useListTask } from "./react-query/hooks/task/use-list-task";
import { useCreateTask } from "./react-query/hooks/task/use-create-task";
import { useUpdateTask } from "./react-query/hooks/task/use-update-task";
import { useDeleteTask } from "./react-query/hooks/task/use-delete-task";
import type { CreateTaskDTO } from "@application/dtos/create-task-dto";
import type { UpdateTaskDTO } from "@application/dtos/update-task-dto";

vi.mock("@presentation/hooks/use-auth");
vi.mock("@presentation/stores/task-store");
vi.mock("@presentation/hooks/react-query/hooks/task/use-list-task");
vi.mock("@presentation/hooks/react-query/hooks/task/use-create-task");
vi.mock("@presentation/hooks/react-query/hooks/task/use-update-task");
vi.mock("@presentation/hooks/react-query/hooks/task/use-delete-task");

describe("useTasks", () => {
  const mockSelectTask = vi.fn();
  const mockAddLocalTask = vi.fn();
  const mockUpdateLocalTask = vi.fn();
  const mockDeleteLocalTask = vi.fn();
  const mockCreateMutateAsync = vi.fn();
  const mockUpdateMutateAsync = vi.fn();
  const mockDeleteMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", name: "Test User", email: "test@example.com" },
      hasLoaded: true,
      loadData: vi.fn(),
    });

    vi.mocked(useTaskStore).mockReturnValue({
      selectedTask: null,
      localTasks: [],
      selectTask: mockSelectTask,
      addLocalTask: mockAddLocalTask,
      updateLocalTask: mockUpdateLocalTask,
      deleteLocalTask: mockDeleteLocalTask,
    });

    vi.mocked(useListTask).mockReturnValue({
      data: [],
    } as unknown as DefinedUseQueryResult<Task[], Error>);

    vi.mocked(useCreateTask).mockReturnValue({
      mutateAsync: mockCreateMutateAsync,
      isPending: false,
    } as unknown as UseMutationResult<Task, Error, CreateTaskDTO, unknown>);

    vi.mocked(useUpdateTask).mockReturnValue({
      mutateAsync: mockUpdateMutateAsync,
      isPending: false,
    } as unknown as UseMutationResult<Task, Error, { id: string; data: UpdateTaskDTO }, unknown>);

    vi.mocked(useDeleteTask).mockReturnValue({
      mutateAsync: mockDeleteMutateAsync,
      isPending: false,
    } as unknown as UseMutationResult<void, Error, string, unknown>);
  });

  describe("initialization", () => {
    it("should return empty tasks list initially", () => {
      const { result } = renderHook(() => useTasks());

      expect(result.current.tasks).toEqual([]);
      expect(result.current.selectedTask).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it("should return server tasks when authenticated", () => {
      const serverTasks = [
        generateTask({ id: "1", title: "Server Task 1" }),
        generateTask({ id: "2", title: "Server Task 2" }),
      ];

      vi.mocked(useListTask).mockReturnValue({
        data: serverTasks,
      } as unknown as DefinedUseQueryResult<Task[], Error>);

      const { result } = renderHook(() => useTasks());

      expect(result.current.tasks).toEqual(serverTasks);
    });

    it("should return local tasks when not authenticated", () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        user: null,
        hasLoaded: true,
        loadData: vi.fn(),
      });

      const localTasks = [
        generateTask({ id: "local-1", title: "Local Task 1" }),
        generateTask({ id: "local-2", title: "Local Task 2" }),
      ];

      vi.mocked(useTaskStore).mockReturnValue({
        selectedTask: null,
        localTasks,
        selectTask: mockSelectTask,
        addLocalTask: mockAddLocalTask,
        updateLocalTask: mockUpdateLocalTask,
        deleteLocalTask: mockDeleteLocalTask,
      });

      const { result } = renderHook(() => useTasks());

      expect(result.current.tasks).toEqual(localTasks);
    });
  });

  describe("addTask", () => {
    it("should call server mutation when authenticated", async () => {
      const taskData: CreateTaskDTO = {
        title: "New Task",
        description: "Task description",
      };

      const createdTask = generateTask({ ...taskData, id: "task-123" });
      mockCreateMutateAsync.mockResolvedValue(createdTask);

      const { result } = renderHook(() => useTasks());

      const returnedTask = await result.current.addTask(taskData);

      expect(mockCreateMutateAsync).toHaveBeenCalledWith(taskData);
      expect(mockAddLocalTask).not.toHaveBeenCalled();
      expect(returnedTask).toEqual(createdTask);
    });

    it("should call local store when not authenticated", async () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        user: null,
        hasLoaded: true,
        loadData: vi.fn(),
      });

      const taskData: CreateTaskDTO = {
        title: "Local Task",
        description: "Local description",
      };

      const localTask = generateTask({ ...taskData, id: "local-123" });
      mockAddLocalTask.mockReturnValue(localTask);

      const { result } = renderHook(() => useTasks());

      const returnedTask = await result.current.addTask(taskData);

      expect(mockAddLocalTask).toHaveBeenCalledWith(taskData);
      expect(mockCreateMutateAsync).not.toHaveBeenCalled();
      expect(returnedTask).toEqual(localTask);
    });
  });

  describe("updateTask", () => {
    it("should call server mutation when authenticated", async () => {
      const taskId = "task-123";
      const updateData: UpdateTaskDTO = {
        title: "Updated Task",
        completed: true,
      };

      const updatedTask = generateTask({ id: taskId, ...updateData });
      mockUpdateMutateAsync.mockResolvedValue(updatedTask);

      const { result } = renderHook(() => useTasks());

      await result.current.updateTask(taskId, updateData);

      expect(mockUpdateMutateAsync).toHaveBeenCalledWith({
        id: taskId,
        data: updateData,
      });
      expect(mockUpdateLocalTask).not.toHaveBeenCalled();
    });

    it("should call local store when not authenticated", async () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        user: null,
        hasLoaded: true,
        loadData: vi.fn(),
      });

      const taskId = "local-123";
      const updateData: UpdateTaskDTO = {
        title: "Updated Local Task",
        completed: true,
      };

      const { result } = renderHook(() => useTasks());

      await result.current.updateTask(taskId, updateData);

      expect(mockUpdateLocalTask).toHaveBeenCalledWith(taskId, updateData);
      expect(mockUpdateMutateAsync).not.toHaveBeenCalled();
    });
  });

  describe("deleteTask", () => {
    it("should call server mutation when authenticated", async () => {
      const taskId = "task-123";
      mockDeleteMutateAsync.mockResolvedValue(undefined);

      const { result } = renderHook(() => useTasks());

      await result.current.deleteTask(taskId);

      expect(mockDeleteMutateAsync).toHaveBeenCalledWith(taskId);
      expect(mockDeleteLocalTask).not.toHaveBeenCalled();
    });

    it("should call local store when not authenticated", async () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        user: null,
        hasLoaded: true,
        loadData: vi.fn(),
      });

      const taskId = "local-123";

      const { result } = renderHook(() => useTasks());

      await result.current.deleteTask(taskId);

      expect(mockDeleteLocalTask).toHaveBeenCalledWith(taskId);
      expect(mockDeleteMutateAsync).not.toHaveBeenCalled();
    });
  });

  describe("selectTask", () => {
    it("should call selectTask from store", () => {
      const task = generateTask({ id: "task-123" });

      const { result } = renderHook(() => useTasks());

      result.current.selectTask(task);

      expect(mockSelectTask).toHaveBeenCalledWith(task);
    });
  });

  describe("selectedTask", () => {
    it("should return selected task from store", () => {
      const selectedTask = generateTask({ id: "selected-123" });

      vi.mocked(useTaskStore).mockReturnValue({
        selectedTask,
        localTasks: [],
        selectTask: mockSelectTask,
        addLocalTask: mockAddLocalTask,
        updateLocalTask: mockUpdateLocalTask,
        deleteLocalTask: mockDeleteLocalTask,
      });

      const { result } = renderHook(() => useTasks());

      expect(result.current.selectedTask).toEqual(selectedTask);
    });
  });

  describe("isLoading", () => {
    it("should return true when create is pending and authenticated", () => {
      vi.mocked(useCreateTask).mockReturnValue({
        mutateAsync: mockCreateMutateAsync,
        isPending: true,
      } as unknown as UseMutationResult<Task, Error, CreateTaskDTO, unknown>);

      const { result } = renderHook(() => useTasks());

      expect(result.current.isLoading).toBe(true);
    });

    it("should return true when update is pending and authenticated", () => {
      vi.mocked(useUpdateTask).mockReturnValue({
        mutateAsync: mockUpdateMutateAsync,
        isPending: true,
      } as unknown as UseMutationResult<Task, Error, { id: string; data: UpdateTaskDTO }, unknown>);

      const { result } = renderHook(() => useTasks());

      expect(result.current.isLoading).toBe(true);
    });

    it("should return true when delete is pending and authenticated", () => {
      vi.mocked(useDeleteTask).mockReturnValue({
        mutateAsync: mockDeleteMutateAsync,
        isPending: true,
      } as unknown as UseMutationResult<void, Error, string, unknown>);

      const { result } = renderHook(() => useTasks());

      expect(result.current.isLoading).toBe(true);
    });

    it("should return false when not authenticated even if mutations are pending", () => {
      vi.mocked(useAuth).mockReturnValue({
        isAuthenticated: false,
        user: null,
        hasLoaded: true,
        loadData: vi.fn(),
      });

      vi.mocked(useCreateTask).mockReturnValue({
        mutateAsync: mockCreateMutateAsync,
        isPending: true,
      } as unknown as UseMutationResult<Task, Error, CreateTaskDTO, unknown>);

      const { result } = renderHook(() => useTasks());

      expect(result.current.isLoading).toBe(false);
    });

    it("should return false when all mutations are not pending", () => {
      const { result } = renderHook(() => useTasks());

      expect(result.current.isLoading).toBe(false);
    });
  });
});
