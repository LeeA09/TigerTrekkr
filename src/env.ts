import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  PUBLIC_SUPABASE_URL: { public: true },
  PUBLIC_SUPABASE_PUBLISHABLE_KEY: { public: true },
  SUPABASE_SERVICE_ROLE_KEY: { public: false },

  SMTP_HOST: { public: false },
  SMTP_PORT: { public: false },
  SMTP_USER: { public: false },
  SMTP_PASS: { public: false }  
});