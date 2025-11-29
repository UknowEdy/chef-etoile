import { useEffect, useState, ChangeEvent } from 'react';
import { Ban, CheckCircle, Loader2, Check } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import SuperAdminBottomNav from '../../components/SuperAdminBottomNav';
import { PageTitle, Section } from '../../components';
import { StorageService, ChefSettings, ChefProfileData } from '../../utils/storage';

const CHEF_SLUG_MOCK = 'kodjo';

export default function SuperAdminChefConfig() {
  const chefSlug = CHEF_SLUG_MOCK;

  const [chefProfile, setChefProfile] = useState<ChefProfileData | null>(null);
  const [settings, setSettings] = useState<ChefSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!chefSlug) {
      setLoading(false);
      return;
    }
    const profile = StorageService.getChefBySlug(chefSlug);
    setChefProfile(profile);
    setSettings(StorageService.getChefSettings(chefSlug));
    const storedPhoto = StorageService.getChefPhoto(chefSlug);
    if (storedPhoto) setPhoto(storedPhoto);
    setLoading(false);
  }, [chefSlug]);

  const updateAndSaveSettings = (newSettings: ChefSettings) => {
    setSettings(newSettings);
    setIsSaving(true);
    StorageService.saveChefSettings(chefSlug, newSettings);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 400);
  };

  const handleSuspensionToggle = (isActive: boolean) => {
    if (!chefProfile) return;
    const newIsSuspended = !isActive;
    const updatedProfile = { ...chefProfile, isSuspended: newIsSuspended };
    setChefProfile(updatedProfile);
    StorageService.saveChefProfile(updatedProfile);
    if (newIsSuspended) alert(`⛔ ${chefProfile.name} est maintenant SUSPENDU.`);
    else alert(`✅ ${chefProfile.name} est maintenant RÉACTIVÉ.`);
  };

  const handleMealToggle = (mealType: 'isMidiActive' | 'isSoirActive', checked: boolean) => {
    if (!settings) return;
    updateAndSaveSettings({ ...settings, [mealType]: checked });
  };

  const handleSettingsChange = (field: keyof ChefSettings, value: string) => {
    if (!settings) return;
    updateAndSaveSettings({ ...settings, [field]: value });
  };

  const handleJourChange = (jour: string, checked: boolean) => {
    if (!settings) return;
    updateAndSaveSettings({
      ...settings,
      joursService: { ...settings.joursService, [jour]: checked }
    });
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setPhoto(dataUrl);
      StorageService.saveChefPhoto(chefSlug, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  if (loading || !chefProfile || !settings) {
    return (
      <AppShell>
        <TopBar title="Superadmin" showBack />
        <div className="page" style={{ padding: '40px', textAlign: 'center' }}>
          Chargement...
        </div>
        <SuperAdminBottomNav />
      </AppShell>
    );
  }

  const isAccountActive = !chefProfile.isSuspended;
  const joursTotal = Object.values(settings.joursService).filter(Boolean).length;

  return (
    <AppShell>
      <TopBar title="Superadmin" showBack />
      <div className="page" style={{ paddingBottom: '80px' }}>
        <div className="page-content">
          <PageTitle
            title={`Configuration de ${chefProfile.name}`}
            subtitle="Toutes les modifications sont enregistrées automatiquement"
          />

          <div
            style={{
              position: 'fixed',
              top: '64px',
              right: '16px',
              zIndex: 50,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '4px 12px',
              borderRadius: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#059669',
              opacity: lastSaved || isSaving ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none'
            }}
          >
            {isSaving ? (
              <>
                <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Enregistrement...
              </>
            ) : (
              lastSaved && (
                <>
                  <Check size={12} /> Sauvegardé
                </>
              )
            )}
          </div>

          <Section title="Statut du compte">
            <div
              className="card"
              style={{
                backgroundColor: isAccountActive ? '#D1FAE5' : '#FEE2E2',
                border: `2px solid ${isAccountActive ? '#059669' : '#EF4444'}`,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {isAccountActive ? (
                    <CheckCircle size={28} color="#059669" />
                  ) : (
                    <Ban size={28} color="#EF4444" />
                  )}
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: isAccountActive ? '#059669' : '#EF4444' }}>
                      {isAccountActive ? 'Compte Actif' : 'Compte Suspendu'}
                    </div>
                    <div style={{ fontSize: '13px', color: '#4B5563', marginTop: '2px' }}>
                      {isAccountActive ? 'Accès autorisé' : 'Accès bloqué'}
                    </div>
                  </div>
                </div>

                <div
                  className="switch"
                  onClick={() => handleSuspensionToggle(!isAccountActive)}
                  style={{ pointerEvents: 'auto' }}
                >
                  <input type="checkbox" checked={isAccountActive} readOnly style={{ pointerEvents: 'none' }} />
                  <span className="slider round" style={{ pointerEvents: 'none' }} />
                </div>
              </div>
            </div>
          </Section>

          <Section title="Photo de profil (lecture seule)">
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
                <label className="label">Nom du chef</label>
                <div style={{ fontWeight: 600 }}>{chefProfile.name}</div>
              </div>
              <input type="file" accept="image/*" className="input" onChange={handlePhotoUpload} />
            </div>
          </Section>

          <Section title="Tarifs et Activation">
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label className="label" style={{ marginBottom: 0 }}>
                  Formule Déjeuner
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: settings.isMidiActive ? '#D4AF37' : '#9CA3AF' }}>
                    {settings.isMidiActive ? 'ON' : 'OFF'}
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.isMidiActive}
                    onChange={(e) => handleMealToggle('isMidiActive', e.target.checked)}
                    style={{ accentColor: '#D4AF37', transform: 'scale(1.2)' }}
                  />
                </label>
              </div>
              <input
                type="number"
                className="input"
                value={settings.prixMidi}
                onChange={(e) => handleSettingsChange('prixMidi', e.target.value)}
                disabled={!settings.isMidiActive}
                style={{ opacity: settings.isMidiActive ? 1 : 0.5 }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', marginBottom: '12px' }}>
                <label className="label" style={{ marginBottom: 0 }}>
                  Formule Dîner
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: settings.isSoirActive ? '#D4AF37' : '#9CA3AF' }}>
                    {settings.isSoirActive ? 'ON' : 'OFF'}
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.isSoirActive}
                    onChange={(e) => handleMealToggle('isSoirActive', e.target.checked)}
                    style={{ accentColor: '#D4AF37', transform: 'scale(1.2)' }}
                  />
                </label>
              </div>
              <input
                type="number"
                className="input"
                value={settings.prixSoir}
                onChange={(e) => handleSettingsChange('prixSoir', e.target.value)}
                disabled={!settings.isSoirActive}
                style={{ opacity: settings.isSoirActive ? 1 : 0.5 }}
              />

              <label className="label" style={{ marginTop: '16px' }}>
                Formule Complète
              </label>
              <input
                type="number"
                className="input"
                value={settings.prixComplet}
                onChange={(e) => handleSettingsChange('prixComplet', e.target.value)}
              />
            </div>
          </Section>

          <Section title={`Jours de service (${joursTotal}/7)`}>
            <div className="card">
              {Object.entries(settings.joursService).map(([jour, actif]) => (
                <label
                  key={jour}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: '1px solid #E5E7EB',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={actif}
                    onChange={(e) => handleJourChange(jour, e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      marginRight: '12px',
                      cursor: 'pointer',
                      accentColor: '#D4AF37'
                    }}
                  />
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      textTransform: 'capitalize'
                    }}
                  >
                    {jour}
                  </span>
                </label>
              ))}
            </div>
          </Section>

          <Section title="Livraison & Contact">
            <div className="card">
              <label className="label">Rayon de livraison (km)</label>
              <input
                type="number"
                className="input"
                value={settings.rayonLivraison}
                onChange={(e) => handleSettingsChange('rayonLivraison', e.target.value)}
              />

              <label className="label">Horaires de livraison</label>
              <input
                type="text"
                className="input"
                value={settings.horairesLivraison}
                onChange={(e) => handleSettingsChange('horairesLivraison', e.target.value)}
              />

              <label className="label">Téléphone WhatsApp</label>
              <input
                type="tel"
                className="input"
                value={settings.telephone}
                onChange={(e) => handleSettingsChange('telephone', e.target.value)}
              />

              <label className="label">Adresse de préparation</label>
              <input
                type="text"
                className="input"
                value={settings.adresse}
                onChange={(e) => handleSettingsChange('adresse', e.target.value)}
              />
            </div>
          </Section>

          <div style={{ textAlign: 'center', marginTop: '24px', color: '#9CA3AF', fontSize: '13px' }}>
            Toutes les modifications sont enregistrées automatiquement.
          </div>
        </div>
      </div>
      <SuperAdminBottomNav />
    </AppShell>
  );
}
