import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu } from 'lucide-react';
import { LogoIcon } from './Logo';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showLogo?: boolean;
  onMenuClick?: () => void;
}

export default function TopBar({ title, showBack = false, showMenu = false, showLogo = false, onMenuClick }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <div className="top-bar">
      <div style={{ width: 40, display: 'flex', alignItems: 'center' }}>
        {showBack && (
          <button className="top-bar-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {showLogo ? <LogoIcon /> : <div className="top-bar-title">{title}</div>}
      </div>
      
      <div style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {showMenu && (
          <button className="top-bar-action" onClick={onMenuClick}>
            <Menu size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
