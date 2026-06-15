"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { inputClass } from "@/components/form/Fields";

export default function BookingActions({ quoteId, booked }: { quoteId: string; booked: boolean }) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function markBooked() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/quotes/${quoteId}/book/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ notes: notes || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Kunde inte uppdatera.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kunde inte uppdatera.");
    } finally {
      setLoading(false);
    }
  }

  if (booked) {
    return <p className="text-sm font-medium text-brand-deep">✓ Markerad som bokningsbar/bokad.</p>;
  }

  return (
    <div>
      <input
        className={inputClass}
        placeholder="Notering om bokning (valfritt)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button
        type="button"
        onClick={markBooked}
        disabled={loading}
        className="mt-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-60"
      >
        {loading ? "Sparar…" : "Markera som bokad"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
