import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, MapPin, Phone, Mail, DollarSign } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle } from '../../components';

interface Chef {
  id: string;
  name: string;
  slug: string;
  quartier: string;
  subscribers: number;
  status: 'active' | 'inactive';
  phone: string;
  email: string;
  address: string;
  joinDate: string;
  revenue: string;
  mealsServed: number;
  rating: number;
}

export default function SuperAdminChefs() {
  const navigate = useNavigate();
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);

  const chefs: Chef[] = [
    { 
      id: '1', 
      name: 'Chef Kodjo', 
      slug: 'kodjo',
      quartier: 'Tokoin', 
      subscribers: 24, 
      status: 'active',
      phone: '+228 90 12 34 56',
      email: 'kodjo@chefetoile.com',
      address: 'Rue 123, Tokoin, Lomé',
      joinDate: '2024-01-15',
      revenue: '850 000',
      mealsServed: 312,
      rating: 4.6
    },
    { 
      id: '2', 
      name: 'Chef Anna', 
      slug: 'anna',
      quartier: 'Bè', 
      subscribers: 18, 
      status: 'active',
      phone: '+228 90 23 45 67',
      email: 'anna@chefetoile.com',
      address: 'Rue 456, Bè, Lomé',
      joinDate: '2024-02-20',
      revenue: '620 000',
      mealsServed: 245,
      rating: 4.8
    },
    { 
      id: '3', 
      name: 'Chef Gloria', 
      slug: 'gloria',
      quartier: 'Hèdzranawoé', 
      subscribers: 31, 
      status: 'active',
      phone: '+228 90 34 56 78',
      email: 'gloria@chefetoile.com',
      address: 'Rue 789, Hèdzranawoé, Lomé',
      joinDate: '2023-11-10',
      revenue: '1 120 000',
      mealsServed: 428,
      rating: 4.7
    }
  ];

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Gérer les Chefs★" 
            subtitle={`${chefs.length} Chefs★ actifs`}
          />

          <button 
            className="btn btn-primary"
            onClick={() => navigate('/superadmin/chefs/new')}
            style={{ marginBottom: '24px' }}
          >
            <Plus size={20} />
            Créer un nouveau Chef★
          </button>

          {/* Liste des Chefs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {chefs.map((chef) => (
              <div 
                key={chef.id}
                className="card"
                onClick={() => setSelectedChef(chef)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>
                    {chef.name}
                  </div>
                  <span className="badge badge-success">
                    {chef.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                  <MapPin size={14} />
                  {chef.quartier}
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>
                  {chef.subscribers} abonnés
                </div>
              </div>
            ))}
          </div>

          {/* Modal détaillé */}
          {selectedChef && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setSelectedChef(null)}
            >
              <div 
                className="card"
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: '440px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflow: 'auto',
                  position: 'relative'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700' }}>
                    {selectedChef.name}
                  </div>
                  <button 
                    onClick={() => setSelectedChef(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Stats principales */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <div style={{ textAlign: 'center', padding: '12px', background: '#F3F4F6', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                      {selectedChef.subscribers}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>Abonnés</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', background: '#F3F4F6', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                      {selectedChef.mealsServed}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>Repas</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '12px', background: '#F3F4F6', borderRadius: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#D4AF37' }}>
                      {selectedChef.rating} ⭐
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>Note</div>
                  </div>
                </div>

                {/* Infos de contact */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    Contact
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                      <Phone size={16} color="#6B7280" />
                      {selectedChef.phone}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                      <Mail size={16} color="#6B7280" />
                      {selectedChef.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                      <MapPin size={16} color="#6B7280" />
                      {selectedChef.address}
                    </div>
                  </div>
                </div>

                {/* Financier */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    Financier
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <DollarSign size={16} color="#6B7280" />
                    Chiffre d'affaires : <strong>{selectedChef.revenue} F</strong>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectedChef(null);
                      navigate(`/superadmin/chefs/${selectedChef.id}/config`);
                    }}
                  >
                    Modifier les paramètres
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setSelectedChef(null)}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
