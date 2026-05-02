"use server";

import { Resend } from "resend";
import { z } from "zod";

const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
]);

const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Podaj imie i nazwisko.")
    .max(120, "Imie i nazwisko jest zbyt dlugie."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Podaj poprawny adres email."),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s()-]{6,40}$/, "Podaj poprawny numer telefonu.")
    .optional(),
  subject: z.enum(
    [
      "Prawo karne",
      "Prawo cywilne",
      "Nieruchomosci",
      "Pomoc prawna online",
      "Inna sprawa",
    ],
    {
      error: "Wybierz temat sprawy.",
    },
  ),
  message: z
    .string()
    .trim()
    .min(50, "Opis sprawy powinien miec co najmniej 50 znakow.")
    .max(4000, "Opis sprawy jest zbyt dlugi."),
  consent: z.literal("on", {
    error: "Zgoda na kontakt jest wymagana.",
  }),
  website: z.string().max(0).optional(),
});

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof ContactFormValues, string[]>>;
  values?: Partial<ContactFormValues>;
}

export interface ContactFormValues {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  consent: string;
  attachments: string;
  website?: string;
}

export async function sendOnlineLegalAidMessage(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const rawValues = getRawValues(formData);
  const parsedForm = contactFormSchema.safeParse({
    name: rawValues.name,
    email: rawValues.email,
    phone: rawValues.phone || undefined,
    subject: rawValues.subject,
    message: rawValues.message,
    consent: rawValues.consent,
    website: rawValues.website || undefined,
  });

  const attachmentValidation = validateAttachments(formData.getAll("attachments"));

  if (!parsedForm.success || !attachmentValidation.success) {
    return {
      status: "error",
      message: "Sprawdz pola formularza i sprobuj ponownie.",
      values: rawValues,
      fieldErrors: {
        ...(!parsedForm.success ? parsedForm.error.flatten().fieldErrors : {}),
        ...(!attachmentValidation.success
          ? { attachments: [attachmentValidation.error] }
          : {}),
      },
    };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const contactEmailTo = process.env.CONTACT_EMAIL_TO;
  const contactEmailFrom = process.env.CONTACT_EMAIL_FROM;

  if (!resendApiKey || !contactEmailTo || !contactEmailFrom) {
    return {
      status: "error",
      message:
        "Formularz nie jest jeszcze skonfigurowany. Uzupelnij zmienne RESEND_API_KEY, CONTACT_EMAIL_TO i CONTACT_EMAIL_FROM.",
      values: rawValues,
    };
  }

  const resend = new Resend(resendApiKey);
  const data = parsedForm.data;
  const attachments = await Promise.all(
    attachmentValidation.files.map(async (file) => ({
      content: Buffer.from(await file.arrayBuffer()).toString("base64"),
      filename: sanitizeFilename(file.name),
    })),
  );

  const { error } = await resend.emails.send({
    from: contactEmailFrom,
    to: [contactEmailTo],
    replyTo: data.email,
    subject: `Pomoc prawna online: ${data.subject}`,
    text: buildPlainTextEmail(data),
    attachments,
  });

  if (error) {
    return {
      status: "error",
      message:
        "Nie udalo sie wyslac wiadomosci. Sprobuj ponownie albo skontaktuj sie telefonicznie.",
      values: rawValues,
    };
  }

  return {
    status: "success",
    message: "Wiadomosc zostala wyslana. Kancelaria skontaktuje sie z Toba.",
  };
}

type AttachmentValidationResult =
  | { success: true; files: File[] }
  | { success: false; error: string };

function getRawValues(formData: FormData): ContactFormValues {
  return {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    subject: String(formData.get("subject") || ""),
    message: String(formData.get("message") || ""),
    consent: String(formData.get("consent") || ""),
    attachments: "",
    website: String(formData.get("website") || ""),
  };
}

function validateAttachments(files: FormDataEntryValue[]): AttachmentValidationResult {
  const uploadedFiles = files.filter(
    (file): file is File => file instanceof File && file.size > 0,
  );

  if (uploadedFiles.length > MAX_FILES) {
    return {
      success: false,
      error: `Mozesz dodac maksymalnie ${MAX_FILES} pliki.`,
    };
  }

  const tooLargeFile = uploadedFiles.find((file) => file.size > MAX_FILE_SIZE);

  if (tooLargeFile) {
    return {
      success: false,
      error: `Plik ${tooLargeFile.name} przekracza limit 5 MB.`,
    };
  }

  const unsupportedFile = uploadedFiles.find(
    (file) => !ALLOWED_FILE_TYPES.has(file.type),
  );

  if (unsupportedFile) {
    return {
      success: false,
      error: `Plik ${unsupportedFile.name} ma niedozwolony format.`,
    };
  }

  return {
    success: true,
    files: uploadedFiles,
  };
}

function sanitizeFilename(filename: string) {
  return filename
    .normalize("NFKD")
    .replace(/[^\w.\- ]/g, "_")
    .replace(/\s+/g, "_");
}

function buildPlainTextEmail(data: z.infer<typeof contactFormSchema>) {
  return [
    "Nowa wiadomosc z formularza: Pomoc prawna online",
    "",
    `Imie i nazwisko: ${data.name}`,
    `Email: ${data.email}`,
    `Telefon: ${data.phone || "Nie podano"}`,
    `Temat: ${data.subject}`,
    "",
    "Opis sprawy:",
    data.message,
  ].join("\n");
}
