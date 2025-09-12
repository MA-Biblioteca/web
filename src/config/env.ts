// Configuración de variables de entorno para Vercel + Supabase
// Las variables deben empezar con VITE_ para ser accesibles en el frontend

export const config = {
  // BFF API Configuration
  bffUrl: import.meta.env.VITE_BFF_URL || 'http://localhost:3001',

  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },

  // Environment helpers
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
}