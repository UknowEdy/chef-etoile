import { useState } from 'react';
import { Camera, User, Phone, MapPin, Mail } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { PageTitle, Section } from '../components';

export default function MyProfile() {
  const [profile, setProfile] = useState({
    name: 'Jean Dupont',
    phone: '+228 90 12 34 56',
    email: 'jean.dupont@email.com',
    address: 'Tokoin, Lomé',
    photo: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // TODO: Save to backend
    setIsEditing(false);
    alert('Profil mis à jour !');
  };

  return (
    <AppShell>
      <TopBar showLogo={true} />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Mon Profil" 
            subtitle="Gérez vos informations personnelles"
          />

          {/* Photo de profil */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ 
              position: 'relative', 
              display: 'inline-block',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: profile.photo ? `url(${profile.photo}) center/cover` : '#E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                border: '4px solid #D4AF37'
              }}>
                {!profile.photo && <User size={48} color="#6B7280" />}
              </div>
              
              <label 
                htmlFor="photo-upload"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  background: '#D4AF37',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '3px solid white'
                }}
              >
                <Camera size={18} color="#111827" />
              </label>
              <input 
                id="photo-upload"
                type="file" 
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>
              {profile.name}
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>
              Client Chef★
            </div>
          </div>

          <Section title="Informations personnelles">
            <div className="card">
              {/* Nom */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px', display: 'block' }}>
                  <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Nom complet
                </label>
                {isEditing ? (
                  <input 
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '15px', fontWeight: '600' }}>{profile.name}</div>
                )}
              </div>

              {/* Téléphone */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px', display: 'block' }}>
                  <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Téléphone
                </label>
                {isEditing ? (
                  <input 
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '15px', fontWeight: '600' }}>{profile.phone}</div>
                )}
              </div>

              {/* Email */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px', display: 'block' }}>
                  <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Email
                </label>
                {isEditing ? (
                  <input 
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '15px', fontWeight: '600' }}>{profile.email}</div>
                )}
              </div>

              {/* Adresse */}
              <div>
                <label style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px', display: 'block' }}>
                  <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Adresse
                </label>
                {isEditing ? (
                  <input 
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '15px', fontWeight: '600' }}>{profile.address}</div>
                )}
              </div>
            </div>
          </Section>

          {isEditing ? (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
                style={{ flex: 1 }}
              >
                Annuler
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSave}
                style={{ flex: 1 }}
              >
                Enregistrer
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Modifier mon profil
            </button>
          )}
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}
