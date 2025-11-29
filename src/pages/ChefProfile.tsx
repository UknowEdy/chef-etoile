import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MessageCircle, Star, MapPin, Utensils, Zap, Calendar } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { Section, EmptyState } from '../components';
import { StorageService, ChefProfileData, ChefRatingStats, DayMenu, ChefPlan } from '../utils/storage';

const MAX_PLATS_AFFICHES = 3;

interface MenuPreviewItem {
  day: string;
  time: 'Midi' | 'Soir';
  dish: string;
}

export default function ChefProfile() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [chef, setChef] = useState<ChefProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuPreview, setMenuPreview] = useState<MenuPreviewItem[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [ratingStats, setRatingStats] = useState<ChefRatingStats>({ average: 0, count: 0 });
  const [plans, setPlans] = useState<ChefPlan[]>([]);

  const effectiveSlug = slug || StorageService.getChefBySlug('kodjo')?.slug || 'kodjo';

  useEffect(() => {
    const profile = StorageService.getChefBySlug(effectiveSlug);
    setChef(profile);

    const storedPhoto = StorageService.getChefPhoto(effectiveSlug);
    if (storedPhoto) setPhoto(storedPhoto);

    if (profile) {
      const fullMenu: DayMenu[] = StorageService.getMenu(profile.slug);
      const stats = StorageService.getChefRatingStats(profile.slug);
      setRatingStats(stats);
      setPlans(StorageService.getChefPlans(profile.slug).filter((p) => p.active));
      const preview = fullMenu
        .filter((day) => !day.isAbsent && (day.midi || day.soir))
        .flatMap((day) => [
          { day: day.day, time: 'Midi' as const, dish: day.midi },
          { day: day.day, time: 'Soir' as const, dish: day.soir }
        ])
        .filter((item) => item.dish && item.dish.trim().length > 0)
        .slice(0, MAX_PLATS_AFFICHES);

      setMenuPreview(preview);
    }

    setLoading(false);
  }, [effectiveSlug]);

  const deliveryStatus = useMemo(() => 'En cuisine 🧑‍🍳', []);

  if (loading) {
    return (
      <AppShell>
        <TopBar showLogo showBack />
        <div className="page page-content">Chargement...</div>
        <BottomNav />
      </AppShell>
    );
  }

  if (!chef) {
    return (
      <AppShell>
        <TopBar showLogo showBack />
        <div className="page page-content">
          <EmptyState title="Chef introuvable" description="Ce chef n'est pas encore enregistré." />
        </div>
        <BottomNav />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar showLogo showBack />
      <div className="page">
        <div className="page-content">
          <div className="profile-card" style={{ marginBottom: '24px' }}>
            <div
              className="profile-avatar"
              style={{
                width: '100px',
                height: '100px',
                fontSize: '40px',
                background: photo ? `url(${photo}) center/cover` : undefined
              }}
            >
              {!photo && '👨‍🍳'}
            </div>
            <h1 className="text-2xl font-bold mt-2">{chef.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{chef.bio}</p>

            <div style={{ display: 'flex', gap: '15px', marginTop: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="badge" style={{ backgroundColor: '#FBBF24', color: 'white' }}>
                <Star size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {ratingStats.average.toFixed(1)}/5 ({ratingStats.count} vote{ratingStats.count > 1 ? 's' : ''})
              </span>
              <span className="badge" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
                <Utensils size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {chef.cuisineType}
              </span>
            </div>

            <div style={{ marginTop: '10px', fontSize: '14px', color: '#6B7280' }}>
              <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {chef.location}
            </div>

            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '15px', marginTop: '15px', width: '100%', textAlign: 'center' }}>
              <span style={{ fontWeight: '600', color: '#10B981', fontSize: '13px' }}>
                <Zap size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Statut actuel : {deliveryStatus}
              </span>
            </div>
          </div>

          <Section title="Formules disponibles">
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {plans.length === 0 && <div style={{ fontSize: '13px', color: '#6B7280' }}>Aucune formule active.</div>}
              {plans.map((plan) => (
                <div key={plan.id} style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 700 }}>{plan.name}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#D4AF37' }}>{plan.price} F</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280' }}>
                    <Calendar size={14} />
                    Jours : {plan.days.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Aperçu du Menu">
            <div className="card" style={{ padding: '16px', border: '1px solid #E5E7EB' }}>
              {menuPreview.length > 0 ? (
                menuPreview.map((item, index) => (
                  <div
                    key={`${item.day}-${item.time}-${index}`}
                    style={{
                      padding: '8px 0',
                      borderBottom: index < menuPreview.length - 1 ? '1px solid #F3F4F6' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '14px'
                    }}
                  >
                    <span style={{ fontWeight: '600' }}>{item.dish}</span>
                    <span style={{ color: '#6B7280' }}>
                      {item.day} ({item.time})
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Menu non disponible cette semaine.</p>
              )}
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/chefs/${chef.slug}/menu`)}
              style={{ marginTop: '16px' }}
            >
              Voir le menu complet
            </button>
          </Section>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              className="btn btn-whatsapp"
              style={{ flex: 1 }}
              onClick={() => {
                const phoneClean = (chef.phone || '').replace(/\s/g, '');
                const message = `Bonjour ${chef.name} !`;
                if (phoneClean) {
                  window.open(`https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`, '_blank');
                }
              }}
            >
              <MessageCircle size={20} />
              Contacter le Chef
            </button>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => navigate(`/chefs/${chef.slug}/subscribe`)}
            >
              S'abonner à {chef.name}
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
