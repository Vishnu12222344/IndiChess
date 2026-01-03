import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

interface AuthUser {
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = parseJwt(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback((newToken: string, email: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userEmail', email);
    setToken(newToken);
    setUser({ email });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setToken(null);
    setUser(null);
  }, []);

  // Load auth from storage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('userEmail');

    if (storedToken && storedEmail && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      setUser({ email: storedEmail });
    } else {
      logout();
    }
    setIsLoading(false);
  }, [logout]);

  // 🔥 OAuth redirect handler (FIXED)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (!urlToken) return;

    const payload = parseJwt(urlToken);
    if (!payload || isTokenExpired(urlToken)) {
      logout();
      return;
    }

    const email =
        payload.email ||
        payload.preferred_username ||
        payload.sub;

    login(urlToken, email);

    // ✅ clean URL WITHOUT reload
    window.history.replaceState({}, '', '/dashboard');
  }, [login, logout]);

  return (
      <AuthContext.Provider
          value={{
            user,
            token,
            isAuthenticated: !!token && !!user,
            isLoading,
            login,
            logout,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
