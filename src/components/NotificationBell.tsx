import { useEffect, useRef, useState } from 'react';
import { Bell, X } from 'lucide-react';

// Types
type UserRole = 'client' | 'chef' | 'admin';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning';
  icon: string;
}

export default function NotificationBell() {
  // TODO: À relier avec ton auth réelle plus tard
  const userRole: UserRole = (localStorage.getItem('role') as UserRole) || 'client';

  const [showMenu, setShowMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Charger les notifications selon le rôle
  useEffect(() => {
    let data: Notification[] = [];

    if (userRole === 'client') {
      data = [
        { id: '1', message: 'Votre chef a publié le menu de la semaine.', type: 'info', icon: '✨' },
        { id: '2', message: 'Votre abonnement expire bientôt.', type: 'warning', icon: '⚠️' }
      ];
    }

    if (userRole === 'chef') {
      data = [
        { id: '1', message: 'Vous avez reçu 2 nouvelles commandes.', type: 'info', icon: '🍽️' },
        { id: '2', message: 'Un client s’est abonné à votre menu.', type: 'info', icon: '🧑‍🍳' }
      ];
    }

    if (userRole === 'admin') {
      data = [
        { id: '1', message: 'Un nouveau chef demande une validation.', type: 'warning', icon: '📝' },
        { id: '2', message: '2 incidents signalés dans le support.', type: 'info', icon: '🚨' }
      ];
    }

    setNotifications(data);
  }, [userRole]);

  // Fermeture auto (clic extérieur + ESC)
  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowMenu(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showMenu]);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          position: 'relative'
        }}
        aria-label="Notifications"
        aria-expanded={showMenu}
        type="button"
      >
        <Bell size={22} color="#111827" />
        {notifications.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            background: '#DC2626',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '11px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {notifications.length}
          </div>
        )}
      </button>

      {showMenu && (
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: '45px',
            right: '0',
            width: '280px',
            maxHeight: '400px',
            background: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '700' }}>Notifications</div>
            <button 
              onClick={() => setShowMenu(false)} 
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              aria-label="Fermer les notifications"
              type="button"
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #F3F4F6',
                  display: 'flex',
                  gap: '12px',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '18px' }}>{notif.icon}</span>
                <div style={{ flex: 1, fontSize: '13px', lineHeight: '1.4' }}>
                  {notif.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
