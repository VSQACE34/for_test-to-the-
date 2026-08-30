import React from "react";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/state/AppContext";
import { Header } from "@/components/Header";
import { InjectionBanner } from "@/components/InjectionBanner";
import { VolunteerQueue } from "@/components/VolunteerQueue";
import { VolunteerDetail } from "@/components/VolunteerDetail";
import { EvaluationFooter } from "@/components/EvaluationFooter";

function App() {
  return (
    <AppProvider>
      <div className="h-screen flex flex-col overflow-hidden bg-white" data-testid="sethu-app">
        <Header />
        <InjectionBanner />
        <div className="flex-1 flex overflow-hidden">
          <VolunteerQueue />
          <VolunteerDetail />
        </div>
        <EvaluationFooter />
      </div>
      <Toaster position="bottom-right" />
    </AppProvider>
  );
}

export default App;
