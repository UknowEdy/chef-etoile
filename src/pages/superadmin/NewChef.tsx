import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle, Section } from '../../components';

export default function SuperAdminNewChef() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    email: '',
    phone: '',
    address: '',
    quartier: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Chef★ "${formData.name}" créé !`);
    navigate('/superadmin/chefs');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Auto-générer le slug depuis le nom
    if (name === 'name' && !formData.slug) {
      const slug = value.toLowerCase()
        .replace(/chef\s*/gi, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Créer un Chef★" 
            subtitle="Ajoutez un nouveau Chef★ à la plateforme"
          />

          <form onSubmit={handleSubmit}>
            <Section title="Informations du Chef★">
              <div className="card">
                <label className="label">Nom du Chef★</label>
                <input 
                  type="text"
                  name="name"
                  className="input"
                  placeholder="Ex: Chef Kodjo"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <label className="label">Slug (URL)</label>
                <input 
                  type="text"
                  name="slug"
                  className="input"
                  placeholder="Ex: kodjo"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                />
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '-8px', marginBottom: '12px' }}>
                  L'URL sera : chefetoile.com/{formData.slug || 'slug'}
                </div>

                <label className="label">Email</label>
                <input 
                  type="email"
                  name="email"
                  className="input"
                  placeholder="chef@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <label className="label">Téléphone WhatsApp</label>
                <input 
                  type="tel"
                  name="phone"
                  className="input"
                  placeholder="+228 90 12 34 56"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </Section>

            <Section title="Localisation">
              <div className="card">
                <label className="label">Quartier</label>
                <input 
                  type="text"
                  name="quartier"
                  className="input"
                  placeholder="Ex: Tokoin"
                  value={formData.quartier}
                  onChange={handleChange}
                  required
                />

                <label className="label">Adresse complète</label>
                <input 
                  type="text"
                  name="address"
                  className="input"
                  placeholder="Rue et numéro"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </Section>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/superadmin/chefs')}
              >
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                Créer le Chef★
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
