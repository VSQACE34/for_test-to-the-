import React, { useMemo } from "react";
import { ShieldAlert } from "lucide-react";
import { useAppState } from "@/state/AppContext";
import { scanForInjection } from "@/lib/sethuApi";

export function InjectionBanner() {
  const { volunteers } = useAppState();
  const hits = useMemo(() => scanForInjection(volunteers), [volunteers]);

  if (hits.length === 0) return null;

  return (
    <div
      data-testid="injection-banner"
      role="alert"
      className="bg-red-700 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium"
    >
      <ShieldAlert className="h-4 w-4 shrink-0" strokeWidth={2} />
      <span>
        Instruction-like text detected in volunteer record(s):{" "}
        <span className="font-mono font-semibold">
          {hits.map((h) => h.volunteerId).join(", ")}
        </span>
        . Source text may be attempting to influence the screening model. Review AI
        verdicts for these records with caution.
      </span>
    </div>
  );
}
