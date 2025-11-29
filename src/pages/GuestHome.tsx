import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Truck } from 'lucide-react';

export default function GuestHome() {
  const navigate = useNavigate();
  const adminWhatsApp = '+393458374056';

  const handleContact = (type: 'chef' | 'rider') => {
    const text = type === 'chef' 
      ? 'Bonjour ! Je souhaite devenir Chef★ sur votre plateforme.' 
      : 'Bonjour ! Je souhaite devenir Livreur pour Chef★.';
    window.open(`https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="home-guest-container">
      <div className="home-logo-section">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <div
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '999px',
              border: '2px solid #D4AF37',
              background: 'url(/images/chef-etoile-logo.png) center/70% no-repeat, #FFF9E6',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            }}
          />
        </div>
        <p className="home-subtitle">Abonnez-vous aux meilleurs chefs de votre quartier</p>
      </div>

      <div className="home-grid">
        <div className="action-card primary" onClick={() => navigate('/discover')}>
          <Search size={30} className="mb-2" />
          <span>Trouver<br/>un Chef★</span>
        </div>
        <div className="action-card" onClick={() => navigate('/my/orders')}>
          <Calendar size={30} className="mb-2" />
          <span>Mes<br/>Repas</span>
        </div>
      </div>

      <div className="info-card">
        <h3>Comment ça marche ?</h3>
        <ol>
          <li>Trouvez votre Chef★</li>
          <li>Choisissez votre formule</li>
          <li>Recevez vos repas</li>
        </ol>
      </div>

      <div className="footer-pro">
        <p>Vous êtes professionnel ?</p>
        <div className="flex-center gap-2">
          <button onClick={() => handleContact('chef')} className="btn-small">
            👨‍🍳 Devenir Chef★
          </button>
          <button onClick={() => handleContact('rider')} className="btn-small">
            <Truck size={13} className="inline-icon" /> Devenir Livreur
          </button>
        </div>
      </div>
    </div>
  );
}
