import { Link, useLocation } from 'react-router-dom';
import { Home, Users, ClipboardList, UtensilsCrossed, Settings } from 'lucide-react';

export default function ChefBottomNav() {
  const { pathname } = useLocation();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="bottom-nav">
      <Link to="/chef/dashboard" className={`bottom-nav-item ${isActive('/chef/dashboard') ? 'bottom-nav-item-active' : ''}`}>
        <Home size={22} />
        <span>Accueil</span>
      </Link>

      <Link to="/chef/orders" className={`bottom-nav-item ${isActive('/chef/orders') ? 'bottom-nav-item-active' : ''}`}>
        <ClipboardList size={22} />
        <span>Commandes</span>
      </Link>

      <Link to="/chef/subscribers" className={`bottom-nav-item ${isActive('/chef/subscribers') ? 'bottom-nav-item-active' : ''}`}>
        <Users size={22} />
        <span>Abonnés</span>
      </Link>

      <Link to="/chef/menu" className={`bottom-nav-item ${isActive('/chef/menu') ? 'bottom-nav-item-active' : ''}`}>
        <UtensilsCrossed size={22} />
        <span>Menu</span>
      </Link>

      <Link to="/chef/settings" className={`bottom-nav-item ${isActive('/chef/settings') ? 'bottom-nav-item-active' : ''}`}>
        <Settings size={22} />
        <span>Réglages</span>
      </Link>
    </div>
  );
}
