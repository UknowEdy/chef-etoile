import { createContext, useContext, useState, ReactNode } from 'react';

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulation de login (à remplacer par API plus tard)
  const login = (role: UserRole, email: string, chefSlug?: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setUser({ name: 'Utilisateur Test', role, email, chefSlug });
      setIsLoading(false);
    }, 500);
  };

  const logout = () => {
    setUser(null);
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
