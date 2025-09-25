import _ from "lodash";
import { z } from "zod/v4";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { parseZodErrorSchema, setAllValues } from "./utils";
import type {
  FormErrors,
  FormTouched,
  FormValues,
  GetFieldProps,
} from "./types";

type OnSubmitOptions<Values extends FormValues> = {
  setErrors: (errors: FormErrors<Values>) => void;
  setValues: (values: Values) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  resetForm: () => void;
};

export type UseFormParams<Values extends FormValues> = {
  initialValues: Values;
  onSubmit: (
    values: Values,
    options: OnSubmitOptions<Values>
  ) => Promise<void> | void;
  validationSchema?: z.ZodSchema<Values>;
  validateOnChange?: boolean;
  enableReinitialize?: boolean;
};

type FormValuesPayload = {
  name: string;
  value: unknown;
};

type FormValuesAction<Values extends FormValues> =
  | {
      type: "formUpdate";
      payload: FormValuesPayload;
    }
  | {
      type: "formUpdateAll";
      payload: Values;
    };

const formValuesReducer = <Values extends FormValues>(
  values: Values,
  action: FormValuesAction<Values>
) => {
  switch (action.type) {
    case "formUpdate":
      return _.set(
        { ...values },
        action.payload.name.split("."),
        action.payload.value
      );
    case "formUpdateAll":
      return action.payload;
    default:
      return values;
  }
};

type FormErrorsPayload = {
  name: string;
  value: string;
};

type FormErrorsAction<Values extends FormValues> =
  | {
      type: "errorUpdate" | "errorReset";
      payload: FormErrorsPayload;
    }
  | {
      type: "errorUpdateAll";
      payload: FormErrors<Values>;
    };

const formErrorsReducer = <Values extends FormValues>(
  errors: FormErrors<Values>,
  action: FormErrorsAction<Values>
) => {
  switch (action.type) {
    case "errorUpdate":
      return _.set(
        { ...errors },
        action.payload.name.split("."),
        action.payload.value
      );
    case "errorReset":
      return {};
    case "errorUpdateAll":
      return action.payload;
    default:
      return errors;
  }
};

type FormTouchedPayload = {
  name: string;
  value: boolean;
};

type FormTouchedAction<Values extends FormValues> =
  | {
      type: "touchedUpdate" | "touchedReset";
      payload: FormTouchedPayload;
    }
  | {
      type: "touchedUpdateMany";
      payload: FormTouched<Values>;
    }
  | {
      type: "touchedUpdateAll";
      payload: FormTouched<Values>;
    };

const formTouchedReducer = <Values extends FormValues>(
  touched: FormTouched<Values>,
  action: FormTouchedAction<Values>
) => {
  switch (action.type) {
    case "touchedUpdate":
      return _.set(
        { ...touched },
        action.payload.name.split("."),
        action.payload.value
      );
    case "touchedUpdateMany":
      return {
        ...touched,
        ...action.payload,
      };
    case "touchedUpdateAll":
      return action.payload;
    case "touchedReset":
      return {};
    default:
      return touched;
  }
};

export type FormTypeReturn<Values extends FormValues> = {
  values: Values;
  errors: FormErrors<Values>;
  touched: FormTouched<Values>;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setValue: (name: string, value: unknown) => void;
  setValues: (values: Values) => void;
  setError: (name: string, value: string) => void;
  setErrors: (errors: FormErrors<Values>) => void;
  setTouched: (name: string, value: boolean) => void;
  setFieldsTouched: (touched: FormTouched<Values>) => void;
  resetForm: () => void;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLFormElement>) => void;
  getFieldProps: GetFieldProps;
  validate: () => boolean | null;
};

