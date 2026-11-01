import { fieldErrors, topics, type FieldName } from "./formContent";

export type EnquiryState = {
  status: "idle" | "invalid" | "sent";
  errors?: Partial<Record<FieldName, string>>;
  // What was typed, so the form can show it again next to the errors.
  values?: Partial<Record<FieldName, string>>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+\d\s()-]{7,20}$/;

// Runs in the browser, because the site is a static export with no server of its own.
export async function sendEnquiry(_previous: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const read = (key: FieldName) => String(formData.get(key) ?? "").trim().slice(0, 4000);

  const values: Record<FieldName, string> = {
    name: read("name"),
    company: read("company"),
    email: read("email"),
    phone: read("phone"),
    topic: read("topic"),
    message: read("message"),
  };

  const failed: FieldName[] = [];
  if (!values.name) failed.push("name");
  if (!EMAIL.test(values.email)) failed.push("email");
  if (values.phone && !PHONE.test(values.phone)) failed.push("phone");
  if (!topics.includes(values.topic)) failed.push("topic");
  if (values.message.length < 10) failed.push("message");

  if (failed.length > 0) {
    const errors = Object.fromEntries(failed.map((field) => [field, fieldErrors[field]]));
    return { status: "invalid", errors, values };
  }

  // TODO: deliver the enquiry once the client picks a form service, for example
  // await fetch("https://formspree.io/f/<form id>", { method: "POST", body: formData, headers: { Accept: "application/json" } })
  // Until then nothing is sent anywhere.
  await new Promise((resolve) => setTimeout(resolve, 900));

  return { status: "sent" };
}
