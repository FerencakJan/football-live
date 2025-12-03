Football Live – React Native (Expo)

Tento projekt je jednoduchá mobilná aplikácia vytvorená pomocou Expo/React Native. Aplikácia naživo získava a zobrazuje futbalové dáta z API-Football. Projekt je postavený tak, aby bol rýchlo spustiteľný, ľahko rozšíriteľný a pripravený na ďalší vývoj.

Požiadavky:
Node.js (verzia 16+), npm a funkčné Expo CLI. Na vývoj nie je potrebné žiadne špeciálne nastavenie, iba bežné nástroje pre React Native.

Inštalácia:

npm install


Spustenie aplikácie:

npx expo start

Po spustení môžeš aplikáciu otvoriť cez Expo Go v mobile alebo v Android/iOS simulátore. Projekt nemá žiadne ďalšie build kroky.

Konfigurácia prostredia:

V koreňovom adresári projektu vytvor súbor .env podľa šablóny .env.example.
Pre development si ich doplníš lokálne:
EXPO_PUBLIC_API_FOOTBALL_KEY=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_SUPABASE_PASSWORD=
EXPO_PUBLIC_USE_REAL_API=false  (prepinac medzi mock/API)



Licencia:
MIT – projekt môžeš upravovať, rozširovať a používať podľa potreby.
