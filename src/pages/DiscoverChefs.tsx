import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Users, Filter } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import { PageTitle } from '../components';
import BottomNav from '../components/BottomNav';
import { StorageService } from '../utils/storage';

interface Chef {
  id: string;
  name: string;
  slug: string;
  quartier: string;
  distance: number;
  rating: number;
  totalRatings: number;
  subscribers: number;
}

const MOCK_CHEFS_DATA: Chef[] = [
  { 
    id: '1', 
    name: 'Chef Kodjo', 
    slug: 'kodjo',
    quartier: 'Tokoin', 
    distance: 2.3,
    rating: 4.8,
    totalRatings: 127,
    subscribers: 24
  },
  { 
    id: '2', 
    name: 'Chef Anna', 
    slug: 'anna',
    quartier: 'Bè', 
    distance: 4.1,
    rating: 4.9,
    totalRatings: 203,
    subscribers: 18
  },
  { 
    id: '3', 
    name: 'Chef Gloria', 
    slug: 'gloria',
    quartier: 'Hèdzranawoé', 
    distance: 5.8,
    rating: 4.7,
    totalRatings: 89,
    subscribers: 31
  },
  { 
    id: '4', 
    name: 'Chef Yao', 
    slug: 'yao',
    quartier: 'Adidogomé', 
    distance: 7.2,
    rating: 4.6,
    totalRatings: 156,
    subscribers: 15
  },
  { 
    id: '5', 
    name: 'Chef Ama', 
    slug: 'ama',
    quartier: 'Nyékonakpoè', 
    distance: 8.5,
    rating: 4.5,
    totalRatings: 67,
    subscribers: 22
  },
  { 
    id: '6', 
    name: 'Chef Pierre', 
    slug: 'pierre',
    quartier: 'Agoè', 
    distance: 12.5,
    rating: 4.4,
    totalRatings: 45,
    subscribers: 10
  },
  { 
    id: '7', 
    name: 'Chef Sarah', 
    slug: 'sarah',
    quartier: 'Baguida', 
    distance: 18.2,
    rating: 4.9,
    totalRatings: 12,
    subscribers: 5
  }
];

export default function DiscoverChefs() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [searchRadius, setSearchRadius] = useState<number>(20);

  useEffect(() => {
    getUserLocationAndPhotos();
  }, []);

  const getUserLocationAndPhotos = async () => {
    const photoMap: Record<string, string> = {};
    MOCK_CHEFS_DATA.forEach((chef) => {
      const stored = StorageService.getChefPhoto(chef.slug);
      if (stored) photoMap[chef.slug] = stored;
    });
    setPhotos(photoMap);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          setLoading(false);
        },
        (error) => {
          console.error('Erreur géolocalisation:', error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  };

  const filteredChefs = useMemo(() => {
    return MOCK_CHEFS_DATA
      .filter((chef) => chef.distance <= searchRadius)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }, [searchRadius]);

  const radiusOptions = [5, 10, 15, 20];

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Découvrir les Chefs★" 
            subtitle="Les meilleurs chefs près de chez vous"
          />

          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '12px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              <Filter size={16} />
              Rayon de recherche :
            </div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {radiusOptions.map((km) => (
                <button
                  key={km}
                  onClick={() => setSearchRadius(km)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '600',
                    backgroundColor: searchRadius === km ? '#D4AF37' : '#E5E7EB',
                    color: searchRadius === km ? 'white' : '#4B5563',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {km} km
                </button>
              ))}
            </div>
          </div>

          {/* Info ranking */}
          <div style={{
            padding: '12px',
            background: '#FEF3C7',
            borderRadius: '12px',
            marginBottom: '24px',
            fontSize: '13px',
            color: '#92400E'
          }}>
            ⭐ <strong>Top 5</strong> des chefs classés par note et proximité à moins de <strong>{searchRadius} km</strong>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>
              Recherche des meilleurs chefs...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredChefs.map((chef, index) => (
                <div 
                  key={chef.id}
                  className="card"
                  onClick={() => navigate(`/chefs/${chef.slug}`)}
                  style={{ cursor: 'pointer', position: 'relative', display: 'flex', gap: '12px', alignItems: 'center' }}
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

                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: photos[chef.slug]
                        ? `url(${photos[chef.slug]}) center/cover`
                        : 'url(/images/chef-etoile-logo.png) center/cover',
                      border: '1px solid #E5E7EB',
                      marginLeft: '44px'
                    }}
                  />

                  <div style={{ marginLeft: '12px', flex: 1 }}>
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
