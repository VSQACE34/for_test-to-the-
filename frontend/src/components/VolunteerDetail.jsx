import React from "react";
import { Check, X } from "lucide-react";
import { useAppState, useAppDispatch } from "@/state/AppContext";
import { CriteriaStrip } from "@/components/CriteriaStrip";
import { CRITERIA_DEFS } from "@/data/volunteers";

function formatDate(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? ts : d.toISOString().slice(0, 10);
}

export function VolunteerDetail() {
  const { volunteers, selectedId, decisions } = useAppState();
  const dispatch = useAppDispatch();
  const volunteer = volunteers.find((v) => v.id === selectedId);

  if (!volunteer) {
    return (
      <main className="flex-1 flex items-center justify-center bg-white" data-testid="detail-empty">
        <p className="text-sm text-slate-400">Select a volunteer from the queue to review.</p>
      </main>
    );
  }

  const total = volunteer.criteria.length;
  const cleared = volunteer.criteria.filter((c) => c.verdict === "pass").length;
  const pct = total > 0 ? Math.round((cleared / total) * 100) : 0;
  const decision = decisions[volunteer.id];

  return (
    <main className="flex-1 overflow-y-auto bg-white p-4" data-testid="volunteer-detail">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h2 className="text-lg font-medium text-slate-900" data-testid="detail-name">
          {volunteer.name}
        </h2>
        <span className="font-mono text-sm text-slate-500" data-testid="detail-id">
          {volunteer.id}
        </span>
        <span className="font-mono text-xs text-slate-500">
          age {volunteer.age} · {volunteer.sex} · enrolled {formatDate(volunteer.enrolledAt)}
        </span>
        <span className="font-mono text-xs text-slate-400 ml-auto" data-testid="detail-screened-at">
          screened {formatDate(volunteer.screenedAt)}
        </span>
      </div>

      <p className="mt-1 text-sm text-slate-600 max-w-3xl" data-testid="detail-record-text">
        {volunteer.recordText}
      </p>

      <div
        className="flex items-baseline gap-3 mt-4 pb-3 border-b border-slate-200"
        aria-live="polite"
      >
        <span
          className="text-2xl font-bold font-mono text-slate-900"
          data-testid="scoring-cleared-count"
        >
          {cleared} of {total} cleared
        </span>
        <span className="text-sm font-mono text-slate-400" data-testid="scoring-percentage">
          {pct}%
        </span>
      </div>

      <div className="mt-3">
        <CriteriaStrip criteria={volunteer.criteria} defs={CRITERIA_DEFS} />
      </div>

      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200">
        <button
          data-testid="accept-btn"
          onClick={() => dispatch({ type: "DECIDE", id: volunteer.id, decision: "accepted" })}
          className={`inline-flex items-center gap-2 font-medium px-4 py-2 rounded-sm shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            decision === "accepted"
              ? "bg-emerald-700 text-white ring-2 ring-emerald-500"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          <Check className="h-4 w-4" strokeWidth={2.5} />
          {decision === "accepted" ? "Accepted" : "Accept"}
        </button>
        <button
          data-testid="exclude-btn"
          onClick={() => dispatch({ type: "DECIDE", id: volunteer.id, decision: "excluded" })}
          className={`inline-flex items-center gap-2 font-medium px-4 py-2 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
            decision === "excluded"
              ? "bg-red-600 text-white ring-2 ring-red-400"
              : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <X className="h-4 w-4" strokeWidth={2.5} />
          {decision === "excluded" ? "Excluded" : "Exclude"}
        </button>
        {decision && (
          <span className="text-xs font-mono text-slate-500" data-testid="decision-note">
            Decision recorded in-memory (resets on refresh)
          </span>
        )}
      </div>
    </main>
  );
}
