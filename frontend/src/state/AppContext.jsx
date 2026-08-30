import React, { createContext, useContext, useEffect, useReducer } from "react";
import { fetchVolunteers } from "@/lib/sethuApi";

const AppStateContext = createContext(null);
const AppDispatchContext = createContext(null);

const initialState = {
  volunteers: [],
  source: null,
  selectedId: null,
  decisions: {},
  rescreen: { running: false, progress: 0, durationMs: 35000 },
  evalOpen: false,
};

function jitterConfidence(value) {
  if (value == null) return value;
  const next = value + (Math.random() - 0.5) * 0.1;
  return Math.min(0.99, Math.max(0.35, Number(next.toFixed(2))));
}

function reducer(state, action) {
  switch (action.type) {
    case "LOADED": {
      const sorted = sortQueue(action.volunteers, {});
      return {
        ...state,
        volunteers: action.volunteers,
        source: action.source,
        selectedId: sorted[0]?.id ?? null,
      };
    }
    case "SELECT":
      return { ...state, selectedId: action.id };
    case "DECIDE": {
      const decisions = { ...state.decisions, [action.id]: action.decision };
      return {
        ...state,
        decisions,
        volunteers: sortQueue(state.volunteers, decisions),
      };
    }
    case "RESCREEN_START":
      return { ...state, rescreen: { ...state.rescreen, running: true, progress: 0 } };
    case "RESCREEN_TICK":
      return { ...state, rescreen: { ...state.rescreen, progress: action.progress } };
    case "RESCREEN_COMPLETE": {
      const now = new Date().toISOString();
      const volunteers = state.volunteers.map((v) => ({
        ...v,
        screenedAt: now,
        criteria: v.criteria.map((c) => ({ ...c, confidence: jitterConfidence(c.confidence) })),
      }));
      return {
        ...state,
        volunteers,
        rescreen: { ...state.rescreen, running: false, progress: 1 },
      };
    }
    case "TOGGLE_EVAL":
      return { ...state, evalOpen: !state.evalOpen };
    default:
      return state;
  }
}

function sortQueue(volunteers, decisions) {
  const rank = (v) => {
    const d = decisions[v.id];
    return d ? 1 : 0;
  };
  return [...volunteers].sort((a, b) => rank(a) - rank(b) || a.id.localeCompare(b.id));
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelled = false;
    fetchVolunteers().then(({ volunteers, source }) => {
      if (!cancelled) dispatch({ type: "LOADED", volunteers, source });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext);
}

export function useAppDispatch() {
  return useContext(AppDispatchContext);
}
