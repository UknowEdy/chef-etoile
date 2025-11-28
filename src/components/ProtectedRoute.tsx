import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Spinner simple centré
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // 1. Si l'utilisateur n'est PAS connecté
  if (!user) {
    // RÈGLE DE PRIORITÉ CORRIGÉE :
    
    // A. Si la page est destinée aux CLIENTS (même si les chefs peuvent la voir),
    // on redirige vers le login CLIENT standard.
    if (allowedRoles.includes('client')) {
      return <Navigate to="/login" replace />;
    }
    
    // B. Seulement si c'est une page EXCLUSIVE Chef (sans accès client)
    if (allowedRoles.includes('chef')) {
      return <Navigate to="/chef-admin/login" replace />;
    }

    // C. Seulement si c'est une page EXCLUSIVE Admin
    if (allowedRoles.includes('admin')) {
      return <Navigate to="/superadmin/login" replace />;
    }

    // D. Par défaut
    return <Navigate to="/login" replace />;
  }

  // 2. Si connecté mais n'a pas le bon rôle
  if (!allowedRoles.includes(user.role)) {
    // On le renvoie vers son dashboard respectif au lieu de juste l'accueil
    if (user.role === 'chef') return <Navigate to="/chef-admin/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/superadmin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  // 3. Accès autorisé
  return <Outlet />;
}
