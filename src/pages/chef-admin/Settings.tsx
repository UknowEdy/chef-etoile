import { useEffect, useState, ChangeEvent } from 'react';
import { Save } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import ChefBottomNav from '../../components/ChefBottomNav';
import { PageTitle, Section } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../utils/storage';

export default function ChefAdminSettings() {
  const { user } = useAuth();
  const chefSlug = user?.chefSlug || 'kodjo';
  const [settings, setSettings] = useState({
    prixMidi: '7500',
    prixSoir: '7500',
    prixComplet: '14000',
    joursService: {
      lundi: true,
      mardi: true,
      mercredi: true,
      jeudi: true,
      vendredi: true,
      samedi: true,
      dimanche: false
    },
    rayonLivraison: '10',
    telephone: '+228 90 12 34 56',
    adresse: 'Tokoin, Lomé',
    horairesLivraison: '11h30-13h00 / 18h30-20h00'
  });
  const [photo, setPhoto] = useState<string>('');

  useEffect(() => {
    if (!chefSlug) return;
    const stored = StorageService.getChefPhoto(chefSlug);
    if (stored) setPhoto(stored);
  }, [chefSlug]);

  const handleSave = () => {
    if (chefSlug && photo) {
      StorageService.saveChefPhoto(chefSlug, photo);
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

  const joursTotal = Object.values(settings.joursService).filter(Boolean).length;

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

          <Section title="Tarifs d'abonnement">
            <div className="card">
              <label className="label">Formule Midi (par semaine)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <input 
                  type="number"
                  className="input"
                  value={settings.prixMidi}
                  onChange={(e) => setSettings({ ...settings, prixMidi: e.target.value })}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '14px', color: '#6B7280' }}>F CFA</span>
              </div>

              <label className="label">Formule Soir (par semaine)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <input 
                  type="number"
                  className="input"
                  value={settings.prixSoir}
                  onChange={(e) => setSettings({ ...settings, prixSoir: e.target.value })}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '14px', color: '#6B7280' }}>F CFA</span>
              </div>

              <label className="label">Formule Complète (par semaine)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="number"
                  className="input"
                  value={settings.prixComplet}
                  onChange={(e) => setSettings({ ...settings, prixComplet: e.target.value })}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '14px', color: '#6B7280' }}>F CFA</span>
              </div>
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
                  <span style={{ 
                    fontSize: '15px', 
                    fontWeight: 500,
                    textTransform: 'capitalize'
                  }}>
                    {jour}
                  </span>
                </label>
              ))}
            </div>
            <div style={{ 
              marginTop: '8px', 
              fontSize: '13px', 
              color: '#6B7280' 
            }}>
              💡 Les clients verront ces jours dans vos formules
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
