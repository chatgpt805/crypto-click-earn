
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, User, mockData } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: any | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // For demo purposes we're using mock data
    // In production, this would be replaced with Supabase auth
    setUser(mockData.user);
    setLoading(false);
    setIsAdmin(mockData.user.is_admin);

    // When Supabase is connected, we'll use this code:
    /*
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
      
      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (data) {
          setUser(data);
          setIsAdmin(data.is_admin);
        }
      }
    };
    
    fetchSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      if (session?.user) {
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setUser(data);
              setIsAdmin(data.is_admin);
            }
          });
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
    */
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      // This would use supabase.auth.signUp in production
      console.log("Sign up with", email, password);
      return { data: mockData.user, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // This would use supabase.auth.signInWithPassword in production
      console.log("Sign in with", email, password);
      setUser(mockData.user);
      setIsAdmin(mockData.user.is_admin);
      return { data: mockData.user, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      // This would use supabase.auth.signOut in production
      console.log("Sign out");
      setUser(null);
      setIsAdmin(false);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
