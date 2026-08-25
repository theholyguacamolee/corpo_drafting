import React from "react";

export default function Sidebar({ activeTab, setActiveTab, type = 'corporate' }) {
  const tabs = [
    { id: 'baseline', num: 1, label: 'Baseline Data' },
    { id: 'amend',    num: 2, label: 'Select Amendments' },
    { id: 'preview',  num: 3, label: 'Preview & Export' },
  ];

  return (
    <nav>
      <div className="nav-links">
        {tabs.map(t => (
          <button
            key={t.id}
            className={activeTab === t.id ? 'active' : ''}
            onClick={() => setActiveTab(t.id)}
          >
            <span className="nav-step-badge">{t.num}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      <div className="nav-footer">
        {type === 'corporate' ? (
          <>Revised Corporation Code<br />Philippines — Sec. 15 Compliant</>
        ) : (
          <>Civil Code of the Philippines<br />Title IX — Law on Partnership</>
        )}
      </div>
    </nav>
  );
}
