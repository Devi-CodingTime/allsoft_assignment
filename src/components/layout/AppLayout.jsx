import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const TITLES = {
  '/upload': ['Upload a document', 'Date, category, tags and remarks — filed in one pass.'],
  '/search': ['Search & retrieve', 'Filter by category, tag or date to find any filed document.'],
  '/admin/users': ['User administration', 'Create a login for a new team member.'],
};

export default function AppLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();
  const [title, subtitle] = TITLES[pathname] || ['Document Management', ''];

  return (
    <div className="app-shell">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="app-main">
        <div className="mobile-topbar">
          <button onClick={() => setNavOpen(true)} aria-label="Open menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
          <strong style={{ fontFamily: 'var(--font-display)' }}>Document Management</strong>
          <span style={{ width: 22 }} />
        </div>
        <header className="topbar">
          <div>
            <div className="topbar-title">{title}</div>
            {subtitle && <p className="topbar-sub">{subtitle}</p>}
          </div>
        </header>
        <main className="app-content"><Outlet /></main>
      </div>
    </div>
  );
}