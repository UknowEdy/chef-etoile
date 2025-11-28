import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Star, Truck } from 'lucide-react';
import AppShell from '../components/AppShell';
import BottomNav from '../components/BottomNav';

export default function Home() {
  const navigate = useNavigate();
  const adminWhatsApp = '+393458374056';

  const handleContactChef = () => {
    const message = encodeURIComponent('Bonjour ! Je souhaite devenir Chef★ sur votre plateforme. Pouvez-vous me créer un compte ?');
    window.open(`https://wa.me/${adminWhatsApp}?text=${message}`, '_blank');
  };

  const handleContactRider = () => {
    const message = encodeURIComponent('Bonjour ! Je souhaite devenir Livreur pour Chef★. Comment puis-je m\'inscrire ?');
    window.open(`https://wa.me/${adminWhatsApp}?text=${message}`, '_blank');
  };

  return (
    <AppShell>
      <div className="page">
        {/* Hero - Fond blanc */}
        <div style={{ 
          padding: '24px 16px 16px', 
          textAlign: 'center',
          background: 'white'
        }}>
          <img 
            src="/images/chef-etoile-logo.png" 
            alt="Chef★" 
            style={{ 
              width: '130px', 
              height: 'auto', 
              marginBottom: '8px',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          />
          <div style={{ 
            fontSize: '14px', 
            color: '#6B7280',
            lineHeight: '1.4',
            maxWidth: '300px',
            margin: '0 auto'
          }}>
            Abonnez-vous aux meilleurs chefs de votre quartier
          </div>
        </div>

        <div className="page-content" style={{ padding: '16px' }}>
          {/* Quick actions */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div 
              onClick={() => navigate('/discover')}
              style={{
                background: 'white',
                border: '2px solid #D4AF37',
                borderRadius: '16px',
                padding: '18px 12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F4E4B0';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Search size={30} color="#D4AF37" style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '14px', fontWeight: '600' }}>
                Trouver<br/>un Chef★
              </div>
            </div>

            <div 
              onClick={() => navigate('/my/orders')}
              style={{
                background: 'white',
                border: '2px solid #E5E7EB',
                borderRadius: '16px',
                padding: '18px 12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D4AF37';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Calendar size={30} color="#6B7280" style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '14px', fontWeight: '600' }}>
                Mes<br/>Repas
              </div>
            </div>
          </div>

          {/* Comment ça marche - Compact */}
          <div style={{ 
            background: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '16px',
            padding: '14px',
            marginBottom: '16px'
          }}>
            <div style={{ 
              fontSize: '15px', 
              fontWeight: '700',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Star size={18} color="#D4AF37" fill="#D4AF37" />
              Comment ça marche ?
            </div>
            
            <div style={{ fontSize: '13px', lineHeight: '1.5', color: '#6B7280' }}>
              <div style={{ marginBottom: '6px' }}>
                <strong>1.</strong> Trouvez votre Chef★ (rayon 10 km)
              </div>
              <div style={{ marginBottom: '6px' }}>
                <strong>2.</strong> Choisissez votre formule hebdo
              </div>
              <div>
                <strong>3.</strong> Recevez vos repas chaque jour
              </div>
            </div>
          </div>

          {/* Footer discret - Devenir Chef/Livreur */}
          <div style={{ 
            paddingTop: '12px',
            borderTop: '1px solid #E5E7EB',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '8px' }}>
              Vous êtes professionnel ?
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={handleContactChef}
                style={{
                  background: 'transparent',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '7px 10px',
                  fontSize: '11px',
                  color: '#6B7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                👨‍🍳 Devenir Chef★
              </button>
              <button
                onClick={handleContactRider}
                style={{
                  background: 'transparent',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '7px 10px',
                  fontSize: '11px',
                  color: '#6B7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Truck size={13} /> Devenir Livreur
              </button>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
