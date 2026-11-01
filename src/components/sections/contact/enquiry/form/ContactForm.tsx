"use client";

import { useActionState, useState } from "react";
import FormField from "./FormField";
import { fields, formContent, messageField } from "./formContent";
import { sendEnquiry, type EnquiryState } from "./sendEnquiry";
import SentMessage from "./SentMessage";
import SubmitButton from "./SubmitButton";
import TopicPicker from "./TopicPicker";

const initialState: EnquiryState = { status: "idle" };

function EnquiryForm({ onAgain }: { onAgain: () => void }) {
  const [state, formAction, pending] = useActionState(sendEnquiry, initialState);

  if (state.status === "sent") return <SentMessage onAgain={onAgain} />;

  const { errors = {}, values = {} } = state;

  // sendEnquiry checks every field, so its errors show in the same style as the rest of the form.
  return (
    <form action={formAction} noValidate className="space-y-8">
      <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
        {fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            defaultValue={values[field.name]}
            error={errors[field.name]}
          />
        ))}
      </div>

      <TopicPicker defaultValue={values.topic} error={errors.topic} />

      <FormField field={messageField} multiline defaultValue={values.message} error={errors.message} />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <SubmitButton pending={pending} />
        <p aria-live="polite" className="text-[14px] text-[#a3361f]">
          {state.status === "invalid" ? formContent.invalid : ""}
        </p>
      </div>
    </form>
  );
}

export default function ContactForm() {
  // Changing the key starts a fresh, empty form after a message is sent.
  const [round, setRound] = useState(0);
  return <EnquiryForm key={round} onAgain={() => setRound((value) => value + 1)} />;
}
