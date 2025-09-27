import z from "zod";

import type { Task } from "@domain/entities/task";
import { useForm } from "@presentation/hooks/use-form/use-form";

import { Button } from "../button";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { useTaskStore } from "../../stores/task-store";

interface TaskFormProps {
  onClose?: () => void;
  task?: Task;
}

const validationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export const TaskForm = ({ onClose, task }: TaskFormProps) => {
  const { addTask, updateTask } = useTaskStore();
  const { values, errors, touched, getFieldProps, handleSubmit } = useForm({
    initialValues: {
      title: task?.title || "",
      description: task?.description || "",
    },
    onSubmit: (values, { resetForm }) => {
      if (task) {
        updateTask(task.id, {
          ...task,
          title: values.title.trim(),
          description: values.description?.trim() || undefined,
          updatedAt: new Date(),
        });
        onClose?.();
        return;
      }
      addTask({
        id: crypto.randomUUID(),
        title: values.title.trim(),
        description: values.description?.trim() || null,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      onClose?.();
      resetForm();
    },
    validationSchema,
    validateOnChange: true,
    enableReinitialize: true,
  });

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          type="text"
          className="w-full"
          placeholder="Digite o título da tarefa..."
          {...getFieldProps("title")}
          error={Boolean(touched.title && errors.title)}
          helperText={touched.title && errors.title ? errors.title : undefined}
        />

        <Textarea
          label="Description (optional)"
          className="w-full"
          placeholder="Digite uma descrição..."
          rows={3}
          {...getFieldProps("description")}
          error={Boolean(touched.description && errors.description)}
          helperText={
            touched.description && errors.description
              ? errors.description
              : undefined
          }
        />

        <div className="flex justify-end gap-2">
          <Button type="button" className="btn-outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="btn-primary"
            disabled={!values.title.trim()}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};
