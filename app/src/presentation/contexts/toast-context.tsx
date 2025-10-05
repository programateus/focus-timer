import { createContext } from "react";

export type AddToastParams = {
  message: string;
  type?: "info" | "success" | "warning" | "error";
};

export type ToastPosition =
  | "start"
  | "center"
  | "end"
  | "top"
  | "middle"
  | "bottom";

export type ToastContextParams = {
  position: ToastPosition;
  duration: number;
  setPosition: (position: ToastPosition) => void;
  setDuration: (duration: number) => void;
  addToast: (params: AddToastParams) => void;
};

export const ToastContext = createContext<ToastContextParams | null>(null);
