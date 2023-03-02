import { FieldHookConfig, useField } from "formik";
import { ClassAttributes, TextareaHTMLAttributes } from "react";

type TextFieldProps = {
  label: string;
};

export const TextAreaField = ({
  label,
  ...props
}: TextFieldProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> &
  ClassAttributes<HTMLTextAreaElement> &
  FieldHookConfig<string>) => {
  const [field] = useField(props);
  return (
    <div className="form-control w-full">
      <label className="label">
        <p className="label-text">{label}</p>
      </label>
      <textarea
        className="textarea-bordered textarea h-24  w-full leading-tight"
        {...field}
        {...props}
      />
    </div>
  );
};
