const STEPS = [
  { n: 1, label: "Skicka handlingar" },
  { n: 2, label: "Vi tar fram offert" },
  { n: 3, label: "Granska offert" },
  { n: 4, label: "Signera" },
];

/** Visuell stepper för de fyra stegen i offert-/signeringsflödet. */
export default function OfferStepper({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <ol className="mx-auto flex max-w-3xl items-center justify-between gap-1">
      {STEPS.map((step, i) => {
        const done = step.n < current;
        const active = step.n === current;
        return (
          <li key={step.n} className="flex flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              <span
                className={`h-0.5 flex-1 ${i === 0 ? "opacity-0" : done || active ? "bg-brand" : "bg-border"}`}
                aria-hidden="true"
              />
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  active
                    ? "bg-brand text-white"
                    : done
                      ? "bg-brand-2 text-white"
                      : "bg-border text-muted"
                }`}
              >
                {done ? "✓" : step.n}
              </span>
              <span
                className={`h-0.5 flex-1 ${i === STEPS.length - 1 ? "opacity-0" : done ? "bg-brand" : "bg-border"}`}
                aria-hidden="true"
              />
            </div>
            <span
              className={`mt-2 text-xs sm:text-sm ${active ? "font-semibold text-brand-deep" : "text-muted"}`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
