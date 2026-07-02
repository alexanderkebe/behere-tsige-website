import {
  getSiteSettings,
  getLiturgySchedule,
  getSundaySchoolData,
  getAbnetData,
  getEvangelismData,
  getMemorialServices,
} from '@/lib/data/services';
import { getFathers } from '@/lib/data/parish';
import ServicesView from '@/screens/ServicesView';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const [
    settings,
    liturgySchedule,
    sundaySchoolData,
    abnetData,
    evangelismData,
    memorialServices,
    fathers,
  ] = await Promise.all([
    getSiteSettings(),
    getLiturgySchedule(),
    getSundaySchoolData(),
    getAbnetData(),
    getEvangelismData(),
    getMemorialServices(),
    getFathers(),
  ]);

  return (
    <ServicesView
      settings={settings}
      liturgySchedule={liturgySchedule}
      sundaySchoolData={sundaySchoolData}
      abnetData={abnetData}
      evangelismData={evangelismData}
      memorialServices={memorialServices}
      fathers={fathers}
    />
  );
}
