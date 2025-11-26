import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';

export default function ChefAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    navigate('/chef-admin/dashboard');
  };

  return (
    <AppShell>
      <TopBar title="Espace Chef★" showBack />
      <div className="page">
        <div className="page-content">
          <div style={{ textAlign: 'center', padding: '48px 0 32px' }}>
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
              <ChefHat size={40} color="white" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              Connexion Chef★
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              Gérez vos menus et abonnés
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <label className="label">Email</label>
            <input 
              type="email"
              className="input"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="label">Mot de passe</label>
            <input 
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="btn btn-primary">
              Se connecter
            </button>
          </form>

          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <a href="#" style={{ fontSize: '14px', color: '#6B7280', textDecoration: 'none' }}>
              Mot de passe oublié ?
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
