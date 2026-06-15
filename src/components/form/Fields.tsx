import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

/** Samma fältstil som dagens kontaktformulär (extraherad för återanvändning). */
export const inputClass =
  "mt-1 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-2 disabled:opacity-60";

/** Primär submit-knapp (matchar kontaktsidans knapp, men stöder disabled-läge). */
export const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-deep focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-deep disabled:cursor-not-allowed disabled:opacity-60";

const invalidClass = "border-red-400 focus-visible:outline-red-400";

function cx(...parts: (string | false | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/** Etikett + valfri hjälptext + felmeddelande runt ett fält. */
export function Field({
  htmlFor,
  label,
  required,
  hint,
  error,
  children,
}: {
  htmlFor?: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block font-medium text-brand-deep">
        {label} {required ? <span aria-hidden="true">*</span> : null}
      </label>
      {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
      {children}
      {error ? (
        <p className="mt-1 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({
  invalid,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input {...props} className={cx(inputClass, invalid && invalidClass, className)} />;
}

export function TextArea({
  invalid,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return <textarea {...props} className={cx(inputClass, invalid && invalidClass, className)} />;
}

export function SelectInput({
  invalid,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <select {...props} className={cx(inputClass, invalid && invalidClass, className)}>
      {children}
    </select>
  );
}

export function Checkbox({
  id,
  children,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { children: ReactNode }) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 text-sm text-foreground">
      <input
        id={id}
        type="checkbox"
        {...props}
        className="mt-1 h-5 w-5 shrink-0 rounded border-border text-brand accent-brand"
      />
      <span>{children}</span>
    </label>
  );
}
