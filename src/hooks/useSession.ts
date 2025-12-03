// src/hooks/useSession.ts (OPRAVENÁ VERZIA)
import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { Session } from '@supabase/supabase-js';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aktuálna session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Nastavenie listener na zmeny stavu
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    
    //Voláme unsubscribe na objekte 'subscription'
    return () => {
      subscription?.unsubscribe(); 
    };
  }, []);

  return { session, loading };
}