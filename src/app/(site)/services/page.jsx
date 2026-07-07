import {
  getSiteSettings,
  getAnnualFeasts,
  getWeeklySchedule,
  getSundaySchoolData,
  getAbnetData,
  getEvangelismData,
  getMemorialServices,
} from '@/lib/data/services';
import { getFathers } from '@/lib/data/parish';
import ServicesView from '@/screens/ServicesView';

export const revalidate = 60;

export default async function ServicesPage() {
  const [
    settings,
    annualFeasts,
    weeklySchedule,
    sundaySchoolData,
    abnetData,
    evangelismData,
    memorialServices,
    fathers,
  ] = await Promise.all([
    getSiteSettings(),
    getAnnualFeasts(),
    getWeeklySchedule(),
    getSundaySchoolData(),
    getAbnetData(),
    getEvangelismData(),
    getMemorialServices(),
    getFathers(),
  ]);

  return (
    <ServicesView
      settings={settings}
      annualFeasts={annualFeasts}
      weeklySchedule={weeklySchedule}
      sundaySchoolData={sundaySchoolData}
      abnetData={abnetData}
      evangelismData={evangelismData}
      memorialServices={memorialServices}
      fathers={fathers}
    />
  );
}
