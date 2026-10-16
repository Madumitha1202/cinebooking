import { forwardRef, useId } from "react";

// Reusable controlled input with label + error message. forwardRef lets parents focus it (useRef).
const Input = forwardRef(function Input({ label, error, className = "", ...rest }, ref) {
  const id = useId();
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 sm:text-base ${
          error ? "border-red-400 focus:ring-red-200" : "border-slate-300 focus:border-brand-500 focus:ring-rose-200"
        }`}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
