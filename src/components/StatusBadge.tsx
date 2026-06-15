import { STATUS_LABELS } from "@/lib/constants";

const styles: Record<string, string> = {
  submitted: "bg-border text-muted",
  quoted: "bg-brand-soft text-brand-2",
  sent: "bg-amber-100 text-amber-800",
  viewed: "bg-sky-100 text-sky-800",
  signed: "bg-brand text-white",
  booked: "bg-accent text-brand-deep",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        styles[status] ?? "bg-border text-muted"
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
