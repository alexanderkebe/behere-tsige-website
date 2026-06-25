'use client';

import dynamic from 'next/dynamic';

// The admin dashboard is a client-only app (auth-gated, no SEO needed), so we
// disable SSR for it — this also avoids server-side access to sessionStorage.
const Admin = dynamic(() => import('../../screens/AdminApp'), { ssr: false });

export default function AdminPage() {
  return <Admin />;
}
