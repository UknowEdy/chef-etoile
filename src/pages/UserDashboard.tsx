import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, FileText, LifeBuoy } from 'lucide-react';
import { MOCK_SUBSCRIPTIONS, MOCK_TODAY_MEALS } from '../data/mocks';

export default function UserDashboard() {
  const navigate = useNavigate();
  const userName = 'Jean';

  return (
    <div className="home-dashboard">
      <h1 className="welcome-title">Bonjour {userName} 👋</h1>

      {/* Carte "Aujourd'hui" */}
      <div className="today-card" onClick={() => navigate('/my/orders')}>
        <div className="card-header">🔥 Aujourd'hui</div>
        {MOCK_TODAY_MEALS.map((meal) => (
          <div key={meal.id} className="meal-row">
            <div className="meal-time">{meal.time === 'Midi' ? '🌅' : '🌙'} {meal.time}</div>
            <div className="meal-name">{meal.dish}</div>
            <div className="meal-chef">{meal.chefName}</div>
          </div>
        ))}
      </div>

      {/* Actions Rapides */}
      <div className="home-grid">
        {[
          { icon: Calendar, label: 'Menu\nSemaine', path: '/my/orders' },
          { icon: MapPin, label: 'Point\nRetrait', path: '/my/pickup-point' },
          { icon: FileText, label: 'Mes\nAbonnements', path: '/my/subscriptions' },
          { icon: LifeBuoy, label: 'Support', path: '/support' }
        ].map((item, idx) => (
          <div key={idx} className="action-card" onClick={() => navigate(item.path)}>
            <item.icon size={26} className="mb-2" />
            <span className="whitespace-pre-line">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Liste Abonnements */}
      <div className="subscriptions-section card">
        <h3>📋 Mes abonnements</h3>
        {MOCK_SUBSCRIPTIONS.map((sub, idx) => (
          <div key={idx} className="subscription-item">
            <div>
              <div className="sub-chef">{sub.chef.name}</div>
              <div className="sub-plan">{sub.plan}</div>
            </div>
            <div className="sub-expiry">
              Expire<br/>{sub.expiryDate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
