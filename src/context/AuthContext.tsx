
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthState, Profile, UserRole } from '@/types/auth';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
  signOut: () => Promise<void>;
  getProfile: () => Promise<Profile | null>;
  getUserRoles: () => Promise<UserRole[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAdmin: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState(prevState => ({
          ...prevState,
          user: session?.user ?? null,
          session: session,
        }));

        // Check admin status if logged in
        if (session?.user) {
          setTimeout(() => {
            checkIsAdmin(session.user.id);
          }, 0);
        } else {
          setAuthState(prevState => ({
            ...prevState,
            isAdmin: false,
          }));
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prevState => ({
        ...prevState,
        user: session?.user ?? null,
        session: session,
        isLoading: false,
      }));

      // Check admin status if logged in
      if (session?.user) {
        checkIsAdmin(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkIsAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        user_id: userId,
        role: 'admin'
      });

      if (error) throw error;

      setAuthState(prevState => ({
        ...prevState,
        isAdmin: data || false,
      }));
    } catch (error) {
      console.error('Error checking admin status:', error);
      setAuthState(prevState => ({
        ...prevState,
        isAdmin: false,
      }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        }
      });

      if (error) throw error;

      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getProfile = async (): Promise<Profile | null> => {
    if (!authState.user) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authState.user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const getUserRoles = async (): Promise<UserRole[]> => {
    if (!authState.user) return [];

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', authState.user.id);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn,
        signUp,
        signOut,
        getProfile,
        getUserRoles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
