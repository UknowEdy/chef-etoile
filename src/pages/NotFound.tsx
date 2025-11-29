import { useNavigate } from 'react-router-dom';
import { Frown } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import { EmptyState } from '../components';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <TopBar showLogo />
      <div className="page">
        <div
          className="page-content"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh'
          }}
        >
          <EmptyState
            icon={<Frown size={48} />}
            title="Oups ! Page introuvable (404)"
            description="La page que vous recherchez n'existe pas. Elle a peut-être été déplacée ou supprimée."
            actionLabel="Retourner à l'accueil"
            onAction={() => navigate('/')}
          />
        </div>
      </div>
    </AppShell>
  );
}
