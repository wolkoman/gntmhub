import React, { useEffect, useState } from "react";
import { Site } from "./Site";

export type FormControlType = "text" | "password" | "number";
type FormSchema = Record<string, { type: FormControlType; label: string }>;

export function Form<F extends FormSchema>({
  form,
  onSubmit,
  formDisabled,
  submitDisabled,
  errorMessage,
  onFormValueChange,
  title,
}: {
  form: F;
  onSubmit: (data: Record<keyof FormSchema, any>) => void;
  formDisabled?: boolean;
  submitDisabled?: boolean;
  errorMessage?: string;
  onFormValueChange: () => any;
  title: string;
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
    <Site navigation={false}>
      <main className="flex justify-center items-center h-screen -mt-4">
        <div className="flex flex-col items-center w-52">
          <div className="text-xl font-serif flex w-full">
            <div className="flex-grow">
              <div className="h-1/2 border-b border-gray-500"></div>
            </div>
            <div className="px-2">gntmhub</div>
            <div className="flex-grow">
              <div className="h-1/2 border-b border-gray-500"></div>
            </div>
          </div>
          <div className="text-5xl mb-6 pb-2 font-sans font-bold uppercase border-b border-gray-500 w-full text-center">
            {title}
          </div>
          <div className=""></div>
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
            className="bg-brand text-black dark:text-white p-2 mt-6 w-full rounded font-bold hover:opacity-80 cursor-pointer overflow-hidden text-center"
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
