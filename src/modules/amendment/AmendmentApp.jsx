import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Step1Baseline from "./components/Step1Baseline";
import Step2Amendments from "./components/Step2Amendments";
import Step3Preview from "./components/Step3Preview";
import Step1BaselinePartnership from "./components/Step1BaselinePartnership";
import Step2AmendmentsPartnership from "./components/Step2AmendmentsPartnership";
import Step3PreviewPartnership from "./components/Step3PreviewPartnership";
import LandingPage from "./components/LandingPage";
import Header from "./components/Header";
import { useAppState } from "./hooks/useAppState";
import { usePartnershipState } from "./hooks/usePartnershipState";
import "./amendment-scoped.css";

/**
 * @param {{ initialView?: 'corporate' | 'partnership', onHome?: () => void }} props
 */
export default function App({ initialView, onHome } = {}) {
  const corporateState = useAppState();
  const partnershipState = usePartnershipState();
  const [generatedHTML, setGeneratedHTML] = useState('');
  const [currentView, setCurrentView] = useState(initialView || 'home'); // 'home' | 'corporate' | 'partnership'

  const handleSelectTool = (toolId) => {
    setCurrentView(toolId);
  };

  const s = currentView === 'corporate' ? corporateState : partnershipState;
  const docType = currentView === 'corporate' ? 'AOI' : 'AOP';

  const handleHome = () => {
    // Go back to the suite-wide landing page (search + categories) if available,
    // otherwise fall back to this module's own tool picker.
    if (onHome) {
      onHome();
      return;
    }
    if (currentView === 'corporate') corporateState.reset();
    if (currentView === 'partnership') partnershipState.reset();
    setCurrentView('home');
  };

  if (currentView === 'home') {
    return (
      <div className="amendment-scope">
        <LandingPage onSelectTool={handleSelectTool} />
      </div>
    );
  }

  return (
    <div className="amendment-scope" style={{ display:'flex', flexDirection: 'column', height:'100vh', overflow:'hidden', backgroundColor: 'var(--bg)' }}>
      <Header showHomeButton onHome={handleHome} type={docType} />

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
