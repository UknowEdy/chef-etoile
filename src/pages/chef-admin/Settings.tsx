import { useEffect, useState, ChangeEvent } from 'react';
import { Save } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import ChefBottomNav from '../../components/ChefBottomNav';
import { PageTitle, Section } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { StorageService, ChefPlan } from '../../utils/storage';

export default function ChefAdminSettings() {
  const { user } = useAuth();
  const chefSlug = user?.chefSlug || 'kodjo';
  const [plans, setPlans] = useState<ChefPlan[]>([]);
  const [settings, setSettings] = useState({
    rayonLivraison: '10',
    telephone: '+228 90 12 34 56',
    adresse: 'Tokoin, Lomé',
    horairesLivraison: '11h30-13h00 / 18h30-20h00'
  });
  const [photo, setPhoto] = useState<string>('');

  useEffect(() => {
    if (!chefSlug) return;
    const storedPhoto = StorageService.getChefPhoto(chefSlug);
    if (storedPhoto) setPhoto(storedPhoto);
    setPlans(StorageService.getChefPlans(chefSlug));
  }, [chefSlug]);

  const handleSave = () => {
    if (chefSlug) {
      if (photo) StorageService.saveChefPhoto(chefSlug, photo);
      StorageService.saveChefPlans(chefSlug, plans);
    }
    alert('Paramètres sauvegardés !');
  };

  const handleJourChange = (jour: string, checked: boolean) => {
    setSettings({
      ...settings,
      joursService: { ...settings.joursService, [jour]: checked }
    });
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const joursTotal = plans.reduce((sum, p) => sum + p.days.length, 0);
  const togglePlanActive = (planId: ChefPlan['id'], active: boolean) => {
    setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, active } : p)));
  };

  const updatePlanPrice = (planId: ChefPlan['id'], price: string) => {
    setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, price } : p)));
  };

  const toggleDay = (planId: ChefPlan['id'], day: string, checked: boolean) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === planId
          ? {
              ...p,
              days: checked ? Array.from(new Set([...p.days, day])) : p.days.filter((d) => d !== day)
            }
          : p
      )
    );
  };

  const selectAllDays = (planId: ChefPlan['id']) => {
    const allDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, days: allDays } : p)));
  };

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Paramètres" 
            subtitle="Configurez vos tarifs et jours de service"
          />

          <Section title="Photo de profil">
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: photo ? `url(${photo}) center/cover` : '#F3F4F6',
                  border: '1px solid #E5E7EB'
                }}
              />
              <div style={{ flex: 1 }}>
                <label className="label">Mettre à jour votre photo</label>
                <input 
                  type="file"
                  accept="image/*"
                  className="input"
                  onChange={handlePhotoUpload}
                />
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                  Visible par les clients dans les recherches et votre profil.
                </div>
              </div>
            </div>
          </Section>

          <Section title="Formules & jours">
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {plans.map((plan) => (
                <div key={plan.id} style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 700 }}>{plan.name}</div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6B7280' }}>
                      <input
                        type="checkbox"
                        checked={plan.active}
                        onChange={(e) => togglePlanActive(plan.id, e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#D4AF37' }}
                      />
                      Activer
                    </label>
                  </div>

                  <label className="label">Prix (par semaine)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <input
                      type="number"
                      className="input"
                      value={plan.price}
                      onChange={(e) => updatePlanPrice(plan.id, e.target.value)}
                      style={{ flex: 1, opacity: plan.active ? 1 : 0.5 }}
                      disabled={!plan.active}
                    />
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>F CFA</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>Jours proposés</div>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '12px', opacity: plan.active ? 1 : 0.5 }}
                      onClick={() => selectAllDays(plan.id)}
                      disabled={!plan.active}
                    >
                      Tous les jours
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', opacity: plan.active ? 1 : 0.5, pointerEvents: plan.active ? 'auto' : 'none' }}>
                    {['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'].map((day) => (
                      <label key={day} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', textTransform: 'capitalize' }}>
                        <input
                          type="checkbox"
                          checked={plan.days.includes(day)}
                          onChange={(e) => toggleDay(plan.id, day, e.target.checked)}
                          style={{ width: '16px', height: '16px', accentColor: '#D4AF37' }}
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#6B7280' }}>
              💡 Activez les formules et cochez les jours disponibles. Le client les verra sur votre profil.
            </div>
          </Section>

          <Section title="Livraison">
            <div className="card">
              <label className="label">Rayon de livraison (km)</label>
              <input 
                type="number"
                className="input"
                value={settings.rayonLivraison}
                onChange={(e) => setSettings({ ...settings, rayonLivraison: e.target.value })}
                max="15"
                min="1"
              />
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '-8px', marginBottom: '12px' }}>
                Maximum 15 km
              </div>

              <label className="label">Horaires de livraison</label>
              <input 
                type="text"
                className="input"
                value={settings.horairesLivraison}
                onChange={(e) => setSettings({ ...settings, horairesLivraison: e.target.value })}
                placeholder="Ex: 11h30-13h00 / 18h30-20h00"
              />
            </div>
          </Section>

          <Section title="Informations de contact">
            <div className="card">
              <label className="label">Téléphone WhatsApp</label>
              <input 
                type="tel"
                className="input"
                value={settings.telephone}
                onChange={(e) => setSettings({ ...settings, telephone: e.target.value })}
              />

              <label className="label">Adresse de préparation</label>
              <input 
                type="text"
                className="input"
                value={settings.adresse}
                onChange={(e) => setSettings({ ...settings, adresse: e.target.value })}
              />
            </div>
          </Section>

          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={20} />
            Sauvegarder les paramètres
          </button>

          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            background: '#FEF3C7', 
            borderRadius: '12px',
            fontSize: '13px',
            color: '#92400E'
          }}>
            ⚠️ Les modifications de tarifs s'appliqueront aux nouveaux abonnements uniquement
          </div>
        </div>
      </div>
      <ChefBottomNav />
    </AppShell>
  );
}
