import Button from "./Button";

type CTASectionProps = {
  title?: string;
  text?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

/**
 * Avslutande CTA-band (mörkgrön bakgrund) – återanvänds längst ner på de
 * flesta sidor och bloggartiklar för en tydlig konvertering.
 */
export default function CTASection({
  title = "Vill du ha en kostnadsfri energianalys av din fastighet?",
  text = "Berätta om din fastighet så återkommer vi med en plan för lägre driftkostnad, bättre inomhusklimat och ett högre fastighetsvärde – med ROT-avdraget inräknat.",
  primaryLabel = "Få kostnadsfri offert",
  primaryHref = "/kontakt/",
  secondaryLabel = "Se våra tjänster",
  secondaryHref = "/tjanster/",
}: CTASectionProps) {
  return (
    <section className="bg-brand-deep">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
        <p className="max-w-2xl text-white/85">{text}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href={primaryHref} variant="accent">
            {primaryLabel}
          </Button>
          {secondaryHref && (
            <Button href={secondaryHref} variant="secondary">
              {secondaryLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
