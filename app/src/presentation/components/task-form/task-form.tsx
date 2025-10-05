import z from "zod";

import type { Task } from "@domain/entities/task";
import { useToast } from "@presentation/hooks/use-toast";
import { useForm } from "@presentation/hooks/use-form/use-form";

import { Button } from "../button";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { useTasks } from "../../hooks/use-tasks";

interface TaskFormProps {
  onClose?: () => void;
  task?: Task;
}

const validationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export const TaskForm = ({ onClose, task }: TaskFormProps) => {
  const { addTask, updateTask } = useTasks();
  const { addToast } = useToast();
  const { errors, isSubmitting, touched, getFieldProps, handleSubmit } =
    useForm({
      initialValues: {
        title: task?.title || "",
        description: task?.description || "",
      },
      onSubmit: async (values, { resetForm }) => {
        if (task) {
          await updateTask(task.id, {
            title: values.title.trim(),
            description: values.description?.trim() || undefined,
          });
          resetForm();
          addToast({
            type: "success",
            message: "Task updated successfully",
          });
          onClose?.();
          return;
        }

        await addTask({
          title: values.title.trim(),
          description: values.description?.trim() || undefined,
        });

        resetForm();
        addToast({
          type: "success",
          message: "Task added successfully",
        });
        onClose?.();
      },
      validationSchema,
      validateOnChange: true,
      enableReinitialize: true,
    });

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        data-testid="task-form"
      >
        <Input
          id="title"
          label="Task Title"
          type="text"
          className="w-full"
          placeholder="Digite o título da tarefa..."
          {...getFieldProps("title")}
          error={Boolean(touched.title && errors.title)}
          helperText={touched.title && errors.title ? errors.title : undefined}
        />

        <Textarea
          id="description"
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
          <Button
            type="button"
            className="btn-outline"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Cancel"
            role="button"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="btn-primary"
            isLoading={isSubmitting}
            aria-label={task ? "Update Task" : "Create Task"}
            role="button"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};
