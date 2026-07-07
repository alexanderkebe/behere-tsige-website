import SiteContentManager from './SiteContentManager';
import AnalyticsDashboard from './AnalyticsDashboard';
import FathersManager from './FathersManager';
import MembersManager from './MembersManager';
import RequestsManager from './RequestsManager';
import FeastsManager from './FeastsManager';
import WeeklyScheduleManager from './WeeklyScheduleManager';
import MemorialManager from './MemorialManager';
import SermonsManager from './SermonsManager';
import SchoolsManager from './SchoolsManager';
import RegistrationsInbox from './RegistrationsInbox';
import EventsManager from './EventsManager';
import MediaLinksManager from './MediaLinksManager';
import MessagesInbox from './MessagesInbox';
import ArticlesManager from './ArticlesManager';
import CommentsManager from './CommentsManager';
import DejeselamManager from './DejeselamManager';
import ProjectsManager from './ProjectsManager';
import BankAccountsManager from './BankAccountsManager';
import ContributionsInbox from './ContributionsInbox';

export const adminRegistry = [
  { id: 'site-content', label: 'Site Content & Translations', Component: SiteContentManager },
  { id: 'analytics', label: 'Analytics', Component: AnalyticsDashboard },
  { id: 'fathers', label: 'Fathers', Component: FathersManager },
  { id: 'members', label: 'Parish Council', Component: MembersManager },
  { id: 'requests', label: 'Confessor Requests', Component: RequestsManager },
  { id: 'feasts', label: 'Annual Feasts', Component: FeastsManager },
  { id: 'weekly-schedule', label: 'Weekly Schedule', Component: WeeklyScheduleManager },
  { id: 'memorial', label: 'Memorial Services', Component: MemorialManager },
  { id: 'sermons', label: 'Sermons & Programs', Component: SermonsManager },
  { id: 'schools', label: 'Schools & Config', Component: SchoolsManager },
  { id: 'registrations', label: 'Registrations Inbox', Component: RegistrationsInbox },
  { id: 'events', label: 'Events', Component: EventsManager },
  { id: 'media', label: 'Media Links', Component: MediaLinksManager },
  { id: 'contact', label: 'Contact Messages', Component: MessagesInbox },
  { id: 'articles', label: 'Articles', Component: ArticlesManager },
  { id: 'comments', label: 'Comments Moderation', Component: CommentsManager },
  { id: 'dejeselam', label: 'Project Dejeselam', Component: DejeselamManager },
  { id: 'donation-projects', label: 'Donation Projects', Component: ProjectsManager },
  { id: 'bank-accounts', label: 'Bank Accounts', Component: BankAccountsManager },
  { id: 'contributions', label: 'Contributions Inbox', Component: ContributionsInbox },
];
