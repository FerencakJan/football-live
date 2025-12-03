// src/types/images.d.ts
// Deklarácie modulov pre rôzne formáty obrázkov
declare module '*.jpg';
declare module '*.png';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg' {
  const content: string;
  export default content;
}