import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';

export default function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    navigate('/superadmin/dashboard');
  };

  return (
    <AppShell>
      <TopBar title="Super Admin" showBack />
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
              <Shield size={40} color="white" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              Super Admin
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              Gestion de la plateforme
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <label className="label">Email</label>
            <input 
              type="email"
              className="input"
              placeholder="admin@chefetoile.com"
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
        </div>
      </div>
    </AppShell>
  );
}
