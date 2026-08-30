import React from "react";
import { AlertTriangle, Check, Minus, X } from "lucide-react";

const VERDICT_META = {
  pass: {
    label: "Pass",
    icon: Check,
    classes: "text-emerald-700 bg-emerald-50 border-emerald-300",
  },
  fail: {
    label: "Fail",
    icon: X,
    classes: "text-red-800 border-red-300 pattern-crosshatch",
  },
  missing: {
    label: "No data",
    icon: Minus,
    classes: "text-slate-500 bg-slate-100 border-slate-300",
  },
};

function formatTs(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? ts : d.toISOString().replace("T", " ").slice(0, 16) + "Z";
}

export function CriterionCard({ criterion, def }) {
  const meta = VERDICT_META[criterion.verdict] || VERDICT_META.missing;
  const Icon = meta.icon;
  const isMissing = criterion.verdict === "missing";
  const contradiction = criterion.contradiction;

  return (
    <div
      data-testid={`criteria-${criterion.id}`}
      className="grid grid-cols-[3rem_auto_1fr] items-start gap-4 p-3 border border-slate-200 rounded-md bg-white"
    >
      <span className="font-mono text-xs font-bold text-slate-400 pt-1.5">
        {criterion.id}
      </span>
      <span
        data-testid={`criteria-${criterion.id}-status`}
        title={meta.label}
        className={`w-8 h-8 rounded-sm flex items-center justify-center border ${meta.classes}`}
      >
        <Icon className="h-4 w-4" strokeWidth={2.5} />
        <span className="sr-only">{meta.label}</span>
      </span>
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium text-slate-900">{def?.name || criterion.id}</span>
          <span
            className="text-xs font-mono text-slate-500 shrink-0"
            data-testid={`criteria-${criterion.id}-confidence`}
          >
            {criterion.confidence != null
              ? `conf ${criterion.confidence.toFixed(2)}`
              : "conf —"}
          </span>
        </div>

        {isMissing ? (
          <p
            className="text-sm font-medium text-slate-500 bg-slate-100 border border-slate-300 rounded-sm px-2 py-1 mt-1"
            data-testid={`criteria-${criterion.id}-missing`}
          >
            Cannot resolve: data not available
          </p>
        ) : (
          <p className="text-sm text-slate-700 leading-snug">{criterion.reasoning}</p>
        )}

        {contradiction && (
          <div
            className="mt-2 border border-amber-300 bg-amber-50 rounded-sm p-2"
            data-testid={`criteria-${criterion.id}-contradiction`}
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-800">
              <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2} />
              {contradiction.label || "Conflicting records"}
            </div>
            <div className="mt-1.5 grid gap-1">
              {contradiction.records.map((r, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-baseline gap-x-2 font-mono text-xs text-amber-900"
                >
                  <span className="font-semibold">{r.label}</span>
                  <span className="text-amber-700">[{formatTs(r.ts)}]</span>
                  <span className="font-bold">{r.value}</span>
                  <span className="text-amber-700">— {r.source}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isMissing && criterion.source && (
          <div
            className="mt-1 p-2 bg-slate-50 border border-slate-100 rounded-sm font-mono text-xs text-slate-600 leading-relaxed"
            data-testid={`criteria-${criterion.id}-source`}
          >
            <div>{criterion.source}</div>
            <div className="text-slate-400 mt-0.5">recorded {formatTs(criterion.sourceTs)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CriteriaStrip({ criteria, defs }) {
  const defById = Object.fromEntries(defs.map((d) => [d.id, d]));
  const sorted = [...criteria].sort((a, b) => a.id.localeCompare(b.id));
  return (
    <div className="flex flex-col gap-2" data-testid="criteria-strip">
      {sorted.map((c) => (
        <CriterionCard key={c.id} criterion={c} def={defById[c.id]} />
      ))}
    </div>
  );
}
