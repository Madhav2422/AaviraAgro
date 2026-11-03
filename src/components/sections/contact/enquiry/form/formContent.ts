export const formContent = {
  eyebrow: "Send an Enquiry",
  heading: {
    start: "Tell us what",
    accent: "you need.",
  },
  text: "A few details are all it takes. The more you share about quantity and timing, the faster we can help.",
  topicLabel: "What is it about?",
  submit: "Send Enquiry",
  sending: "Sending",
  invalid: "A few details need another look.",
  sent: {
    heading: "Message sent.",
    text: "Thank you for reaching out. We will get back to you shortly.",
    again: "Send another message",
  },
};

export type FieldName = "name" | "company" | "email" | "phone" | "topic" | "message";

export type Field = {
  name: FieldName;
  label: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  optional?: boolean;
};

// The short fields, shown two to a row on wider screens.
export const fields: Field[] = [
  { name: "name", label: "Your name", autoComplete: "name" },
  { name: "company", label: "Company", autoComplete: "organization", optional: true },
  { name: "email", label: "Email address", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel", optional: true },
];

export const messageField: Field = { name: "message", label: "Your message" };

// Add, remove or reorder the choices here.
export const topics = ["Bulk Order", "Export Enquiry", "Become a Supplier", "Something Else"];

// Shown under a field when the server turns it away.
export const fieldErrors: Partial<Record<FieldName, string>> = {
  name: "Please tell us your name.",
  email: "Please enter a valid email address.",
  phone: "Please enter a valid phone number, or leave it empty.",
  topic: "Pick what your message is about.",
  message: "Please write a few words about what you need.",
};
