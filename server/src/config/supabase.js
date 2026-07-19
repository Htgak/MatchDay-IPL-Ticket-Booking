const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

if (!env.supabase.url || !env.supabase.serviceRoleKey) {
  console.warn('Missing Supabase URL or Service Role Key in environment variables');
}

// We use the service role key for the backend to bypass RLS and perform admin operations.
// Security rules will be enforced in the Express route controllers/services.
const supabase = createClient(env.supabase.url || '', env.supabase.serviceRoleKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

module.exports = supabase;
