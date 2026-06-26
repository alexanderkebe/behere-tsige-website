import {
  getSiteSettings,
  getLiturgySchedule,
  getSundaySchoolData,
  getAbnetData,
  getEvangelismData,
  getMemorialServices,
} from '@/lib/data/services';
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
  ] = await Promise.all([
    getSiteSettings(),
    getLiturgySchedule(),
    getSundaySchoolData(),
    getAbnetData(),
    getEvangelismData(),
    getMemorialServices(),
  ]);

  return (
    <ServicesView
      settings={settings}
      liturgySchedule={liturgySchedule}
      sundaySchoolData={sundaySchoolData}
      abnetData={abnetData}
      evangelismData={evangelismData}
      memorialServices={memorialServices}
    />
  );
}
