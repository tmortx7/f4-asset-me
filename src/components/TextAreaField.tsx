import type { FieldHookConfig} from "formik";
import { useField } from "formik";
import type { InputHTMLAttributes, ClassAttributes } from "react";

type TextFieldProps = {
  label: string;
};

export const TextField = ({
  label,
  ...props
}: TextFieldProps &
  InputHTMLAttributes<HTMLTextAreaElement> &
  ClassAttributes<HTMLTextAreaElement> &
  FieldHookConfig<string>) => {
  const [field] = useField(props);
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label"><span className="label-text">{label}</span></label>
      <textarea className="textarea textarea-bordered h-24" {...field} {...props} />
    </div>
  );
};
