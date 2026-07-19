const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { createClient } = require('@supabase/supabase-js');
const env = require('./src/config/env');

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey || env.supabase.anonKey);

const logos = [
  { short_code: 'CSK', url: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/200px-Chennai_Super_Kings_Logo.svg.png' },
  { short_code: 'MI', url: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Mumbai_Indians_Logo.svg/200px-Mumbai_Indians_Logo.svg.png' },
  { short_code: 'RCB', url: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Royal_Challengers_Bengaluru_logo.png/200px-Royal_Challengers_Bengaluru_logo.png' },
  { short_code: 'KKR', url: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Kolkata_Knight_Riders_Logo.svg/200px-Kolkata_Knight_Riders_Logo.svg.png' },
  { short_code: 'DC', url: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Delhi_Capitals_Logo.svg/200px-Delhi_Capitals_Logo.svg.png' }
];

const targetDir = path.join(__dirname, '../client/public/logos');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function run() {
  for (const logo of logos) {
    const filename = `${logo.short_code.toLowerCase()}.png`;
    const dest = path.join(targetDir, filename);
    
    console.log(`Downloading ${logo.short_code}...`);
    try {
      execSync(`curl -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" -o "${dest}" "${logo.url}"`);
      console.log(`Saved ${filename}`);
      
      const { error } = await supabase
        .from('Teams')
        .update({ logo_url: `/logos/${filename}` })
        .eq('short_code', logo.short_code);
        
      if (error) console.error(`DB Update Error for ${logo.short_code}:`, error.message);
      else console.log(`Updated DB for ${logo.short_code}`);
    } catch (e) {
      console.error(`Error downloading ${logo.short_code}:`, e.message);
    }
  }
  console.log("Done!");
}

run();
