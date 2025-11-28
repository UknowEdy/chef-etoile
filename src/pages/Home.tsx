import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import GuestHome from './GuestHome';
import UserDashboard from './UserDashboard';
import { MOCK_SUBSCRIPTIONS } from '../data/mocks';

export default function Home() {
  const isSubscribed = MOCK_SUBSCRIPTIONS.length > 0;

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
