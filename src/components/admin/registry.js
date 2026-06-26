import FathersManager from './FathersManager';
import MembersManager from './MembersManager';
import RequestsManager from './RequestsManager';
import LiturgyManager from './LiturgyManager';
import MemorialManager from './MemorialManager';
import SermonsManager from './SermonsManager';
import SchoolsManager from './SchoolsManager';
import RegistrationsInbox from './RegistrationsInbox';
import EventsManager from './EventsManager';
import MediaLinksManager from './MediaLinksManager';
import MessagesInbox from './MessagesInbox';

export const adminRegistry = [
  { id: 'fathers', label: 'Fathers', Component: FathersManager },
  { id: 'members', label: 'Parish Council', Component: MembersManager },
  { id: 'requests', label: 'Confessor Requests', Component: RequestsManager },
  { id: 'liturgy', label: 'Liturgy Schedule', Component: LiturgyManager },
  { id: 'memorial', label: 'Memorial Services', Component: MemorialManager },
  { id: 'sermons', label: 'Sermons & Programs', Component: SermonsManager },
  { id: 'schools', label: 'Schools & Config', Component: SchoolsManager },
  { id: 'registrations', label: 'Registrations Inbox', Component: RegistrationsInbox },
  { id: 'events', label: 'Events', Component: EventsManager },
  { id: 'media', label: 'Media Links', Component: MediaLinksManager },
  { id: 'contact', label: 'Contact Messages', Component: MessagesInbox },
];
