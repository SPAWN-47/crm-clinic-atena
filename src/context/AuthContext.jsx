import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recuperar sessão inicial
    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) {
          console.error('Erro ao recuperar sessão:', error);
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }
        
        const session = data?.session ?? null;
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro inesperado ao recuperar sessão:', error);
        setSession(null);
        setUser(null);
        setLoading(false);
      });

    // Listener para mudanças de autenticação
    let subscription = null;
    try {
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        try {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        } catch (error) {
          console.error('Erro ao processar mudança de autenticação:', error);
          setLoading(false);
        }
      });
      subscription = authSubscription;
    } catch (error) {
      console.error('Erro ao configurar listener de autenticação:', error);
      setLoading(false);
    }

    return () => {
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('Erro ao desinscrever listener de autenticação:', error);
        }
      }
    };
  }, []);

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

