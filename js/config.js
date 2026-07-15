// ── Supabase connection ─────────────────────────────────────────────
// Fill these in AFTER you create a free Supabase project (see DEPLOYMENT.md).
// The anon key is SAFE to expose publicly — Row Level Security protects data.
// Until you fill these, the app runs 100% offline from bundled content.

export const SUPABASE_URL = 'https://irymffrhajtgvtbyrgek.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyeW1mZnJoYWp0Z3Z0YnlyZ2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NTE4MzMsImV4cCI6MjA5OTQyNzgzM30.faZouJ1kGkWFF1K_oCQz9RRbhahoo8g2lMn-4NIwTLU';

// Storage bucket used for uploaded PPTs, infographics and PDFs.
export const STORAGE_BUCKET = 'media';

// True once real credentials are set — gates all cloud features.
export const CLOUD_ENABLED =
  !SUPABASE_URL.includes('YOUR-PROJECT') && !SUPABASE_ANON_KEY.includes('YOUR-PUBLIC');
