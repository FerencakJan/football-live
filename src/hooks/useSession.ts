// src/hooks/useSession.ts (OPRAVENÁ VERZIA)
import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { Session } from '@supabase/supabase-js';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Získame aktuálnu session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Nastavíme listener na zmeny stavu
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    
    // 3. Clean-up: Teraz voláme unsubscribe na objekte 'subscription'
    return () => {
      subscription?.unsubscribe(); 
    };
  }, []);

  return { session, loading };
}