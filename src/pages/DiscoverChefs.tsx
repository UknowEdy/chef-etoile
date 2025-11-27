import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Users } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import { PageTitle } from '../components';
import BottomNav from '../components/BottomNav';

interface Chef {
  id: string;
  name: string;
  slug: string;
  quartier: string;
  distance: number;
  rating: number;
  totalRatings: number;
  subscribers: number;
  rankingScore: number;
}

export default function DiscoverChefs() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserLocationAndChefs();
  }, []);

  const getUserLocationAndChefs = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          setUserLocation(location);
          loadNearbyChefs(location);
        },
        (error) => {
          console.error('Erreur géolocalisation:', error);
          loadNearbyChefs(null);
        }
      );
    } else {
      loadNearbyChefs(null);
    }
  };

  const loadNearbyChefs = (location: { lat: number; lon: number } | null) => {
    // Données de test (à remplacer par API)
    const mockChefs: Chef[] = [
      { 
        id: '1', 
        name: 'Chef Kodjo', 
        slug: 'kodjo',
        quartier: 'Tokoin', 
        distance: 2.3,
        rating: 4.8,
        totalRatings: 127,
        subscribers: 24,
        rankingScore: 0
      },
      { 
        id: '2', 
        name: 'Chef Anna', 
        slug: 'anna',
        quartier: 'Bè', 
        distance: 4.1,
        rating: 4.9,
        totalRatings: 203,
        subscribers: 18,
        rankingScore: 0
      },
      { 
        id: '3', 
        name: 'Chef Gloria', 
        slug: 'gloria',
        quartier: 'Hèdzranawoé', 
        distance: 5.8,
        rating: 4.7,
        totalRatings: 89,
        subscribers: 31,
        rankingScore: 0
      },
      { 
        id: '4', 
        name: 'Chef Yao', 
        slug: 'yao',
        quartier: 'Adidogomé', 
        distance: 7.2,
        rating: 4.6,
        totalRatings: 156,
        subscribers: 15,
        rankingScore: 0
      },
      { 
        id: '5', 
        name: 'Chef Ama', 
        slug: 'ama',
        quartier: 'Nyékonakpoè', 
        distance: 8.5,
        rating: 4.5,
        totalRatings: 67,
        subscribers: 22,
        rankingScore: 0
      }
    ];

    // ALGORITHME DE RANKING
    // Score = (Rating × 30%) + (TotalRatings × 0.01 × 30%) + (Subscribers × 0.1 × 20%) - (Distance × 2%)
    const rankedChefs = mockChefs
      .filter(chef => chef.distance <= 15)
      .map(chef => ({
        ...chef,
        rankingScore: 
          chef.rating * 0.30 +
          chef.totalRatings * 0.01 * 0.30 +
          chef.subscribers * 0.1 * 0.20 -
          chef.distance * 0.02
      }))
      .sort((a, b) => b.rankingScore - a.rankingScore)
      .slice(0, 5);

    setChefs(rankedChefs);
    setLoading(false);
  };

  return (
    <AppShell>
      <TopBar showLogo={true} />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Découvrir les Chefs★" 
            subtitle="Les meilleurs chefs près de chez vous"
          />

          {/* Info ranking */}
          <div style={{
            padding: '12px',
            background: '#FEF3C7',
            borderRadius: '12px',
            marginBottom: '24px',
            fontSize: '13px',
            color: '#92400E'
          }}>
            ⭐ <strong>Top 5 uniquement</strong> - Classés par note, nombre d'avis et proximité
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>
              Recherche des meilleurs chefs...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {chefs.map((chef, index) => (
                <div 
                  key={chef.id}
                  className="card"
                  onClick={() => navigate(`/chefs/${chef.slug}`)}
                  style={{ cursor: 'pointer', position: 'relative' }}
                >
                  {/* Badge ranking */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: index === 0 ? '#D4AF37' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#E5E7EB',
                    color: index < 3 ? 'white' : '#6B7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '16px'
                  }}>
                    {index + 1}
                  </div>

                  <div style={{ marginLeft: '40px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                      {chef.name}
                    </div>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <Star size={16} fill="#D4AF37" color="#D4AF37" />
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>
                        {chef.rating.toFixed(1)}
                      </span>
                      <span style={{ fontSize: '13px', color: '#6B7280' }}>
                        ({chef.totalRatings} avis)
                      </span>
                    </div>

                    {/* Abonnés */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                      <Users size={14} />
                      {chef.subscribers} abonnés
                    </div>

                    {/* Distance */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6B7280' }}>
                      <MapPin size={14} />
                      {chef.quartier} · {chef.distance} km
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Note pédagogique */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#D1FAE5',
            borderRadius: '12px',
            fontSize: '13px',
            color: '#065F46'
          }}>
            💡 Seuls les <strong>5 meilleurs Chefs★</strong> de votre zone apparaissent. 
            Plus un chef a de bonnes notes et d'abonnés, plus il est visible !
          </div>
        </div>
      </div>
          <BottomNav />
    </AppShell>
  );
}
