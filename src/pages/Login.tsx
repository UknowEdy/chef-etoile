import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import AppShell from '../components/AppShell';
import TopBar from '../components/TopBar';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Login réel API
    console.log('Login client:', email);
    navigate('/');
  };

  return (
    <AppShell>
      <TopBar title="Connexion" showBack />
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
              <User size={40} color="white" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              Bon retour !
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              Connectez-vous pour commander
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

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#6B7280' }}>
            Pas encore de compte?{' '}
            <span onClick={() => navigate('/register')} className="link">
              Créer un compte
            </span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
