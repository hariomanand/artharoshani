// ── Supabase connection ─────────────────────────────────────────────
// Fill these in AFTER you create a free Supabase project (see DEPLOYMENT.md).
// The anon key is SAFE to expose publicly — Row Level Security protects data.
// Until you fill these, the app runs 100% offline from bundled content.

export const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
export const SUPABASE_ANON_KEY = 'YOUR-PUBLIC-ANON-KEY';

// Storage bucket used for uploaded PPTs, infographics and PDFs.
export const STORAGE_BUCKET = 'media';

// True once real credentials are set — gates all cloud features.
export const CLOUD_ENABLED =
  !SUPABASE_URL.includes('YOUR-PROJECT') && !SUPABASE_ANON_KEY.includes('YOUR-PUBLIC');
