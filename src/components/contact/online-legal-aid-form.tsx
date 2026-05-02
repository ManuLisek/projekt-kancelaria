"use client";

import { Send, X } from "lucide-react";
import type {
  ChangeEvent,
  FormEvent,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { useRef, useState, useTransition } from "react";

import {
  type ContactFormState,
  type ContactFormValues,
  sendOnlineLegalAidMessage,
} from "@/app/(site)/pomoc-prawna-online/actions";

const initialState: ContactFormState = {
  status: "idle",
};

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  consent: "",
  attachments: "",
  website: "",
};

const MAX_FILES = 3;

export function OnlineLegalAidForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [state, setState] = useState<ContactFormState>(initialState);
  const [isPending, startTransition] = useTransition();

  const updateValue = (name: keyof ContactFormValues, value: string) => {
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    setAttachments((current) => {
      const nextFiles = [...current];

      for (const file of selectedFiles) {
        if (nextFiles.length >= MAX_FILES) {
          break;
        }

        const alreadyAdded = nextFiles.some(
          (existingFile) =>
            existingFile.name === file.name &&
            existingFile.size === file.size &&
            existingFile.lastModified === file.lastModified,
        );

        if (!alreadyAdded) {
          nextFiles.push(file);
        }
      }

      return nextFiles;
    });

    event.target.value = "";
  };

  const removeAttachment = (fileToRemove: File) => {
    setAttachments((current) =>
      current.filter(
        (file) =>
          !(
            file.name === fileToRemove.name &&
            file.size === fileToRemove.size &&
            file.lastModified === fileToRemove.lastModified
          ),
      ),
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("phone", values.phone || "");
    formData.set("subject", values.subject);
    formData.set("message", values.message);
    formData.set("consent", values.consent);
    formData.set("website", values.website || "");

    for (const file of attachments) {
      formData.append("attachments", file);
    }

    startTransition(async () => {
      const nextState = await sendOnlineLegalAidMessage(state, formData);
      setState(nextState);

      if (nextState.status === "success") {
        setValues(initialValues);
        setAttachments([]);
        formRef.current?.reset();
        return;
      }

      if (nextState.values) {
        setValues((current) => ({
          ...current,
          ...nextState.values,
        }));
      }
    });
  };

  return (
    <form className="grid gap-5" onSubmit={handleSubmit} ref={formRef}>
      <div aria-hidden className="hidden">
        <label htmlFor="website">Strona internetowa</label>
        <input
          autoComplete="off"
          id="website"
          name="website"
          onChange={(event) => updateValue("website", event.target.value)}
          tabIndex={-1}
          type="text"
          value={values.website}
        />
      </div>

      <Field
        autoComplete="name"
        error={state.fieldErrors?.name?.[0]}
        label="Imie i nazwisko"
        name="name"
        onChange={(event) => updateValue("name", event.target.value)}
        required
        value={values.name}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          autoComplete="email"
          error={state.fieldErrors?.email?.[0]}
          label="Email"
          name="email"
          onChange={(event) => updateValue("email", event.target.value)}
          required
          type="email"
          value={values.email}
        />
        <Field
          autoComplete="tel"
          error={state.fieldErrors?.phone?.[0]}
          label="Telefon"
          name="phone"
          onChange={(event) => updateValue("phone", event.target.value)}
          type="tel"
          value={values.phone}
        />
      </div>

      <SelectField
        error={state.fieldErrors?.subject?.[0]}
        label="Temat sprawy"
        name="subject"
        onChange={(event) => updateValue("subject", event.target.value)}
        required
        value={values.subject}
      >
        <option value="">Wybierz temat</option>
        <option value="Prawo karne">Prawo karne</option>
        <option value="Prawo cywilne">Prawo cywilne</option>
        <option value="Nieruchomosci">Nieruchomosci</option>
        <option value="Pomoc prawna online">Pomoc prawna online</option>
        <option value="Inna sprawa">Inna sprawa</option>
      </SelectField>

      <TextArea
        error={state.fieldErrors?.message?.[0]}
        label="Opis sprawy"
        name="message"
        onChange={(event) => updateValue("message", event.target.value)}
        required
        value={values.message}
      />

      <FileField
        attachments={attachments}
        error={state.fieldErrors?.attachments?.[0]}
        fileInputRef={fileInputRef}
        onChange={handleFilesChange}
        onRemove={removeAttachment}
      />

      <div>
        <label className="flex gap-3 text-sm leading-6 text-zinc-700">
          <input
            checked={values.consent === "on"}
            className="mt-1 size-4 shrink-0 accent-amber-700"
            name="consent"
            onChange={(event) =>
              updateValue("consent", event.target.checked ? "on" : "")
            }
            required
            type="checkbox"
          />
          <span>
            Wyrazam zgode na kontakt w celu odpowiedzi na przeslana wiadomosc.
          </span>
        </label>
        {state.fieldErrors?.consent?.[0] ? (
          <p className="mt-2 text-sm text-red-700">
            {state.fieldErrors.consent[0]}
          </p>
        ) : null}
      </div>

      {state.message ? (
        <p
          className={
            state.status === "success"
              ? "border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
              : "border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          }
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton isPending={isPending} />
    </form>
  );
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label: string;
  name: string;
}

function Field({ error, label, name, ...props }: FieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-950" htmlFor={name}>
        {label}
      </label>
      <input
        className="mt-2 h-12 w-full border border-zinc-300 bg-white px-4 text-base text-zinc-950 outline-none transition focus:border-amber-700"
        id={name}
        name={name}
        {...props}
      />
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label: string;
  name: string;
}

function SelectField({
  children,
  error,
  label,
  name,
  ...props
}: SelectFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-950" htmlFor={name}>
        {label}
      </label>
      <select
        className="mt-2 h-12 w-full border border-zinc-300 bg-white px-4 text-base text-zinc-950 outline-none transition focus:border-amber-700"
        id={name}
        name={name}
        {...props}
      >
        {children}
      </select>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label: string;
  name: string;
}

function TextArea({ error, label, name, ...props }: TextAreaProps) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-950" htmlFor={name}>
        {label}
      </label>
      <textarea
        className="mt-2 min-h-40 w-full resize-y border border-zinc-300 bg-white px-4 py-3 text-base leading-7 text-zinc-950 outline-none transition focus:border-amber-700"
        id={name}
        name={name}
        {...props}
      />
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

interface FileFieldProps {
  attachments: File[];
  error?: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: (file: File) => void;
}

function FileField({
  attachments,
  error,
  fileInputRef,
  onChange,
  onRemove,
}: FileFieldProps) {
  const isLimitReached = attachments.length >= MAX_FILES;

  return (
    <div>
      <label className="text-sm font-medium text-zinc-950" htmlFor="attachments">
        Zalaczniki
      </label>
      <input
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="mt-2 w-full border border-dashed border-zinc-300 bg-white px-4 py-4 text-sm text-zinc-700 file:mr-4 file:border-0 file:bg-zinc-950 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white disabled:opacity-60"
        disabled={isLimitReached}
        id="attachments"
        multiple
        onChange={onChange}
        ref={fileInputRef}
        type="file"
      />
      <p className="mt-2 text-xs leading-5 text-zinc-500">
        Maksymalnie 3 pliki, do 5 MB kazdy. Dozwolone formaty: PDF, JPG, PNG,
        DOC, DOCX.
      </p>

      {attachments.length > 0 ? (
        <ul className="mt-4 grid gap-2">
          {attachments.map((file) => (
            <li
              className="flex items-center justify-between gap-3 border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm"
              key={`${file.name}-${file.size}-${file.lastModified}`}
            >
              <span className="min-w-0 truncate text-zinc-700">
                {file.name} ({formatFileSize(file.size)})
              </span>
              <button
                aria-label={`Usun plik ${file.name}`}
                className="inline-flex size-8 shrink-0 items-center justify-center text-zinc-500 transition hover:text-red-700"
                onClick={() => onRemove(file)}
                type="button"
              >
                <X aria-hidden size={16} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {isLimitReached ? (
        <p className="mt-2 text-xs text-zinc-500">
          Osiagnieto maksymalna liczbe zalacznikow.
        </p>
      ) : null}
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

interface SubmitButtonProps {
  isPending: boolean;
}

function SubmitButton({ isPending }: SubmitButtonProps) {
  return (
    <button
      className="inline-flex h-12 items-center justify-center gap-2 bg-zinc-950 px-6 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isPending}
      type="submit"
    >
      <Send aria-hidden size={18} />
      {isPending ? "Wysylanie..." : "Wyslij wiadomosc"}
    </button>
  );
}

function formatFileSize(size: number) {
  const megabytes = size / 1024 / 1024;

  return `${megabytes.toFixed(2)} MB`;
}
