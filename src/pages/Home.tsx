import { useNavigate } from 'react-router-dom';
import { Search, Calendar, LifeBuoy, MapPin, FileText, Truck } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

export default function Home() {
  const navigate = useNavigate();
  const adminWhatsApp = '+393458374056';

  const subscriptions = [
    { chefName: 'Chef Kodjo', chefSlug: 'kodjo', plan: 'Formule Complète', expiry: '05 Dec 2024' },
    { chefName: 'Chef Anna', chefSlug: 'anna', plan: 'Formule Midi', expiry: '08 Dec 2024' }
  ];

  const isSubscribed = subscriptions.length > 0;
  const userName = 'Jean';

  const todayMeals = [
    { time: 'Midi', dish: 'Riz sauce arachide', chef: 'Chef Kodjo' },
    { time: 'Soir', dish: 'Pâtes carbonara', chef: 'Chef Kodjo' }
  ];

  const handleContactChef = () => {
    const message = encodeURIComponent('Bonjour ! Je souhaite devenir Chef★ sur votre plateforme. Pouvez-vous me créer un compte ?');
    window.open(`https://wa.me/${adminWhatsApp}?text=${message}`, '_blank');
  };

  const handleContactRider = () => {
    const message = encodeURIComponent('Bonjour ! Je souhaite devenir Livreur pour Chef★. Comment puis-je m\'inscrire ?');
    window.open(`https://wa.me/${adminWhatsApp}?text=${message}`, '_blank');
  };

  // PAGE VITRINE (non abonné)
  if (!isSubscribed) {
    return (
      <AppShell>
        <TopBar showLogo={true} />
        <div className="page">
          <div style={{ padding: '24px 16px 16px', textAlign: 'center' }}>
            <img 
              src="/images/chef-etoile-logo.png" 
              alt="Chef★" 
              style={{ 
                width: '140px', 
                height: 'auto', 
                marginBottom: '8px',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            />
            <div style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.4', maxWidth: '300px', margin: '0 auto' }}>
              Abonnez-vous aux meilleurs chefs de votre quartier
            </div>
          </div>

          <div className="page-content" style={{ padding: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div 
                onClick={() => navigate('/discover')} 
                style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '18px 12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseDown={(e) => e.currentTarget.style.background = '#D4AF37'}
                onMouseUp={(e) => e.currentTarget.style.background = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <Search size={30} color="#111827" style={{ marginBottom: '6px' }} />
                <div style={{ fontSize: '14px', fontWeight: '600' }}>Trouver<br/>un Chef★</div>
              </div>
              <div 
                onClick={() => navigate('/my/orders')} 
                style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '18px 12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseDown={(e) => e.currentTarget.style.background = '#F3F4F6'}
                onMouseUp={(e) => e.currentTarget.style.background = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <Calendar size={30} color="#111827" style={{ marginBottom: '6px' }} />
                <div style={{ fontSize: '14px', fontWeight: '600' }}>Mes<br/>Repas</div>
              </div>
            </div>

            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>Comment ça marche ?</div>
              <div style={{ fontSize: '12px', lineHeight: '1.5', color: '#6B7280' }}>
                <div style={{ marginBottom: '6px' }}>1. Trouvez votre Chef★</div>
                <div style={{ marginBottom: '6px' }}>2. Choisissez votre formule</div>
                <div>3. Recevez vos repas</div>
              </div>
            </div>

            <div style={{ paddingTop: '12px', borderTop: '1px solid #E5E7EB', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '8px' }}>Vous êtes professionnel ?</div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={handleContactChef} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '7px 10px', fontSize: '11px', color: '#111827', cursor: 'pointer' }}>
                  👨‍🍳 Devenir Chef★
                </button>
                <button onClick={handleContactRider} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '7px 10px', fontSize: '11px', color: '#111827', cursor: 'pointer' }}>
                  <Truck size={13} style={{ display: 'inline', marginRight: '4px' }} /> Devenir Livreur
                </button>
              </div>
            </div>
          </div>
        </div>
        <BottomNav />
      </AppShell>
    );
  }

  // DASHBOARD ABONNÉ
  return (
    <AppShell>
      <TopBar showLogo={true} />
      <div className="page">
        <div className="page-content" style={{ padding: '16px' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
            Bonjour {userName} 👋
          </div>

          {/* Card Aujourd'hui */}
          <div 
            onClick={() => navigate('/my/orders')}
            style={{
              background: 'white',
              border: '2px solid #111827',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseDown={(e) => e.currentTarget.style.background = '#F3F4F6'}
            onMouseUp={(e) => e.currentTarget.style.background = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
          >
            <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '10px' }}>
              🔥 Aujourd'hui
            </div>
            {todayMeals.map((meal, idx) => (
              <div key={idx} style={{ marginBottom: idx < todayMeals.length - 1 ? '10px' : '0' }}>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>
                  {meal.time === 'Midi' ? '🌅' : '🌙'} {meal.time}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{meal.dish}</div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>{meal.chef}</div>
              </div>
            ))}
          </div>

          {/* Grid Accès Rapide */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {[
              { icon: Calendar, label: 'Menu\nSemaine', path: '/my/orders' },
              { icon: MapPin, label: 'Point\nRetrait', path: '/my/pickup-point' },
              { icon: FileText, label: 'Mes\nAbonnements', path: '/my/subscriptions' },
              { icon: LifeBuoy, label: 'Support', path: '/support' }
            ].map((item, idx) => (
              <div 
                key={idx}
                onClick={() => navigate(item.path)} 
                style={{ 
                  background: 'white', 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '12px', 
                  padding: '14px', 
                  textAlign: 'center', 
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseDown={(e) => e.currentTarget.style.background = '#F3F4F6'}
                onMouseUp={(e) => e.currentTarget.style.background = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <item.icon size={26} color="#111827" style={{ marginBottom: '6px' }} />
                <div style={{ fontSize: '12px', fontWeight: '600', whiteSpace: 'pre-line' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Card Abonnements */}
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '14px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>
              📋 Mes abonnements
            </div>
            {subscriptions.map((sub, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: idx < subscriptions.length - 1 ? '1px solid #E5E7EB' : 'none'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{sub.chefName}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>{sub.plan}</div>
                </div>
                <div style={{ fontSize: '11px', color: '#6B7280', textAlign: 'right' }}>
                  Expire<br/>{sub.expiry}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
