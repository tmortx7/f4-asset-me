import { FieldHookConfig, useField } from "formik";
import { ClassAttributes, InputHTMLAttributes } from "react";

type TextFieldProps = {
  label: string;
};

export const TextField = ({
  label,
  ...props
}: TextFieldProps &
  InputHTMLAttributes<HTMLInputElement> &
  ClassAttributes<HTMLInputElement> &
  FieldHookConfig<string>) => {
  const [field, meta] = useField(props);
  return (
    <div className="form-control w-full">
      <label className="label">
        <p className="label-text">{label}</p>
      </label>
      <input className="input-bordered input w-full" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="label-text-alt text-red-500 error">{meta.error}</div>
      ) : null}
    </div>
  );
};
