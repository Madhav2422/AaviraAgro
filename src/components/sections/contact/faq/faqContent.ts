export const faqContent = {
  eyebrow: "Good to Know",
  heading: {
    start: "Questions we",
    accent: "hear often.",
  },
  text: "Can't find your answer here? Send us an enquiry and we will reply to you directly.",
};

export type Faq = {
  question: string;
  answer: string;
};

// Placeholder answers, to confirm with the client. Add, remove or reorder the questions here.
export const faqs: Faq[] = [
  {
    question: "What do you supply?",
    answer:
      "Wheat, rice, kabuli chana and tuver dal, cleaned, graded and packed to your requirement. Tell us the product and grade you are after and we will confirm availability.",
  },
  {
    question: "Is there a minimum order quantity?",
    answer:
      "It depends on the product and the season. Share the quantity you have in mind in the enquiry form and we will tell you what we can do.",
  },
  {
    question: "Can I see a sample before ordering?",
    answer:
      "Yes. Ask for a sample in your enquiry, and we will arrange one so you can check the quality for yourself before committing.",
  },
  {
    question: "I am a farmer. How do I start supplying to you?",
    answer:
      "Pick 'Become a Supplier' in the form, tell us what you grow and where, and our procurement team will get in touch.",
  },
  {
    question: "Do you take export orders?",
    answer:
      "Send us the destination, product and volume using 'Export Enquiry' in the form, and we will come back to you with the details.",
  },
];
