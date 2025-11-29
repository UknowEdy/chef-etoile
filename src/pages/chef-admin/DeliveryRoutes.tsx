import { useState } from 'react';
import { Navigation, Users, MapPin, Share2, Clock, TrendingUp } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import ChefBottomNav from '../../components/ChefBottomNav';
import { PageTitle, Section } from '../../components';

interface Route {
  delivererId: string;
  delivererName: string;
  deliveries: Array<{
    order: number;
    clientName: string;
    phone: string;
    meal: string;
    gpsLat: number;
    gpsLon: number;
    address: string;
  }>;
  totalDistance: number;
  estimatedTime: number;
}

export default function ChefAdminDeliveryRoutes() {
  const [moment, setMoment] = useState<'midi' | 'soir'>('midi');
  const [numDeliverers, setNumDeliverers] = useState(1);
  const [startLocation, setStartLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const getStartLocation = () => {
    if (!navigator.geolocation) {
      alert('Géolocalisation non supportée');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStartLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      () => {
        alert("Impossible d'obtenir votre position");
      }
    );
  };

  const generateRoutes = () => {
    if (!startLocation) {
      alert('Veuillez d\'abord obtenir votre position de départ');
      return;
    }

    setIsGenerating(true);

    // Simulation de génération (remplacer par algorithme réel)
    setTimeout(() => {
      // Données de test
      const mockDeliveries = [
        { clientName: 'Jean Dupont', phone: '+228 90 12 34 56', meal: 'Riz sauce arachide', gpsLat: 6.1719, gpsLon: 1.2314, address: 'Tokoin Cassablanca' },
        { clientName: 'Marie Kouassi', phone: '+228 90 23 45 67', meal: 'Attiéké poisson', gpsLat: 6.1456, gpsLon: 1.2567, address: 'Bè Kpota' },
        { clientName: 'Pierre Agbodjan', phone: '+228 90 34 56 78', meal: 'Riz sauce tomate', gpsLat: 6.1678, gpsLon: 1.2789, address: 'Hèdzranawoé' },
        { clientName: 'Kofi Mensah', phone: '+228 90 45 67 89', meal: 'Fufu', gpsLat: 6.1345, gpsLon: 1.2456, address: 'Adidogomé' },
        { clientName: 'Ama Tetteh', phone: '+228 90 56 78 90', meal: 'Banku', gpsLat: 6.1890, gpsLon: 1.2123, address: 'Nyékonakpoè' },
        { clientName: 'Yao Koffi', phone: '+228 90 67 89 01', meal: 'Riz gras', gpsLat: 6.1567, gpsLon: 1.2678, address: 'Agoè' }
      ];

      // Diviser les livraisons entre les livreurs
      const deliveriesPerPerson = Math.ceil(mockDeliveries.length / numDeliverers);
      const generatedRoutes: Route[] = [];

      for (let i = 0; i < numDeliverers; i++) {
        const start = i * deliveriesPerPerson;
        const end = Math.min(start + deliveriesPerPerson, mockDeliveries.length);
        const delivererDeliveries = mockDeliveries.slice(start, end);

        if (delivererDeliveries.length > 0) {
          generatedRoutes.push({
            delivererId: `${i + 1}`,
            delivererName: `Livreur ${i + 1}`,
            deliveries: delivererDeliveries.map((d, idx) => ({
              order: idx + 1,
              ...d
            })),
            totalDistance: parseFloat((Math.random() * 10 + 5).toFixed(1)),
            estimatedTime: delivererDeliveries.length * 8 + 15
          });
        }
      }

      setRoutes(generatedRoutes);
      setIsGenerating(false);
    }, 1500);
  };

  const shareViaWhatsApp = (route: Route) => {
    const momentText = moment === 'midi' ? 'Midi (11h30-13h)' : 'Soir (18h30-20h)';
    const date = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' });
    
    let message = `🍽️ *Chef★ - Livraisons ${momentText}*\n`;
    message += `📅 ${date}\n\n`;
    message += `👤 *${route.delivererName}*\n`;
    message += `📦 ${route.deliveries.length} livraisons à effectuer\n\n`;
    message += `---\n\n`;

    route.deliveries.forEach((delivery) => {
      message += `${delivery.order}️⃣ *${delivery.clientName}*\n`;
      message += `📍 https://maps.google.com/?q=${delivery.gpsLat},${delivery.gpsLon}\n`;
      message += `📞 ${delivery.phone}\n`;
      message += `🍲 ${delivery.meal}\n`;
      message += `📍 ${delivery.address}\n\n`;
    });

    message += `---\n\n`;
    message += `📊 *Distance totale : ${route.totalDistance} km*\n`;
    message += `⏱️ *Temps estimé : ${route.estimatedTime} min*\n\n`;
    message += `Bon courage ! 💪`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Optimiser les tournées" 
            subtitle="Générez des itinéraires optimaux pour vos livreurs"
          />

          <Section title="Configuration">
            <div className="card">
              {/* Moment */}
              <label className="label">Moment de livraison</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button
                  className={`btn ${moment === 'midi' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setMoment('midi')}
                  style={{ flex: 1 }}
                >
                  ☀️ Midi
                </button>
                <button
                  className={`btn ${moment === 'soir' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setMoment('soir')}
                  style={{ flex: 1 }}
                >
                  🌙 Soir
                </button>
              </div>

              {/* Nombre de livreurs */}
              <label className="label">Nombre de livreurs</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '16px' }}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    className={`btn ${numDeliverers === num ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setNumDeliverers(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>

              {/* Point de départ */}
              <label className="label">Point de départ du livreur</label>
              {!startLocation ? (
                <button 
                  className="btn btn-secondary"
                  onClick={getStartLocation}
                  style={{ width: '100%' }}
                >
                  <MapPin size={20} />
                  Obtenir ma position
                </button>
              ) : (
                <div style={{ 
                  padding: '12px', 
                  background: '#D1FAE5', 
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#065F46',
                  marginBottom: '16px'
                }}>
                  ✅ Position enregistrée : {startLocation.lat.toFixed(6)}, {startLocation.lon.toFixed(6)}
                </div>
              )}
            </div>
          </Section>

          {/* Bouton Générer */}
          <button 
            className="btn btn-primary"
            onClick={generateRoutes}
            disabled={isGenerating || !startLocation}
            style={{ marginBottom: '24px' }}
          >
            <Navigation size={20} />
            {isGenerating ? 'Génération en cours...' : '🚀 Générer les tournées optimales'}
          </button>

          {/* Résultats */}
          {routes.length > 0 && (
            <>
              <Section title="Tournées générées">
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#D4AF37' }}>
                      {routes.reduce((sum, r) => sum + r.deliveries.length, 0)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>Livraisons</div>
                  </div>
                  <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#D4AF37' }}>
                      {routes.reduce((sum, r) => sum + r.totalDistance, 0).toFixed(1)} km
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>Distance</div>
                  </div>
                  <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#D4AF37' }}>
                      {Math.max(...routes.map(r => r.estimatedTime))} min
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>Temps max</div>
                  </div>
                </div>
              </Section>

              {routes.map((route) => (
                <div key={route.delivererId} className="card" style={{ marginBottom: '16px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '12px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #E5E7EB'
                  }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>
                        {route.delivererName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6B7280' }}>
                        {route.deliveries.length} livraisons · {route.totalDistance} km · ~{route.estimatedTime} min
                      </div>
                    </div>
                  </div>

                  {/* Liste des livraisons */}
                  {route.deliveries.map((delivery) => (
                    <div 
                      key={delivery.order}
                      style={{ 
                        padding: '8px',
                        background: '#F3F4F6',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        fontSize: '13px'
                      }}
                    >
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        {delivery.order}. {delivery.clientName}
                      </div>
                      <div style={{ color: '#6B7280' }}>
                        📍 {delivery.address}
                      </div>
                    </div>
                  ))}

                  {/* Bouton WhatsApp */}
                  <button 
                    className="btn btn-primary"
                    onClick={() => shareViaWhatsApp(route)}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    <Share2 size={20} />
                    📲 Partager sur WhatsApp
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <ChefBottomNav />
    </AppShell>
  );
}
