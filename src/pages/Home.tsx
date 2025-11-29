import { useMemo } from 'react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import GuestHome from './GuestHome';
import UserDashboard from './UserDashboard';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../utils/storage';

export default function Home() {
  const { user } = useAuth();
  const subs = useMemo(() => {
    if (!user?.email) return [];
    return StorageService.getSubscriptions().filter(
      (sub) => sub.clientEmail === user.email && sub.status === 'active'
    );
  }, [user?.email]);

  const isSubscribed = user?.email && subs.length > 0;

  return (
    <AppShell>
      <TopBar showLogo={true} />
      <div className="page">
        <div className="page-content">
          {!isSubscribed ? <GuestHome /> : <UserDashboard />}
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
