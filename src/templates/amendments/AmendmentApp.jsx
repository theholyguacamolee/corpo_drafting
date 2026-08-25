import React, { useState } from "react";
import Sidebar from "@/components/amendments/Sidebar";
import Step1Baseline from "@/components/amendments/Step1Baseline";
import Step2Amendments from "@/components/amendments/Step2Amendments";
import Step3Preview from "@/components/amendments/Step3Preview";
import Step1BaselinePartnership from "@/components/amendments/Step1BaselinePartnership";
import Step2AmendmentsPartnership from "@/components/amendments/Step2AmendmentsPartnership";
import Step3PreviewPartnership from "@/components/amendments/Step3PreviewPartnership";
import { GlobalHeader } from "@/components/GlobalHeader";
import { useAppState } from "./hooks/useAppState";
import { usePartnershipState } from "./hooks/usePartnershipState";
import "./amendment-scoped.css";

/**
 * @param {{ initialView?: 'corporate' | 'partnership', onHome?: () => void }} props
 */
export default function App({ initialView = 'corporate', onHome } = {}) {
  const corporateState = useAppState();
  const partnershipState = usePartnershipState();
  const [generatedHTML, setGeneratedHTML] = useState('');
  const currentView = initialView; // Driven entirely by the route from HomeLanding

  const s = currentView === 'corporate' ? corporateState : partnershipState;
  const docType = currentView === 'corporate' ? 'Corporate AOI' : 'Partnership AOP';

  return (
    <div className="amendment-scope" style={{ display:'flex', flexDirection: 'column', height:'100vh', overflow:'hidden', backgroundColor: 'var(--bg)' }}>
      <GlobalHeader
        title={docType}
        subtitle="Articles of Amendment Drafting"
        onHome={onHome}
      />

      {/* Extract overlay */}
      {s.overlayVisible && (
        <div id="extract-overlay" className="show">
          <div className="extract-spinner" />
          <div className="extract-msg">🤖 AI Extracting Document...</div>
          <div className="extract-sub">Reading your {docType} with Legal AI Engine. This may take 15–30 seconds.</div>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar activeTab={s.activeTab} setActiveTab={s.setActiveTab} type={currentView} />

        <div className="main-view" style={{ flex: 1 }}>
          {currentView === 'corporate' ? (
            <>
              {s.activeTab === 'baseline' && (
                <div className="page-content active" style={{maxWidth:1100,margin:'0 auto'}}>
                  <Step1Baseline s={s} setActiveTab={s.setActiveTab} />
                </div>
              )}
              {s.activeTab === 'amend' && (
                <div className="page-content active" style={{maxWidth:1100,margin:'0 auto'}}>
                  <Step2Amendments s={s} setActiveTab={s.setActiveTab} setGeneratedHTML={setGeneratedHTML} />
                </div>
              )}
              {s.activeTab === 'preview' && (
                <div className="page-content active" style={{maxWidth:1100,margin:'0 auto'}}>
                  <Step3Preview generatedHTML={generatedHTML} />
                </div>
              )}
            </>
          ) : (
            <>
              {s.activeTab === 'baseline' && (
                <div className="page-content active" style={{maxWidth:1100,margin:'0 auto'}}>
                  <Step1BaselinePartnership s={s} setActiveTab={s.setActiveTab} />
                </div>
              )}
              {s.activeTab === 'amend' && (
                <div className="page-content active" style={{maxWidth:1100,margin:'0 auto'}}>
                  <Step2AmendmentsPartnership s={s} setActiveTab={s.setActiveTab} setGeneratedHTML={setGeneratedHTML} />
                </div>
              )}
              {s.activeTab === 'preview' && (
                <div className="page-content active" style={{maxWidth:1100,margin:'0 auto'}}>
                  <Step3PreviewPartnership generatedHTML={generatedHTML} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
