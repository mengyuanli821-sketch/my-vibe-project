import type { ChangeEventHandler, ReactNode } from "react";

type FormFieldProps = {
  label: string;
  children: ReactNode;
};

export function FormField({ label, children }: FormFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-stone-800">
      <span>{label}</span>
      {children}
    </label>
  );
}

type TextInputProps = {
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  type?: string;
  placeholder?: string;
};

export function TextInput({ name, value, onChange, required, type = "text", placeholder }: TextInputProps) {
  return (
    <input
      className="min-h-11 rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-950 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      type={type}
      value={value}
    />
  );
}

type TextAreaProps = {
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  required?: boolean;
  placeholder?: string;
};

export function TextArea({ name, value, onChange, required, placeholder }: TextAreaProps) {
  return (
    <textarea
      className="min-h-28 rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-950 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      value={value}
    />
  );
}
