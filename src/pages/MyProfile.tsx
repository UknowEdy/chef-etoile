import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { User, Save } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { Section } from '../components';
import { useAuth } from '../context/AuthContext';

export default function MyProfile() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || 'Jean Dupont',
    phone: '06 12 34 56 78',
    address: '12 Rue de la Cuisine'
  });
  const [photo, setPhoto] = useState<string>('');
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const photoKey = user?.email ? `profile_photo_${user.email}` : null;

  useEffect(() => {
    if (!photoKey) return;
    const stored = localStorage.getItem(photoKey);
    if (stored) setPhoto(stored);
  }, [photoKey]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaveStatus('idle');
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result as string);
      setSaveStatus('idle');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (photoKey && photo) {
      localStorage.setItem(photoKey, photo);
    }
    console.log('Sauvegarde du profil:', formData);
    setSaveStatus('saved');
  };

  return (
    <AppShell>
      <TopBar title="Mon Profil" showBack />
      <div className="page">
        <div className="page-content">
          
          <div className="profile-card">
            <div className="profile-avatar">
              {photo ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: `url(${photo}) center/cover`
                  }}
                />
              ) : (
                <User size={36} />
              )}
            </div>
            <p className="text-lg font-semibold">{user?.email}</p>
            <p className="text-sm text-gray-500 mt-1">Identifiant unique: {user?.chefSlug || 'N/A'}</p>
          </div>

          <Section title="Informations Personnelles">
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="label">Photo de profil</label>
                <input 
                  type="file"
                  accept="image/*"
                  className="input"
                  onChange={handlePhotoUpload}
                />
              </div>
              
              <div className="form-group">
                <label className="label">Nom complet</label>
                <input 
                  type="text"
                  name="name"
                  className="input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Téléphone</label>
                <input 
                  type="tel"
                  name="phone"
                  className="input"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Adresse par défaut</label>
                <input 
                  type="text"
                  name="address"
                  className="input"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <button 
                type="submit" 
                className={`btn ${saveStatus === 'saved' ? 'btn-success' : 'btn-primary'}`}
                disabled={saveStatus === 'saved'}
              >
                <Save size={20} />
                {saveStatus === 'saved' ? '✅ Enregistré' : 'Enregistrer les modifications'}
              </button>
            </form>
          </Section>
          
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
