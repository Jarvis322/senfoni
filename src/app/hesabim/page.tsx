import AccountClient from '@/components/AccountClient';
import { fetchLayoutSettings } from '@/services/layoutService';

export const metadata = {
  title: 'Hesabım | Senfoni Müzik',
  description: 'Senfoni Müzik hesabınızı yönetin, siparişlerinizi takip edin ve favorilerinizi görüntüleyin.',
};

export default async function AccountPage() {
  const layoutSettings = await fetchLayoutSettings();
  return <AccountClient layoutSettings={layoutSettings} />;
} 