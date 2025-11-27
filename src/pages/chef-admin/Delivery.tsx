import { useState } from 'react';
import { MapPin, Phone, Clock, Check, Navigation, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle } from '../../components';

interface Delivery {
  id: string;
  clientName: string;
  meal: string;
  moment: 'Midi' | 'Soir';
  address: string;
  gpsLat: number;
  gpsLon: number;
  phone: string;
  time: string;
  status: 'pending' | 'delivered';
  distance?: number; // en km
}

export default function ChefAdminDelivery() {
  const navigate = useNavigate();
  
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    { 
      id: '1', 
      clientName: 'Jean Dupont', 
      meal: 'Riz sauce arachide', 
      moment: 'Midi',
      address: 'Tokoin Cassablanca', 
      gpsLat: 6.1719,
      gpsLon: 1.2314,
      phone: '+228 90 12 34 56',
      time: '12:00',
      status: 'pending',
      distance: 2.3
    },
    { 
      id: '2', 
      clientName: 'Marie Kouassi', 
      meal: 'Riz sauce arachide', 
      moment: 'Midi',
      address: 'Bè Kpota', 
      gpsLat: 6.1456,
      gpsLon: 1.2567,
      phone: '+228 90 23 45 67',
      time: '12:30',
      status: 'pending',
      distance: 4.1
    },
    { 
      id: '3', 
      clientName: 'Pierre Agbodjan', 
      meal: 'Attiéké poisson', 
      moment: 'Soir',
      address: 'Hèdzranawoé', 
      gpsLat: 6.1678,
      gpsLon: 1.2789,
      phone: '+228 90 34 56 78',
      time: '19:00',
      status: 'pending',
      distance: 5.8
    }
  ]);

  const markAsDelivered = (id: string) => {
    setDeliveries(deliveries.map(d => 
      d.id === id ? { ...d, status: 'delivered' } : d
    ));
  };

  const pendingDeliveries = deliveries.filter(d => d.status === 'pending');
  const deliveredCount = deliveries.filter(d => d.status === 'delivered').length;

  const midiDeliveries = deliveries.filter(d => d.moment === 'Midi');
  const soirDeliveries = deliveries.filter(d => d.moment === 'Soir');

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Livraisons du jour" 
            subtitle={`${pendingDeliveries.length} livraisons à effectuer · ${deliveredCount} livrées`}
          />

          {/* Bouton pour optimiser les tournées */}
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/chef-admin/delivery-routes')}
            style={{ marginBottom: '24px' }}
          >
            <Navigation size={20} />
            🚀 Optimiser les tournées
          </button>

          {/* Stats rapides */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#D4AF37' }}>
                {midiDeliveries.filter(d => d.status === 'pending').length}
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>
                Livraisons Midi
              </div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#D4AF37' }}>
                {soirDeliveries.filter(d => d.status === 'pending').length}
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>
                Livraisons Soir
              </div>
            </div>
          </div>

          {/* Liste des livraisons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {deliveries.map((delivery) => (
              <div 
                key={delivery.id} 
                className="card"
                style={{ 
                  opacity: delivery.status === 'delivered' ? 0.6 : 1,
                  background: delivery.status === 'delivered' ? '#F3F4F6' : 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>
                    {delivery.clientName}
                  </div>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span className={`badge ${delivery.moment === 'Midi' ? 'badge-warning' : 'badge-info'}`}>
                      {delivery.moment}
                    </span>
                    {delivery.status === 'delivered' && (
                      <span className="badge badge-success">
                        <Check size={14} /> Livré
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '14px', marginBottom: '12px', color: '#111827' }}>
                  <strong>{delivery.meal}</strong>
                </div>

                {/* GPS et adresse */}
                <div style={{ 
                  padding: '12px',
                  background: '#F3F4F6',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                    <MapPin size={14} />
                    {delivery.address}
                  </div>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#6B7280', marginBottom: '8px' }}>
                    📍 {delivery.gpsLat.toFixed(6)}, {delivery.gpsLon.toFixed(6)}
                  </div>
                  {delivery.distance && (
                    <div style={{ fontSize: '12px', color: '#D4AF37', fontWeight: '600' }}>
                      📏 {delivery.distance} km du point de départ
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                  <Phone size={14} />
                  {delivery.phone}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6B7280', marginBottom: '12px' }}>
                  <Clock size={14} />
                  {delivery.time}
                </div>

                {/* Boutons d'action */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${delivery.gpsLat},${delivery.gpsLon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}
                  >
                    <Map size={16} />
                    Itinéraire
                  </a>

                  {delivery.status === 'pending' && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => markAsDelivered(delivery.id)}
                      style={{ flex: 1 }}
                    >
                      <Check size={16} />
                      Livré
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
