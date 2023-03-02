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
  InputHTMLAttributes<HTMLInputElement> &
  ClassAttributes<HTMLInputElement> &
  FieldHookConfig<string>) => {
  const [field,meta] = useField(props);
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label"><span className="label-text font-semibold">{label}</span></label>
      <input className="input input-bordered w-full max-w-xs" {...field} {...props} />
      <label className="label"><span className="label-text-alt text-red-500">{meta.error}</span></label>
    </div>
  );
};
