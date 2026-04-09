import { createContext, useContext } from "react";

const LOCAL_USER = { id: 'local', email: 'local@prm.app' } as any;

interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: LOCAL_USER,
  session: null,
  loading: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={{ user: LOCAL_USER, session: null, loading: false, signOut: async () => {} }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
