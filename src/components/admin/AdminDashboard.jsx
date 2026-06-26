'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import FathersManager from './FathersManager';
import MembersManager from './MembersManager';
import RequestsManager from './RequestsManager';
import LiturgyManager from './LiturgyManager';
import MemorialManager from './MemorialManager';
import SermonsManager from './SermonsManager';
import SchoolsManager from './SchoolsManager';
import RegistrationsInbox from './RegistrationsInbox';

const TABS = [
  { id: 'fathers', label: 'Fathers' },
  { id: 'members', label: 'Parish Council' },
  { id: 'requests', label: 'Confessor Requests' },
  { id: 'liturgy', label: 'Liturgy Schedule' },
  { id: 'memorial', label: 'Memorial Services' },
  { id: 'sermons', label: 'Sermons & Programs' },
  { id: 'schools', label: 'Schools & Config' },
  { id: 'registrations', label: 'Registrations Inbox' },
];

export default function AdminDashboard({ supabase, user, onSignOut }) {
  const [tab, setTab] = useState('fathers');

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-head">
          <img src="/assets/logo.png" alt="" />
          <span>Behere Tsige Admin</span>
        </div>

        <nav className="admin-nav" style={{ overflowY: 'auto' }}>
          {TABS.map((t) => (
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
        {tab === 'fathers' && <FathersManager supabase={supabase} />}
        {tab === 'members' && <MembersManager supabase={supabase} />}
        {tab === 'requests' && <RequestsManager supabase={supabase} />}
        {tab === 'liturgy' && <LiturgyManager supabase={supabase} />}
        {tab === 'memorial' && <MemorialManager supabase={supabase} />}
        {tab === 'sermons' && <SermonsManager supabase={supabase} />}
        {tab === 'schools' && <SchoolsManager supabase={supabase} />}
        {tab === 'registrations' && <RegistrationsInbox supabase={supabase} />}
      </main>
    </div>
  );
}
