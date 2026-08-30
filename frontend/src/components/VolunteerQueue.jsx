import React, { useRef } from "react";
import { Check, Minus, X } from "lucide-react";
import { useAppState, useAppDispatch } from "@/state/AppContext";

function statusBadge(decision) {
  if (decision === "accepted") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-sm px-1.5 py-0.5">
        <Check className="h-3 w-3" strokeWidth={2.5} /> Accepted
      </span>
    );
  }
  if (decision === "excluded") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-red-700 bg-red-50 border border-red-200 rounded-sm px-1.5 py-0.5">
        <X className="h-3 w-3" strokeWidth={2.5} /> Excluded
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 bg-slate-100 border border-slate-300 rounded-sm px-1.5 py-0.5">
      <Minus className="h-3 w-3" strokeWidth={2.5} /> Pending
    </span>
  );
}

export function VolunteerQueue() {
  const { volunteers, selectedId, decisions } = useAppState();
  const dispatch = useAppDispatch();
  const listRef = useRef(null);

  const move = (delta) => {
    if (volunteers.length === 0) return;
    const idx = volunteers.findIndex((v) => v.id === selectedId);
    const next = Math.min(volunteers.length - 1, Math.max(0, (idx === -1 ? 0 : idx) + delta));
    const id = volunteers[next].id;
    dispatch({ type: "SELECT", id });
    listRef.current?.querySelector(`[data-volunteer-id="${id}"]`)?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    }
  };

  return (
    <aside
      className="w-80 border-r border-slate-200 bg-slate-50 flex flex-col overflow-hidden shrink-0"
      aria-label="Volunteer queue"
    >
      <div className="px-3 py-2 border-b border-slate-200 flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Volunteer Queue
        </span>
        <span className="text-xs font-mono text-slate-400" data-testid="queue-count">
          {volunteers.length} records
        </span>
      </div>
      <div
        ref={listRef}
        role="listbox"
        aria-label="Volunteers"
        aria-activedescendant={selectedId ? `queue-item-${selectedId}` : undefined}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="flex-1 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        data-testid="volunteer-queue"
      >
        {volunteers.map((v) => {
          const active = v.id === selectedId;
          const decision = decisions[v.id];
          const cleared = v.criteria.filter((c) => c.verdict === "pass").length;
          return (
            <button
              key={v.id}
              id={`queue-item-${v.id}`}
              role="option"
              aria-selected={active}
              data-testid={`volunteer-item-${v.id}`}
              data-volunteer-id={v.id}
              onClick={() => dispatch({ type: "SELECT", id: v.id })}
              className={`w-full text-left p-3 border-b border-slate-200 cursor-pointer transition-colors duration-75 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                active
                  ? "bg-blue-50 border-l-4 border-l-blue-600"
                  : "hover:bg-slate-100 border-l-4 border-l-transparent"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-900 truncate">{v.name}</span>
                {statusBadge(decision)}
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500">{v.id}</span>
                <span className="font-mono text-xs text-slate-500">
                  {cleared}/{v.criteria.length} cleared
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
