'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { adminRegistry } from './registry';

export default function AdminDashboard({ supabase, user, onSignOut }) {
  const [tab, setTab] = useState(adminRegistry[0]?.id || 'fathers');

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-head">
          <img src="/assets/logo.png" alt="" />
          <span>Behere Tsige Admin</span>
        </div>

        <nav className="admin-nav" style={{ overflowY: 'auto' }}>
          {adminRegistry.map((t) => (
            <button
              key={t.id}
              className={`admin-nav-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
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
