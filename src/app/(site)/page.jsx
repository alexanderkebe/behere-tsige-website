import { getFathers, getMembers } from '@/lib/data/parish';
import HomeView from '@/screens/HomeView';

// Parish data comes from Supabase (per-request), so render the home dynamically.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [fathers, members] = await Promise.all([getFathers(), getMembers()]);
  return <HomeView fathers={fathers} members={members} />;
}
