import React, { useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAppState, useAppDispatch } from "@/state/AppContext";
import { postRescreen } from "@/lib/sethuApi";

const TICK_MS = 250;

export function Header() {
  const { rescreen, source } = useAppState();
  const dispatch = useAppDispatch();
  const startRef = useRef(0);

  useEffect(() => {
    if (!rescreen.running) return undefined;
    startRef.current = Date.now();
    postRescreen();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const progress = Math.min(1, elapsed / rescreen.durationMs);
      dispatch({ type: "RESCREEN_TICK", progress });
      if (progress >= 1) {
        clearInterval(interval);
        dispatch({ type: "RESCREEN_COMPLETE" });
        toast.success("Re-screen complete. Criteria refreshed with new AI output.");
      }
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [rescreen.running, rescreen.durationMs, dispatch]);

  const pct = Math.round(rescreen.progress * 100);

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-2 flex items-center gap-4 shrink-0">
      <div className="flex items-baseline gap-3">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900" data-testid="app-title">
          Sethu
        </h1>
        <span className="text-xs text-slate-500 hidden sm:inline">
          Clinical Trial Eligibility Review — Sethu recommends; you decide.
        </span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        {source && (
          <span
            data-testid="data-source-indicator"
            className="text-[11px] font-mono text-slate-400 hidden md:inline"
            title="Active data source"
          >
            src: {source}
          </span>
        )}
        <button
          data-testid="rescreen-btn"
          onClick={() => dispatch({ type: "RESCREEN_START" })}
          disabled={rescreen.running}
          className="relative overflow-hidden inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-wait"
          aria-live="polite"
        >
          {rescreen.running && (
            <span
              data-testid="rescreen-progress-fill"
              className="absolute inset-y-0 left-0 bg-blue-800"
              style={{ width: `${pct}%`, transition: `width ${TICK_MS}ms linear` }}
              aria-hidden="true"
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${rescreen.running ? "animate-spin" : ""}`} strokeWidth={2} />
            {rescreen.running ? `Re-screening… ${pct}%` : "Re-screen"}
          </span>
        </button>
      </div>
      {rescreen.running && (
        <div
          data-testid="rescreen-progress-bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-100"
        >
          <div
            className="h-full bg-blue-600"
            style={{ width: `${pct}%`, transition: `width ${TICK_MS}ms linear` }}
          />
        </div>
      )}
    </header>
  );
}
