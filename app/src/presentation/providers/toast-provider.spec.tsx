import type React from "react";
import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";

import { useToast } from "@presentation/hooks/use-toast";

import { ToastProvider } from "./toast-provider";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLProps<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

vi.mock("@paralleldrive/cuid2", () => ({
  createId: vi.fn(() => "test-id-123"),
}));

const TestComponent = () => {
  const { addToast, setPosition, setDuration } = useToast();

  return (
    <div>
      <button
        onClick={() => addToast({ message: "Info message", type: "info" })}
        data-testid="add-info-toast"
      >
        Add Info Toast
      </button>
      <button
        onClick={() =>
          addToast({ message: "Success message", type: "success" })
        }
        data-testid="add-success-toast"
      >
        Add Success Toast
      </button>
      <button
        onClick={() =>
          addToast({ message: "Warning message", type: "warning" })
        }
        data-testid="add-warning-toast"
      >
        Add Warning Toast
      </button>
      <button
        onClick={() => addToast({ message: "Error message", type: "error" })}
        data-testid="add-error-toast"
      >
        Add Error Toast
      </button>
      <button
        onClick={() => setPosition("center")}
        data-testid="change-position"
      >
        Change Position
      </button>
      <button onClick={() => setDuration(10)} data-testid="change-duration">
        Change Duration
      </button>
    </div>
  );
};

describe("ToastProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initialization", () => {
    it("should render children", () => {
      render(
        <ToastProvider>
          <div data-testid="child">Child content</div>
        </ToastProvider>
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("should use default position", () => {
      render(
        <ToastProvider>
          <div>Content</div>
        </ToastProvider>
      );

      const toastContainer = document.querySelector(".toast");
      expect(toastContainer).toHaveClass("toast-end");
    });

    it("should use custom position", () => {
      render(
        <ToastProvider position="center">
          <div>Content</div>
        </ToastProvider>
      );

      const toastContainer = document.querySelector(".toast");
      expect(toastContainer).toHaveClass("toast-center");
    });
  });

  describe("addToast", () => {
    it("should add an info toast", async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const addButton = screen.getByTestId("add-info-toast");
      await act(async () => addButton.click());

      expect(screen.getByText("Info message")).toBeInTheDocument();
    });

    it("should add a success toast", async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const addButton = screen.getByTestId("add-success-toast");
      await act(async () => addButton.click());

      expect(screen.getByText("Success message")).toBeInTheDocument();
    });

    it("should add a warning toast", async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const addButton = screen.getByTestId("add-warning-toast");
      await act(async () => addButton.click());

      expect(screen.getByText("Warning message")).toBeInTheDocument();
    });

    it("should add an error toast", async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const addButton = screen.getByTestId("add-error-toast");
      await act(async () => addButton.click());

      expect(screen.getByText("Error message")).toBeInTheDocument();
    });

    it("should add multiple toasts", async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );
      await act(async () => {
        screen.getByTestId("add-info-toast").click();
        screen.getByTestId("add-success-toast").click();
        screen.getByTestId("add-error-toast").click();
      });

      expect(screen.getByText("Info message")).toBeInTheDocument();
      expect(screen.getByText("Success message")).toBeInTheDocument();
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });
  });

  describe("removeToast", () => {
    it("should remove toast when close button is clicked", async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      await act(async () => {
        screen.getByTestId("add-info-toast").click();
      });
      expect(screen.getByText("Info message")).toBeInTheDocument();

      const closeButton = screen.getByLabelText("Close");
      await act(async () => {
        closeButton.click();
      });

      expect(screen.queryByText("Info message")).not.toBeInTheDocument();
    });

    it("should remove toast automatically after duration", async () => {
      render(
        <ToastProvider duration={4}>
          <TestComponent />
        </ToastProvider>
      );

      const addInfoToast = screen.getByTestId("add-info-toast");
      await act(async () => {
        addInfoToast.click();
      });
      expect(screen.getByText("Info message")).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(4000);
      });

      expect(screen.queryByText("Info message")).not.toBeInTheDocument();
    });

    it("should remove only the first toast after duration", async () => {
      render(
        <ToastProvider duration={4}>
          <TestComponent />
        </ToastProvider>
      );

      await act(async () => {
        screen.getByTestId("add-info-toast").click();
      });
      expect(screen.getByText("Info message")).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      await act(async () => {
        screen.getByTestId("add-success-toast").click();
      });

      expect(screen.getByText("Success message")).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.queryByText("Info message")).not.toBeInTheDocument();

      expect(screen.getByText("Success message")).toBeInTheDocument();
    });
  });

  describe("setPosition", () => {
    it("should change toast position", async () => {
      render(
        <ToastProvider position="end">
          <TestComponent />
        </ToastProvider>
      );

      let toastContainer = document.querySelector(".toast");
      expect(toastContainer).toHaveClass("toast-end");

      await act(async () => {
        screen.getByTestId("change-position").click();
      });

      toastContainer = document.querySelector(".toast");
      expect(toastContainer).toHaveClass("toast-center");
    });
  });

  describe("setDuration", () => {
    it("should change toast duration", async () => {
      render(
        <ToastProvider duration={4}>
          <TestComponent />
        </ToastProvider>
      );

      await act(async () => {
        screen.getByTestId("change-duration").click();
      });

      await act(async () => {
        screen.getByTestId("add-info-toast").click();
      });
      expect(screen.getByText("Info message")).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(4000);
      });

      expect(screen.getByText("Info message")).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(6000);
      });

      expect(screen.queryByText("Info message")).not.toBeInTheDocument();
    });
  });

  describe("toast styling", () => {
    it("should apply correct classes for info toast", async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const addInfoToast = screen.getByTestId("add-info-toast");

      await act(async () => {
        addInfoToast.click();
      });

      const toast = screen.getByText("Info message").closest(".alert");
      expect(toast).toHaveClass("alert-info");
    });

    it("should apply correct classes for success toast", async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const addSuccessToast = screen.getByTestId("add-success-toast");

      await act(async () => {
        addSuccessToast.click();
      });

      const toast = screen.getByText("Success message").closest(".alert");
      expect(toast).toHaveClass("alert-success");
    });

    it("should apply correct classes for warning toast", async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const addWarningToast = screen.getByTestId("add-warning-toast");
      await act(async () => {
        addWarningToast.click();
      });

      const toast = screen.getByText("Warning message").closest(".alert");
      expect(toast).toHaveClass("alert-warning");
    });

    it("should apply correct classes for error toast", async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const addErrorToast = screen.getByTestId("add-error-toast");

      await act(async () => {
        addErrorToast.click();
      });

      const toast = screen.getByText("Error message").closest(".alert");
      expect(toast).toHaveClass("alert-error");
    });
  });

  describe("toast container positioning", () => {
    it.each([
      ["start", "toast-start"],
      ["center", "toast-center"],
      ["end", "toast-end"],
    ] as const)(
      "should position toast container at %s",
      (position, expectedClass) => {
        render(
          <ToastProvider position={position}>
            <div>Content</div>
          </ToastProvider>
        );

        const toastContainer = document.querySelector(".toast");
        expect(toastContainer).toHaveClass(expectedClass);
      }
    );
  });

  describe("context values", () => {
    it("should provide addToast function", async () => {
      const TestContextComponent = () => {
        const { addToast } = useToast();
        return (
          <button onClick={() => addToast({ message: "Test" })}>
            Add Toast
          </button>
        );
      };

      render(
        <ToastProvider>
          <TestContextComponent />
        </ToastProvider>
      );

      const button = screen.getByText("Add Toast");
      await act(async () => {
        button.click();
      });

      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });
});
