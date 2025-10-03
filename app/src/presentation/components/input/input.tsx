import cn from "@presentation/utils/cn";
import React, { type InputHTMLAttributes } from "react";
import { RiCloseCircleLine } from "react-icons/ri";
import { Icon } from "../icon";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  fullWidth?: boolean;
  helperText?: string;
  error?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  label?: string;
  ref?: React.Ref<HTMLInputElement>;
};

export const Input = ({
  className,
  fullWidth,
  helperText,
  error,
  icon,
  iconPosition,
  label,
  ...props
}: InputProps) => {
  return (
    <div className={cn(fullWidth && "w-full")}>
      <label className="floating-label" htmlFor={props.name}>
        {label && <span aria-label={`Field ${label}`}>{label}</span>}
        {icon && iconPosition === "left" && icon}
        <input
          className={cn(
            "input",
            error && "input-error",
            fullWidth && "w-full",
            className
          )}
          {...props}
        />
        {icon && iconPosition === "right" && icon}
      </label>
      {helperText && (
        <p
          aria-describedby={props.id}
          aria-invalid={error}
          className={`mt-1 px-3 text-xs flex items-center ${
            error ? "text-error" : ""
          }`}
        >
          {error && <Icon Icon={RiCloseCircleLine} />} {helperText}
        </p>
      )}
    </div>
  );
};
