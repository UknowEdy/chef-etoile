import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NotificationBell from './NotificationBell';

interface TopBarProps {
  showLogo?: boolean;
  showBack?: boolean;
  title?: string;
}

export default function TopBar({ showLogo, showBack, title }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <div className="top-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {showBack && (
        <button
          className="top-bar-back"
          onClick={() => navigate(-1)}
          style={{ position: 'absolute', left: '16px' }}
          aria-label="Retour"
          type="button"
        >
          <ArrowLeft size={22} />
        </button>
      )}
      
      {showLogo ? (
        <img src="/images/chef-etoile-logo.png" alt="Chef★" style={{ width: '110px', height: 'auto' }} />
      ) : title ? (
        <div className="top-bar-title">{title}</div>
      ) : null}
      
      <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
        <NotificationBell />
      </div>
    </div>
  );
}
