// src/api/favorites.ts
import { supabase } from './supabaseClient';

export const addFavorite = async (userId: string, match: any) => {
  const { data, error } = await supabase.from('favorites').insert([{
    user_id: userId,
    match_id: String(match.fixture.id),
    league: match.league.name,
    teams: match.teams
  }]);
  if (error) throw error;
  return data;
};

export const removeFavorite = async (id: number) => {
  return supabase.from('favorites').delete().eq('id', id);
};

export const getFavoritesByUser = async (userId: string) => {
  const { data, error } = await supabase.from('favorites').select('*').eq('user_id', userId);
  if (error) throw error;
  return data;
};
