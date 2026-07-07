import { getFathers, getMembers } from '@/lib/data/parish';
import HomeView from '@/screens/HomeView';

// Parish data comes from Supabase; cache the rendered page and refresh it
// in the background at most once a minute (ISR) so responses stay instant.
export const revalidate = 60;

export default async function HomePage() {
  const [fathers, members] = await Promise.all([getFathers(), getMembers()]);
  return <HomeView fathers={fathers} members={members} />;
}
