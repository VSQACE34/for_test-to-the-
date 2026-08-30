import React from "react";
import { ChevronDown, ChevronUp, FlaskConical } from "lucide-react";
import { useAppState, useAppDispatch } from "@/state/AppContext";
import { EVALUATION_RUN } from "@/data/evaluation";

export function EvaluationFooter() {
  const { evalOpen } = useAppState();
  const dispatch = useAppDispatch();
  const e = EVALUATION_RUN;

  return (
    <footer
      className="border-t border-slate-700 bg-slate-900 text-slate-300 shrink-0"
      data-testid="evaluation-footer"
    >
      <button
        data-testid="evaluation-toggle"
        onClick={() => dispatch({ type: "TOGGLE_EVAL" })}
        aria-expanded={evalOpen}
        className="w-full flex items-center gap-2 px-4 py-1.5 text-left font-mono text-xs hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      >
        <FlaskConical className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
        <span className="uppercase tracking-wider text-slate-400 font-semibold">
          Evaluation Run
        </span>
        <span className="text-slate-500">· technical metrics only · not part of clinical review</span>
        <span className="ml-auto text-slate-400">
          {evalOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </span>
      </button>
      {evalOpen && (
        <div
          className="px-4 pb-3 pt-1 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 font-mono text-xs"
          data-testid="evaluation-panel"
        >
          <div>
            <span className="text-slate-500">run</span>{" "}
            <span data-testid="eval-run-id">{e.runId}</span>
          </div>
          <div>
            <span className="text-slate-500">model</span> {e.model}
          </div>
          <div>
            <span className="text-slate-500">dataset</span> {e.dataset}
          </div>
          <div>
            <span className="text-slate-500">window</span> {e.startedAt.slice(11, 19)}–
            {e.finishedAt.slice(11, 19)}Z
          </div>
          <div>
            <span className="text-slate-500">latency p50</span>{" "}
            <span data-testid="eval-latency-p50">{e.latencyMsP50} ms</span>
          </div>
          <div>
            <span className="text-slate-500">latency p95</span> {e.latencyMsP95} ms
          </div>
          <div>
            <span className="text-slate-500">agent accuracy</span>{" "}
            <span data-testid="eval-agent-accuracy">{(e.agentAccuracy * 100).toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-slate-500">baseline accuracy</span>{" "}
            <span data-testid="eval-baseline-accuracy">{(e.baselineAccuracy * 100).toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-slate-500">agreement rate</span> {(e.agreementRate * 100).toFixed(1)}%
          </div>
          <div className="col-span-2 md:col-span-3 text-slate-500">{e.note}</div>
        </div>
      )}
    </footer>
  );
}
