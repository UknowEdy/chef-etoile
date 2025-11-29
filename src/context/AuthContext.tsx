import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Les rôles possibles dans l'application
export type UserRole = 'guest' | 'client' | 'chef' | 'admin';

interface User {
  name: string;
  role: UserRole;
  email: string;
  chefSlug?: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, email: string, chefSlug?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = 'chef_etoile_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: User = JSON.parse(stored);
        setUser(parsed);
      } catch (e) {
        console.error('Erreur parsing session', e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (role: UserRole, email: string, chefSlug?: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const nextUser: User = { name: 'Utilisateur Test', role, email, chefSlug };
      setUser(nextUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      setIsLoading(false);
    }, 500);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser l'auth partout
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
