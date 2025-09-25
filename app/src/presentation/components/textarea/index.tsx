import { type TextareaHTMLAttributes } from "react";
import { RiCloseCircleLine } from "react-icons/ri";
import { Field, Textarea as HUITextarea, Label } from "@headlessui/react";

import cn from "@presentation/utils/cn";

import { Icon } from "../icon";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  fullWidth?: boolean;
  helperText?: string;
  error?: boolean;
};

export const Textarea = ({
  label,
  fullWidth,
  helperText,
  error,
  className,
  ...props
}: TextareaProps) => {
  return (
    <div className="">
      <Field as="fieldset" className="fieldset">
        {label && <Label className="fieldset-legend">{label}</Label>}
        <HUITextarea
          className={cn(
            "textarea",
            fullWidth && "w-full",
            error && "textarea-error",
            className
          )}
          rows={3}
          {...props}
        />
      </Field>
      {helperText && (
        <p
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
