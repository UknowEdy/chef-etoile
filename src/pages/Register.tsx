import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Register réel API
    console.log('Register:', formData);
    navigate('/');
  };

  return (
    <AppShell>
      <TopBar title="Inscription" showBack />
      <div className="page">
        <div className="page-content">
          <div style={{ textAlign: 'center', padding: '32px 0 24px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: '#111827',
              borderRadius: '20px',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserPlus size={40} color="white" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              Créer un compte
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              Rejoignez Chef★ aujourd'hui
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="label">Nom complet</label>
            <input 
              name="name"
              type="text"
              className="input"
              placeholder="Jean Dupont"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label className="label">Email</label>
            <input 
              name="email"
              type="email"
              className="input"
              placeholder="jean@exemple.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label className="label">Téléphone</label>
            <input 
              name="phone"
              type="tel"
              className="input"
              placeholder="06 12 34 56 78"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            
            <label className="label">Mot de passe</label>
            <input 
              name="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn btn-primary">
              S'inscrire
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#6B7280' }}>
            Déjà un compte?{' '}
            <span onClick={() => navigate('/login')} className="link">
              Se connecter
            </span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
