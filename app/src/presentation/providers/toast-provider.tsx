import React, { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createId } from "@paralleldrive/cuid2";
import {
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiCloseLargeFill,
  RiErrorWarningLine,
  RiInformation2Line,
} from "react-icons/ri";

import {
  type AddToastParams,
  ToastContext,
  type ToastPosition,
} from "@presentation/contexts/toast-context";

type ToastProviderProps = {
  position?: ToastPosition;
  duration?: number;
  children: React.ReactNode;
};

const ALERT_CLASSES = {
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
} as const;

const TOAST_POSITION = {
  start: "toast-start",
  center: "toast-center",
  end: "toast-end",
  top: "toast-top",
  middle: "toast-middle",
  bottom: "toast-bottom",
};

const ICONS = {
  info: (
    <span className="text-info">
      <RiInformation2Line />
    </span>
  ),
  success: (
    <span className="text-success">
      <RiCheckboxCircleLine />
    </span>
  ),
  warning: (
    <span className="text-warning">
      <RiErrorWarningLine />
    </span>
  ),
  error: (
    <span className="text-error">
      <RiCloseCircleLine />
    </span>
  ),
};

type ToastsState = {
  id: string;
  component: React.ReactElement;
};

export const ToastProvider = ({
  children,
  position = "end",
  duration = 4,
}: ToastProviderProps) => {
  const [toastState, setToastState] = useState({
    position,
    duration,
  });
  const [toasts, setToasts] = useState<ToastsState[]>([]);

  const setPosition = useCallback((position: ToastPosition) => {
    setToastState((prev) => ({ ...prev, position }));
  }, []);

  const setDuration = useCallback((duration: number) => {
    setToastState((prev) => ({ ...prev, duration }));
  }, []);

  const removeToast = useCallback((id: string, timeoutId: NodeJS.Timeout) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    clearTimeout(timeoutId);
  }, []);

  const addToast = useCallback(
    ({ message, type = "info" }: AddToastParams) => {
      const id = createId();
      const timeoutId = setTimeout(() => {
        setToasts((prev) => prev.filter((_, i) => i !== 0));
      }, toastState.duration * 1000);

      setToasts((prev) => [
        ...prev,
        {
          id,
          component: (
            <Toast
              key={id}
              id={id}
              timeoutId={timeoutId}
              message={message}
              type={type}
              removeToast={removeToast}
            />
          ),
        },
      ]);
    },
    [removeToast, toastState.duration]
  );

  return (
    <ToastContext.Provider
      value={{ ...toastState, setPosition, setDuration, addToast }}
    >
      {children}
      <div className={`toast ${TOAST_POSITION[toastState.position]} z-[999]`}>
        <AnimatePresence>
          {toasts.map(({ component }) => component)}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

type ToastProps = {
  id: string;
  timeoutId: NodeJS.Timeout;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  removeToast: (id: string, timeoutId: NodeJS.Timeout) => void;
};

const Toast = ({
  id,
  timeoutId,
  message,
  type = "info",
  removeToast,
}: ToastProps) => {
  const idRef = useRef(id);
  const timeoutIdRef = useRef(timeoutId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`alert flex items-center rounded-box bg-base-100 relative min-w-64 shadow-md text-base-content ${ALERT_CLASSES[type]}`}
    >
      <div>{ICONS[type]}</div>
      <p>{message}</p>
      <button
        className="btn btn-ghost btn-circle ml-auto"
        onClick={() => removeToast(idRef.current, timeoutIdRef.current)}
        aria-label="Close"
      >
        <RiCloseLargeFill />
      </button>
    </motion.div>
  );
};
