// src/api/apiClient.ts
import axios from 'axios';

// ✅ OPRAVA: Používajte plný názov s prefixom EXPO_PUBLIC_
const API_FOOTBALL_KEY = process.env.EXPO_PUBLIC_API_FOOTBALL_KEY; 

export const api = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-apisports-key': API_FOOTBALL_KEY,
  },
});