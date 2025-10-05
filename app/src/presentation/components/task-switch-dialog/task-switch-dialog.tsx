import Dialog from "../dialog";
import { Button } from "../button";

interface TaskSwitchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentTaskTitle: string;
  newTaskTitle: string;
}

export const TaskSwitchDialog = ({
  isOpen,
  onClose,
  onConfirm,
  currentTaskTitle,
  newTaskTitle,
}: TaskSwitchDialogProps) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Switch Active Task?"
      description={`You are currently on task "${currentTaskTitle}". Switching to "${newTaskTitle}" will reset the current timer.`}
    >
      <div className="flex justify-end gap-2">
        <Button
          className="btn-outline"
          onClick={onClose}
          role="button"
          aria-label="cancel"
        >
          Cancel
        </Button>
        <Button
          className="btn-primary"
          onClick={onConfirm}
          role="button"
          aria-label="confirm"
        >
          Confirm
        </Button>
      </div>
    </Dialog>
  );
};
