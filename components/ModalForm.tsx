import React, { useEffect, useState } from "react";
import { Site } from "./Site";

export type FormControlType = "text" | "password" | "number";
type FormSchema = Record<string, { type: FormControlType; label: string }>;

export function ModalForm<F extends FormSchema>({
  form,
  onSubmit,
  formDisabled,
  submitDisabled,
  errorMessage,
  onFormValueChange,
}: {
  form: F;
  onSubmit: (data: Record<keyof FormSchema, any>) => void;
  formDisabled?: boolean;
  submitDisabled?: boolean;
  errorMessage?: string;
  onFormValueChange: () => any;
}) {
  const onClick = () => {
    if (!submitDisabled) onSubmit(formData);
  };
  const [formData, setFormData] = useState(
    Object.fromEntries(Object.entries(form).map(([key, value]) => [key, ""]))
  );
  useEffect(() => {
    onFormValueChange();
  }, [formData]);

  return (
    <Site>
      <main className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center w-52 pb-24">
          <div className="text-7xl font-serif">
            GNTM<span className="text-brand">HUB</span>
          </div>
          {Object.entries(form).map(([key, field]) => (
            <input
              key={key}
              name={key}
              type={field.type}
              disabled={formDisabled}
              className="text-black p-2 my-1 w-full rounded"
              placeholder={field.label}
              value={formData[key]}
              onKeyDown={e => (e.key === "Enter" ? onClick() : null)}
              onChange={e =>
                setFormData(f => ({ ...f, [key]: e.target.value }))
              }
            />
          ))}
          <div
            className="bg-brand text-black p-2 my-1 w-full rounded font-bold hover:opacity-80 cursor-pointer overflow-hidden text-center"
            style={{
              opacity: submitDisabled ? 0.5 : null,
              cursor: submitDisabled ? "auto" : null,
            }}
            onClick={onClick}
          >
            Bestätigen
          </div>
          {errorMessage ? (
            <div className="border-danger text-danger border-solid border p-2 my-1 w-full rounded text-sm">
              {errorMessage}
            </div>
          ) : null}
        </div>
      </main>
    </Site>
  );
}
