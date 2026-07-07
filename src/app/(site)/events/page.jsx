import { getEvents } from '@/lib/data/events';
import EventsView from '@/screens/EventsView';

export const revalidate = 60;

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsView initialEvents={events} />;
}
