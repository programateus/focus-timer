/* eslint-disable @typescript-eslint/no-explicit-any */

export type GetFieldProps = (field: string) => FieldInputProps<any>;

export interface FormValues {
  [field: string]: any;
}

export type FormErrors<Values> = {
  [K in keyof Values]?: Values[K] extends any[]
    ? Values[K][number] extends object
      ? FormErrors<Values[K][number]>[] | string | string[]
      : string | string[]
    : Values[K] extends object
      ? FormErrors<Values[K]>
      : string;
};

export type FormTouched<Values> = {
  [K in keyof Values]?: Values[K] extends any[]
    ? Values[K][number] extends object
      ? FormTouched<Values[K][number]>[]
      : boolean
    : Values[K] extends object
      ? FormTouched<Values[K]>
      : boolean;
};

export interface FieldInputProps<Value> {
  value: Value;
  name: string;
  multiple?: boolean;
  checked?: boolean;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onBlur: {
    (e: React.FocusEvent<any>): void;
    <T = string | any>(
      fieldOrEvent: T,
    ): T extends string ? (e: any) => void : void;
  };
}
