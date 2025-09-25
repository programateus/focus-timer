/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash";
import { z } from "zod/v4";

import type { FormErrors, FormValues } from "./types";

export type Value =
  | string
  | number
  | boolean
  | null
  | undefined
  | Value[]
  | { [key: string]: Value };

export const parseZodErrorSchema = <Values extends FormValues>(
  zodErrors: z.core.$ZodIssue[],
  originalValues: Values
): FormErrors<Values> => {
  let errors = _.cloneDeep({
    ...originalValues,
  }) as FormErrors<Values>;
  errors = setAllValues(errors as any, undefined);
  for (let i = 0; i < zodErrors.length; i++) {
    const { path, message } = zodErrors[i] as z.core.$ZodIssue;
    _.set(errors, path, message);
  }
  return errors;
};

export const setAllValues = (obj: any, value: any): any => {
  return _.transform(obj, (result, o, key) => {
    if (Array.isArray(o)) {
      if (o.length === 0) {
        result[key] = value;
        return;
      }
      const allPrimitiveValues = o.every(
        (v) => _.isString(v) || _.isNumber(v) || _.isBoolean(v)
      );
      result[key] = allPrimitiveValues
        ? undefined
        : _.map(o, (v) => setAllValues(v, value));
    } else if (_.isPlainObject(o)) {
      result[key] = setAllValues(o, value);
    } else {
      result[key] = value;
    }
  });
};
