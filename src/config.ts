// src/config.ts
// Central toggle for choosing between real API and local mock data.
// Behavior: set env var `EXPO_PUBLIC_USE_REAL_API=true` to enable real API.
// Default (when not set or set to anything else) is mock mode.

export const USE_REAL_API = process.env.EXPO_PUBLIC_USE_REAL_API === 'true';
export const USE_MOCK = !USE_REAL_API;