export const useForm = <Values extends FormValues = FormValues>({
  validateOnChange = true,
  enableReinitialize = false,
  ...params
}: UseFormParams<Values>): FormTypeReturn<Values> => {
  const initialValues = useRef(params.initialValues);
  const [formValues, setFormValues] = useReducer(
    formValuesReducer,
    params.initialValues
  );
  const [formErrors, setFormErrors] = useReducer(formErrorsReducer, {});
  const [formTouched, setFormTouched] = useReducer(formTouchedReducer, {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name: string, value: unknown) => {
    setFormValues({
      type: "formUpdate",
      payload: { name, value },
    });
  }, []);

  const setValues = useCallback((values: Values) => {
    setFormValues({
      type: "formUpdateAll",
      payload: values,
    });
  }, []);

  const setError = useCallback((name: string, value: string) => {
    setFormErrors({
      type: "errorUpdate",
      payload: { name, value },
    });
  }, []);

  const setErrors = useCallback((errors: FormErrors<Values>) => {
    setFormErrors({
      type: "errorUpdateAll",
      payload: errors,
    });
  }, []);

  const setTouched = useCallback((name: string, value: boolean) => {
    setFormTouched({
      type: "touchedUpdate",
      payload: { name, value },
    });
  }, []);

  const setFieldsTouched = useCallback((touched: FormTouched<Values>) => {
    setFormTouched({
      type: "touchedUpdateMany",
      payload: touched,
    });
  }, []);

  const setAllTouched = useCallback(() => {
    setFormTouched({
      type: "touchedUpdateAll",
      payload: setAllValues(formValues, true),
    });
  }, [formValues]);

  const validate = useCallback(() => {
    if (!params.validationSchema) return null;
    const result = (params.validationSchema as z.ZodSchema<Values>).safeParse(
      formValues
    );
    if (!result.success) {
      const errors = parseZodErrorSchema(result.error.issues, formValues);
      setErrors(errors);
      return result.success;
    }
    setFormErrors({
      type: "errorUpdateAll",
      payload: {},
    });
    return result.success;
  }, [formValues, params.validationSchema, setErrors]);

  const resetForm = useCallback(() => {
    setFormValues({
      type: "formUpdateAll",
      payload: params.initialValues,
    });
    setFormErrors({
      type: "errorUpdateAll",
      payload: {},
    });
    setFormTouched({
      type: "touchedUpdateAll",
      payload: {},
    });
  }, [params.initialValues]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.currentTarget;
      if (!name) return;
      setFormValues({
        type: "formUpdate",
        payload: { name, value },
      });
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setAllTouched();
      if (validate() === false) return;
      await params.onSubmit(formValues, {
        setErrors,
        setValues,
        setIsSubmitting,
        resetForm,
      });
    },
    [
      setAllTouched,
      validate,
      params,
      formValues,
      setErrors,
      setValues,
      resetForm,
    ]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLFormElement>) => {
      const { name } = e.target;
      setFormTouched({
        type: "touchedUpdate",
        payload: { name, value: true },
      });
      validate();
    },
    [validate]
  );

  const getFieldProps: GetFieldProps = useCallback(
    (field: string) => {
      const val = _.get(formValues, field);
      return {
        name: field,
        value: val,
        onChange: handleChange,
        onBlur: handleBlur,
      };
    },
    [formValues, handleBlur, handleChange]
  );

  useEffect(() => {
    if (validateOnChange) validate();
  }, [validate, formValues, validateOnChange]);

  useEffect(() => {
    if (!enableReinitialize) {
      return;
    }
    if (!_.isEqual(params.initialValues, initialValues.current)) {
      initialValues.current = params.initialValues;
      resetForm();
      setValues(params.initialValues);
    }
  }, [enableReinitialize, params.initialValues, resetForm, setValues]);

  return {
    values: formValues,
    errors: formErrors,
    touched: formTouched,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleSubmit,
    handleBlur,
    setValues,
    setValue,
    setError,
    setErrors,
    setTouched,
    setFieldsTouched,
    validate,
    getFieldProps,
    resetForm,
  };
};
