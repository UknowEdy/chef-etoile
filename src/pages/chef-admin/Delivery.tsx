import { useEffect, useState } from 'react';
import { MapPin, Phone, Clock, Check, Navigation, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import ChefBottomNav from '../../components/ChefBottomNav';
import { PageTitle } from '../../components';
import { StorageService } from '../../utils/storage';
import { useAuth } from '../../context/AuthContext';

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
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    const chefSlug = user?.chefSlug || 'kodjo';
    const subs = StorageService.getSubscriptions().filter(
      (s) => s.chefSlug === chefSlug && s.status === 'active'
    );
    const menu = StorageService.getMenu(chefSlug);
    const dayIndex = new Date().getDay();
    const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const dayName = dayNames[dayIndex];
    const todayMenu = menu[dayIndex === 0 ? 6 : dayIndex - 1] || menu[0];

    const generated: Delivery[] = [];
    subs.forEach((sub) => {
      if (!sub.days?.map((d) => d.toLowerCase()).includes(dayName)) return;
      const baseAddress = `Point de retrait ${sub.clientEmail.split('@')[0]}`;
      const baseLat = 6.15 + Math.random() * 0.05;
      const baseLon = 1.24 + Math.random() * 0.05;
      const pushDelivery = (moment: 'Midi' | 'Soir', dish: string) => {
        generated.push({
          id: `${sub.id}-${moment}`,
          clientName: sub.clientEmail,
          meal: dish,
          moment,
          address: baseAddress,
          gpsLat: baseLat,
          gpsLon: baseLon,
          phone: sub.clientPhone || '+22891209085',
          time: moment === 'Midi' ? '12:00' : '19:00',
          status: 'pending',
          distance: parseFloat((2 + Math.random() * 4).toFixed(1))
        });
      };
      if (sub.planId === 'midi' || sub.planId === 'complet') {
        pushDelivery('Midi', todayMenu?.midi || 'Plat midi');
      }
      if (sub.planId === 'soir' || sub.planId === 'complet') {
        pushDelivery('Soir', todayMenu?.soir || 'Plat soir');
      }
    });

    setDeliveries(generated);
  }, [user?.chefSlug]);

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
            onClick={() => navigate('/chef/delivery-routes')}
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
      <ChefBottomNav />
    </AppShell>
  );
}
