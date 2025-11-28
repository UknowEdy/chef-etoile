import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import AppShell from '../../components/AppShell';
import TopBar from '../../components/TopBar';
import { useAuth } from '../../context/AuthContext';

export default function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === 'admin@test.com' && password === '123') {
      login('admin', email);
      navigate('/superadmin/dashboard');
    } else {
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <AppShell>
      <TopBar showLogo={true} showBack />
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '12px', border: '1px solid #111827', color: '#111827', fontWeight: 600, marginBottom: '8px' }}>
              <Shield size={16} />
              <span>Zone sécurisée</span>
            </div>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              Gestion de la plateforme
            </p>
            <p style={{ fontSize: '12px', color: '#10B981', marginTop: '10px', padding: '5px', border: '1px dashed #A7F3D0', borderRadius: '5px' }}>
              Test: admin@test.com / 123
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

            {error && (
              <div style={{ color: '#EF4444', fontSize: '14px', marginBottom: '10px' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary">
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
