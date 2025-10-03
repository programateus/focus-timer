import {
  Description,
  Dialog as HeadlessUIDialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { HiXMark } from "react-icons/hi2";
import { Icon } from "../icon";

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

const Dialog = ({
  isOpen,
  onClose,
  children,
  description,
  title,
}: DialogProps) => {
  return (
    <HeadlessUIDialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-base-300/50" />

      <div className="fixed inset-0 w-screen overflow-y-auto p-4">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel className="w-lg max-w-lg space-y-4 bg-base-100 p-4 rounded-box shadow-lg">
            <div className="relative flex">
              {title && (
                <DialogTitle className="font-bold text-lg">{title}</DialogTitle>
              )}
              <button
                aria-label="Close dialog"
                type="button"
                className="btn btn-circle btn-sm btn-ghost ml-auto"
                onClick={onClose}
              >
                <Icon Icon={HiXMark} />
              </button>
            </div>
            {description && <Description>{description}</Description>}
            {children}
          </DialogPanel>
        </div>
      </div>
    </HeadlessUIDialog>
  );
};

export default Dialog;
