const { createClient } = require('@supabase/supabase-js');
const env = require('./src/config/env');

const supabaseUrl = env.supabase.url;
const supabaseKey = env.supabase.serviceRoleKey || env.supabase.anonKey;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateLogos() {
  console.log('Updating team logos to stable PNG versions...');

  const updates = [
    { short_code: 'CSK', logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/200px-Chennai_Super_Kings_Logo.svg.png' },
    { short_code: 'MI', logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Mumbai_Indians_Logo.svg/200px-Mumbai_Indians_Logo.svg.png' },
    { short_code: 'RCB', logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Royal_Challengers_Bengaluru_logo.png/200px-Royal_Challengers_Bengaluru_logo.png' },
    { short_code: 'KKR', logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Kolkata_Knight_Riders_Logo.svg/200px-Kolkata_Knight_Riders_Logo.svg.png' },
    { short_code: 'DC', logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Delhi_Capitals_Logo.svg/200px-Delhi_Capitals_Logo.svg.png' }
  ];

  for (const update of updates) {
    const { data, error } = await supabase
      .from('Teams')
      .update({ logo_url: update.logo_url })
      .eq('short_code', update.short_code);
    
    if (error) {
      console.error(`Error updating ${update.short_code}:`, error.message);
    } else {
      console.log(`Successfully updated logo for ${update.short_code}`);
    }
  }

  console.log('All logo updates complete!');
}

updateLogos().catch(console.error);
