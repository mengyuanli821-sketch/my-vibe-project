import type { ChangeEventHandler, ReactNode } from "react";

type FormFieldProps = {
  label: string;
  children: ReactNode;
  hint?: string;
};

export function FormField({ label, children, hint }: FormFieldProps) {
  return (
    <fieldset className="form-field grid min-w-0 gap-2 border-0 p-0 text-sm font-medium text-stone-800">
      <legend>{label}</legend>
      <p aria-hidden={!hint} className="form-field-hint -mt-1 text-xs font-normal text-stone-500">{hint || "\u00a0"}</p>
      {children}
    </fieldset>
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
      className="form-control"
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
      className="form-control min-h-24 resize-y"
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      value={value}
    />
  );
}

type MultiSelectProps = {
  options: readonly string[];
  value: string;
  onToggle: (option: string) => void;
};

export function MultiSelect({ options, value, onToggle }: MultiSelectProps) {
  const selected = value.split(",").map((item) => item.trim());

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option);

        return (
          <button
            aria-pressed={isSelected}
            className={`choice-chip ${isSelected ? "choice-chip-selected" : ""}`}
            key={option}
            onClick={() => onToggle(option)}
            type="button"
          >
            <span aria-hidden="true">{isSelected ? "✓" : "+"}</span>
            {option}
          </button>
        );
      })}
    </div>
  );
}

type RatingSelectorProps = {
  label: string;
  lowLabel: string;
  highLabel: string;
  value: string;
  onChange: (value: string) => void;
};

export function RatingSelector({ label, lowLabel, highLabel, value, onChange }: RatingSelectorProps) {
  return (
    <fieldset className="rating-card">
      <legend className="text-sm font-semibold text-stone-800">{label}</legend>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            aria-label={`${label}: ${score} out of 5`}
            aria-pressed={value === String(score)}
            className={`rating-button ${value === String(score) ? "rating-button-selected" : ""}`}
            key={score}
            onClick={() => onChange(String(score))}
            type="button"
          >
            {score}
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] font-normal text-stone-500">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </fieldset>
  );
}
