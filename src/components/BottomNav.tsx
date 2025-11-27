import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, User } from 'lucide-react';
export default function BottomNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  return (
    <div className="bottom-nav">
      <Link to="/" className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}>
        <Home size={24} />
        <span>Accueil</span>
      </Link>
      
      <Link to="/discover" className={`bottom-nav-item ${isActive('/discover') ? 'active' : ''}`}>
        <Search size={24} />
        <span>Trouver</span>
      </Link>
      
      <Link to="/my/orders" className={`bottom-nav-item ${isActive('/my/orders') ? 'active' : ''}`}>
        <Calendar size={24} />
        <span>Repas</span>
      </Link>
      
      <Link to="/my/subscriptions" className={`bottom-nav-item ${isActive('/my/subscriptions') ? 'active' : ''}`}>
        <User size={24} />
        <span>Abonnements</span>
      </Link>
    </div>
  );
}
