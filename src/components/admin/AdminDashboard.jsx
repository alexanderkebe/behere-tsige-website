'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { adminRegistry } from './registry';

/**
 * Dashboard shell. On desktop the nav is a fixed sidebar; on phones/tablets
 * it collapses into a top bar with a slide-in drawer (closes on selection,
 * backdrop tap, or Escape).
 */
export default function AdminDashboard({ supabase, user, onSignOut }) {
  const [tab, setTab] = useState(adminRegistry[0]?.id || 'fathers');
  const [navOpen, setNavOpen] = useState(false);

  const activeLabel = adminRegistry.find((t) => t.id === tab)?.label || 'Admin';

  const selectTab = (id) => {
    setTab(id);
    setNavOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* Mobile top bar */}
      <header className="admin-topbar">
        <button
          className="admin-topbar-toggle"
          onClick={() => setNavOpen((o) => !o)}
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={navOpen}
        >
          {navOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <span className="admin-topbar-title">{activeLabel}</span>
        <img src="/assets/logo.png" alt="" className="admin-topbar-logo" />
      </header>

      {navOpen && <div className="admin-nav-backdrop" onClick={() => setNavOpen(false)} />}

      <aside className={`admin-sidebar ${navOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-head">
          <img src="/assets/logo.png" alt="" />
          <span>Behere Tsige Admin</span>
        </div>

        <nav className="admin-nav">
          {adminRegistry.map((t) => (
            <button
              key={t.id}
              className={`admin-nav-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => selectTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <Link href="/" className="admin-nav-btn">View Site</Link>
          <button className="admin-nav-btn" onClick={onSignOut}>Sign Out</button>
          <p className="admin-status">{user?.profile?.email || user?.email}</p>
        </div>
      </aside>

      <main className="admin-main">
        {adminRegistry.map((t) => {
          const ActiveComponent = t.Component;
          return tab === t.id ? (
            <ActiveComponent key={t.id} supabase={supabase} user={user} />
          ) : null;
        })}
      </main>
    </div>
  );
}
