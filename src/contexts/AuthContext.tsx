
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from '@/components/ui/sonner';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  avatar_url: string | null;
  age: number | null;
  occupation: string | null;
  sleep_issues: string[] | null;
  sleep_goals: string[] | null;
  bedtime_target: string | null;
  waketime_target: string | null;
  onboarding_completed: boolean | null;
}

interface AuthContextType {
  session: Session | null;
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          // Use setTimeout to prevent potential deadlocks
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success('Signed up successfully! Please check your email for verification.');
    } catch (error: any) {
      toast.error(error.message || 'Error signing up');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast.success('Signed out successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update the local user state
      setUser({ ...user, ...updates });
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
      throw error;
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
