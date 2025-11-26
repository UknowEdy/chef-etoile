import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { PageTitle } from '../../components';

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
    // Mock creation
    navigate('/superadmin/chefs');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <AppShell>
      <TopBar title="Nouveau Chef★" showBack />
      <div className="page">
        <div className="page-content">
          <PageTitle 
            title="Créer un Chef★" 
            subtitle="Ajoutez un nouveau Chef★ à la plateforme"
          />

          <form onSubmit={handleSubmit}>
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
            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px', marginTop: '-8px' }}>
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

            <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
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
