import { useEffect, useRef, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../utils/storage';

type UserRole = 'client' | 'chef' | 'admin' | 'guest';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning';
  icon: string;
  path?: string;
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole: UserRole = user?.role ?? 'guest';

  const [showMenu, setShowMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const subs = StorageService.getSubscriptions();
    let data: Notification[] = [];

    if (userRole === 'chef') {
      const pending = subs.filter((s) => s.chefSlug === user?.chefSlug && s.status === 'pending');
      data = pending.map((p) => ({
        id: p.id,
        message: `Nouvel abonné: ${p.clientEmail} · ${p.planName} (${p.days.join(', ')})`,
        type: 'info',
        icon: '🧑‍🍳',
        path: '/chef/subscribers'
      }));
    } else if (userRole === 'client' && user?.email) {
      const mine = subs.filter((s) => s.clientEmail === user.email);
      data = mine.map((p) => ({
        id: p.id,
        message:
          p.status === 'pending'
            ? `Abonnement en attente: ${p.planName}`
            : p.status === 'active'
              ? `Abonnement actif: ${p.planName} (expire le ${p.expiryDateISO ? new Date(p.expiryDateISO).toLocaleDateString('fr-FR') : '—'})`
              : `Abonnement ${p.status}`,
        type: p.status === 'pending' ? 'warning' : 'info',
        icon: p.status === 'pending' ? '⏳' : '✅',
        path: '/my/subscriptions'
      }));
    } else if (userRole === 'admin') {
      const pending = subs.filter((s) => s.status === 'pending');
      data = pending.map((p) => ({
        id: p.id,
        message: `Validation en attente: ${p.clientEmail} → ${p.chefName} (${p.planName})`,
        type: 'warning',
        icon: '🛡️',
        path: '/superadmin/dashboard'
      }));
    }

    setNotifications(data);
  }, [userRole, user?.email, user?.chefSlug]);

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

  const handleNavigate = (path?: string) => {
    if (path) navigate(path);
    setShowMenu(false);
  };

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
          <div
            style={{
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
            }}
          >
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
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
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
            {notifications.length === 0 ? (
              <div style={{ padding: '16px', fontSize: '13px', color: '#6B7280' }}>
                Aucune notification.
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleNavigate(notif.path)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'white',
                    borderBottom: '1px solid #F3F4F6',
                    display: 'flex',
                    gap: '12px',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{notif.icon}</span>
                  <div style={{ flex: 1, fontSize: '13px', lineHeight: '1.4' }}>
                    {notif.message}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
