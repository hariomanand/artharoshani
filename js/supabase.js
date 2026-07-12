// Lazy Supabase client. Loads the SDK from CDN only when cloud is enabled,
// so the offline app never pays for it.
import { SUPABASE_URL, SUPABASE_ANON_KEY, CLOUD_ENABLED } from './config.js';

let _client = null;
let _loading = null;

export async function getSupabase() {
  if (!CLOUD_ENABLED) return null;
  if (_client) return _client;
  if (!_loading) {
    _loading = import('https://esm.sh/@supabase/supabase-js@2')
      .then(({ createClient }) => {
        _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: { persistSession: true, autoRefreshToken: true },
        });
        return _client;
      })
      .catch(err => { console.warn('Supabase load failed — staying offline.', err); return null; });
  }
  return _loading;
}

export { CLOUD_ENABLED };
