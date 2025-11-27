import { useState, useEffect } from 'react';
import { MapPin, AlertCircle, Check, Navigation } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import { PageTitle, Section } from '../components';

export default function MyPickupPoint() {
  const [location, setLocation] = useState<{ lat: number; lon: number; address: string } | null>(null);
  const [isGetting, setIsGetting] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  // Vérifier si le client a déjà un point enregistré
  useEffect(() => {
    // TODO: Charger depuis l'API
    const savedLocation = localStorage.getItem('pickupPoint');
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    }
  }, []);

  const getCurrentLocation = () => {
    setIsGetting(true);
    setError('');

    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur");
      setIsGetting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Obtenir l'adresse approximative (reverse geocoding)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          const newLocation = {
            lat: latitude,
            lon: longitude,
            address: data.display_name || 'Adresse non disponible'
          };
          
          setLocation(newLocation);
          setIsGetting(false);
        } catch (err) {
          setLocation({
            lat: latitude,
            lon: longitude,
            address: 'Adresse non disponible'
          });
          setIsGetting(false);
        }
      },
      () => {
        setError("Impossible d'obtenir votre position. Vérifiez vos paramètres de localisation.");
        setIsGetting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const saveLocation = () => {
    if (!location) return;
    
    // TODO: Sauvegarder via l'API
    localStorage.setItem('pickupPoint', JSON.stringify(location));
    setSaved(true);
    
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Mon point de retrait" 
            subtitle="Où souhaitez-vous recevoir vos repas ?"
          />

          {/* Instructions importantes */}
          <div style={{
            padding: '16px',
            background: '#FEF3C7',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            gap: '12px'
          }}>
            <AlertCircle size={24} color="#92400E" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '13px', color: '#92400E' }}>
              <strong>Important :</strong> Rendez-vous à l'endroit exact où vous voulez recevoir vos repas 
              (devant chez vous, votre bureau, etc.) avant d'enregistrer votre position.
            </div>
          </div>

          <Section title="Position actuelle">
            <div className="card">
              {!location ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <MapPin size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                  <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>
                    Aucune position enregistrée
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={getCurrentLocation}
                    disabled={isGetting}
                  >
                    <Navigation size={20} />
                    {isGetting ? 'Localisation en cours...' : 'Obtenir ma position'}
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
                      Coordonnées GPS
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'monospace' }}>
                      {location.lat.toFixed(6)}, {location.lon.toFixed(6)}
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
                      Adresse
                    </div>
                    <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
                      {location.address}
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps?q=${location.lat},${location.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ width: '100%', marginBottom: '8px', textDecoration: 'none' }}
                  >
                    <MapPin size={20} />
                    Voir sur Google Maps
                  </a>

                  <button 
                    className="btn btn-secondary"
                    onClick={getCurrentLocation}
                    disabled={isGetting}
                    style={{ width: '100%' }}
                  >
                    <Navigation size={20} />
                    Mettre à jour la position
                  </button>
                </>
              )}

              {error && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  background: '#FEE2E2',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#991B1B'
                }}>
                  {error}
                </div>
              )}
            </div>
          </Section>

          {location && (
            <button 
              className="btn btn-primary"
              onClick={saveLocation}
              style={{ position: 'relative' }}
            >
              {saved ? (
                <>
                  <Check size={20} />
                  Position enregistrée !
                </>
              ) : (
                <>
                  <MapPin size={20} />
                  Enregistrer ce point de retrait
                </>
              )}
            </button>
          )}

          {/* Note de renouvellement */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: '#D1FAE5',
            borderRadius: '12px',
            fontSize: '13px',
            color: '#065F46'
          }}>
            💡 Vous devrez confirmer ou modifier ce point à chaque renouvellement d'abonnement.
          </div>
        </div>
      </div>
    </AppShell>
  );
}
