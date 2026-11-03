type EmailTextProps = {
  text: string;
};

// Lets a long email address wrap after its @ on a narrow screen, instead of running off
// the side. Other text is shown as it is.
export default function EmailText({ text }: EmailTextProps) {
  const at = text.indexOf("@");
  if (at < 0) return text;

  return (
    <>
      {text.slice(0, at + 1)}
      <wbr />
      {text.slice(at + 1)}
    </>
  );
}
