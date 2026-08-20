"use client";

import { useState } from "react";
import Image from "next/image";
import type { AdminFieldDef } from "@/types/adminContent";

interface GenericEntryFormProps {
  fields: AdminFieldDef[];
  action: (formData: FormData) => void;
  submitLabel: string;
  initial?: Record<string, unknown>;
}

function fieldDefaultValue(field: AdminFieldDef, initial?: Record<string, unknown>): string {
  const value = initial?.[field.key];
  if (field.type === "list" && Array.isArray(value)) return value.join("\n");
  return typeof value === "string" ? value : "";
}

export function GenericEntryForm({ fields, action, submitLabel, initial }: GenericEntryFormProps) {
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={async (formData) => {
        setError(null);
        try {
          await action(formData);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
        }
      }}
      className="flex flex-col gap-5"
    >
      {error && (
        <div className="rounded-xl border border-b2/40 bg-[color-mix(in_srgb,var(--b2)_8%,transparent)] px-4 py-3 text-sm text-b2">
          {error}
        </div>
      )}

      {fields.map((field) => {
        const defaultValue = fieldDefaultValue(field, initial);
        const inputId = `field-${field.key}`;

        return (
          <div key={field.key}>
            <label htmlFor={inputId} className="block text-sm font-medium mb-1.5">
              {field.label}
              {field.help && <span className="text-ink-faint font-normal"> — {field.help}</span>}
            </label>

            {field.type === "textarea" && (
              <textarea
                id={inputId}
                name={field.key}
                required={field.required}
                rows={3}
                defaultValue={defaultValue}
                placeholder={field.placeholder}
                className="w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
            )}

            {field.type === "list" && (
              <textarea
                id={inputId}
                name={field.key}
                required={field.required}
                rows={5}
                defaultValue={defaultValue}
                placeholder={field.placeholder}
                className="w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent font-mono"
              />
            )}

            {field.type === "select" && (
              <select
                id={inputId}
                name={field.key}
                required={field.required}
                defaultValue={defaultValue || field.options?.[0]?.value}
                className="w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === "emoji" && (
              <input
                id={inputId}
                name={field.key}
                defaultValue={defaultValue}
                placeholder={field.placeholder}
                className="w-full max-w-[120px] rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-lg outline-none focus:border-accent"
              />
            )}

            {field.type === "image" && (
              <div>
                {defaultValue && (
                  <div className="mb-3">
                    <Image
                      src={defaultValue}
                      alt=""
                      width={240}
                      height={160}
                      unoptimized
                      className="h-40 w-auto max-w-full rounded-xl border border-border object-cover"
                    />
                    <p className="mt-1 text-xs text-ink-faint">Current image — upload a new one to replace it.</p>
                  </div>
                )}
                <input
                  id={inputId}
                  name={field.key}
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-accent-soft file:px-4 file:py-2 file:text-sm file:font-medium file:text-accent-strong"
                />
                {/* Carries the current URL forward if no new file is chosen. */}
                <input type="hidden" name={`${field.key}__existing`} defaultValue={defaultValue} />
              </div>
            )}

            {field.type === "text" && (
              <input
                id={inputId}
                name={field.key}
                required={field.required}
                defaultValue={defaultValue}
                placeholder={field.placeholder}
                className="w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
            )}
          </div>
        );
      })}

      <button
        type="submit"
        className="self-start rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-contrast hover:bg-accent-strong"
      >
        {submitLabel}
      </button>
    </form>
  );
}
