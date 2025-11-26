import { useState } from 'react';
import { MapPin } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { PageTitle, ChefCard, EmptyState, Loader } from '../components';

export default function Find() {
  const [loading, setLoading] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [chefs, setChefs] = useState<any[]>([]);

  const handleLocationRequest = async () => {
    setLoading(true);
    // Simulation de la géolocalisation
    setTimeout(() => {
      setLocationGranted(true);
      // Mock data
      setChefs([
        { slug: 'kodjo', name: 'Chef Kodjo', location: 'Tokoin', distance: '2.3 km' },
        { slug: 'anna', name: 'Chef Anna', location: 'Bè', distance: '4.1 km' },
        { slug: 'gloria', name: 'Chef Gloria', location: 'Hédzranawoé', distance: '6.8 km' }
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Chefs★ près de vous" 
            subtitle="Trouvez les meilleurs chefs dans un rayon de 10 km"
          />

          {!locationGranted && !loading && (
            <div style={{ marginTop: '32px' }}>
              <button className="btn btn-primary" onClick={handleLocationRequest}>
                <MapPin size={20} />
                Autoriser la localisation
              </button>
              <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '13px', color: '#6B7280' }}>
                Nous avons besoin de votre position pour trouver les Chefs★ autour de vous
              </div>
            </div>
          )}

          {loading && <Loader />}

          {locationGranted && !loading && chefs.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              {chefs.map((chef) => (
                <ChefCard key={chef.slug} {...chef} />
              ))}
            </div>
          )}

          {locationGranted && !loading && chefs.length === 0 && (
            <EmptyState
              icon={<MapPin size={48} />}
              title="Aucun Chef★ trouvé"
              description="Il n'y a pas encore de Chef★ dans votre secteur"
            />
          )}
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
