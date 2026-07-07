import { getDonationProjects, getBankAccounts } from '@/lib/data/donations';
import DonateView from '@/screens/DonateView';

export const revalidate = 60;

export default async function DonatePage() {
  const [projects, bankAccounts] = await Promise.all([
    getDonationProjects(),
    getBankAccounts(),
  ]);
  return <DonateView projects={projects} bankAccounts={bankAccounts} />;
}
