import { z } from "zod/v4";
import { expect, describe, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useForm, UseFormParams } from "./useForm";
import { FormValues } from "./types";

describe("useForm", () => {
  it("should initialize with provided values", () => {
    const initialValues = { name: "John", email: "john@example.com" };
    const { result } = renderHook(() =>
      useForm({
        initialValues,
        onSubmit: vi.fn(),
      }),
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  describe("form value updates", () => {
    it("should update value when setValue is called", () => {
      const initialValues = { name: "", email: "" };
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: vi.fn(),
        }),
      );

      act(() => {
        result.current.setValue("name", "John");
      });

      expect(result.current.values.name).toBe("John");
    });

    it("should update multiple values when setValues is called", () => {
      const initialValues = { name: "", email: "" };
      const newValues = { name: "John", email: "john@example.com" };
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: vi.fn(),
        }),
      );

      act(() => {
        result.current.setValues(newValues);
      });

      expect(result.current.values).toEqual(newValues);
    });

    it("should handle nested values correctly", () => {
      const initialValues = { user: { name: "", profile: { age: 0 } } };
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: vi.fn(),
        }),
      );

      act(() => {
        result.current.setValue("user.name", "John");
        result.current.setValue("user.profile.age", 30);
      });

      expect(result.current.values.user.name).toBe("John");
      expect(result.current.values.user.profile.age).toBe(30);
    });
  });

  describe("validation", () => {
    const validationSchema = z.object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      email: z.string().email("Invalid email format"),
    });

    it("should validate with schema and return true for valid data", () => {
      const initialValues = { name: "John", email: "john@example.com" };
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: vi.fn(),
          validationSchema,
        }),
      );

      const isValid = result.current.validate();
      expect(isValid).toBe(true);
      expect(result.current.errors).toEqual({});
    });

    it("should validate with schema and return false for invalid data", () => {
      const initialValues = { name: "Jo", email: "invalid-email" };
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: vi.fn(),
          validationSchema,
        }),
      );

      const isValid = result.current.validate();
      expect(isValid).toBe(false);
      expect(result.current.errors.name).toBeTruthy();
      expect(result.current.errors.email).toBeTruthy();
    });
  });

  describe("form submission", () => {
    it("should call onSubmit with form values", async () => {
      const initialValues = { name: "John", email: "john@example.com" };
      const onSubmit = vi.fn();
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(onSubmit).toHaveBeenCalledWith(
        initialValues,
        expect.objectContaining({
          setErrors: expect.any(Function),
          setValues: expect.any(Function),
          setIsSubmitting: expect.any(Function),
          resetForm: expect.any(Function),
        }),
      );
    });

    it("should not call onSubmit if validation fails", async () => {
      const initialValues = { name: "", email: "invalid" };
      const onSubmit = vi.fn();
      const validationSchema = z.object({
        name: z.string().min(1, "Required"),
        email: z.string().email("Invalid email"),
      });

      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit,
          validationSchema,
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(onSubmit).not.toHaveBeenCalled();
      expect(result.current.errors.name).toBeTruthy();
      expect(result.current.errors.email).toBeTruthy();
    });

    it("should set all fields as touched on submit", async () => {
      const initialValues = { name: "John", email: "john@example.com" };
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: vi.fn(),
        }),
      );

      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      await act(async () => {
        await result.current.handleSubmit(mockEvent);
      });

      expect(result.current.touched.name).toBe(true);
      expect(result.current.touched.email).toBe(true);
    });
  });

  describe("error handling", () => {
    it("should set and clear errors correctly", () => {
      const initialValues = { name: "", email: "" };
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: vi.fn(),
        }),
      );

      act(() => {
        result.current.setError("name", "Name is required");
      });

      expect(result.current.errors.name).toBe("Name is required");

      act(() => {
        result.current.setErrors({});
      });

      expect(result.current.errors).toEqual({});
    });
  });

  describe("touched fields", () => {
    it("should mark field as touched on blur", () => {
      const initialValues = { name: "", email: "" };
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: vi.fn(),
        }),
      );

      const mockEvent = {
        target: { name: "email" },
      } as unknown as React.FocusEvent<HTMLFormElement>;

      act(() => {
        result.current.handleBlur(mockEvent);
      });

      expect(result.current.touched.email).toBe(true);
    });

    it("should set touched state for multiple fields", () => {
      const initialValues = { name: "", email: "" };
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: vi.fn(),
        }),
      );

      act(() => {
        result.current.setFieldsTouched({ name: true, email: true });
      });

      expect(result.current.touched.name).toBe(true);
      expect(result.current.touched.email).toBe(true);
    });
  });

  describe("reset form", () => {
    it("should reset form to initial values", () => {
      const initialValues = { name: "", email: "" };
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: vi.fn(),
        }),
      );

      act(() => {
        result.current.setValue("name", "John");
        result.current.setError("name", "Some error");
        result.current.setTouched("name", true);
      });

      expect(result.current.values.name).toBe("John");
      expect(result.current.errors.name).toBe("Some error");
      expect(result.current.touched.name).toBe(true);

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.values).toEqual(initialValues);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
    });
  });

  describe("enableReinitialize", () => {
    it("should not update form when initialValues change if enableReinitialize is false", () => {
      const initialValues = { name: "John" };
      const { result, rerender } = renderHook(
        (props: UseFormParams<FormValues>) => useForm(props),
        {
          initialProps: {
            initialValues,
            onSubmit: vi.fn(),
            enableReinitialize: false,
          },
        },
      );

      const newInitialValues = { name: "Jane" };
      rerender({
        initialValues: newInitialValues,
        onSubmit: vi.fn(),
        enableReinitialize: false,
      });

      expect(result.current.values.name).toBe("John");
    });

    it("should update form when initialValues change if enableReinitialize is true", () => {
      const initialValues = { name: "John" };
      const { result, rerender } = renderHook(
        (props: UseFormParams<FormValues>) => useForm(props),
        {
          initialProps: {
            initialValues,
            onSubmit: vi.fn(),
            enableReinitialize: true,
          },
        },
      );

      const newInitialValues = { name: "Jane" };
      rerender({
        initialValues: newInitialValues,
        onSubmit: vi.fn(),
        enableReinitialize: true,
      });

      expect(result.current.values.name).toBe("Jane");
    });
  });

  describe("getFieldProps", () => {
    it("should return correct field props", () => {
      const initialValues = { name: "John", email: "john@example.com" };
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: vi.fn(),
        }),
      );

      const fieldProps = result.current.getFieldProps("name");

      expect(fieldProps).toEqual({
        name: "name",
        value: "John",
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
      });
    });
  });
});
