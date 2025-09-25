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
      title="Trocar tarefa ativa?"
      description={`Você está trabalhando em "${currentTaskTitle}". Trocar para "${newTaskTitle}" irá resetar o temporizador atual.`}
    >
      <div className="flex justify-end gap-2">
        <Button className="btn-outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className="btn-primary" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Dialog>
  );
};
