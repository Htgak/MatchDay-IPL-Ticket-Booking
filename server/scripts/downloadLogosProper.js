const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const env = require('./src/config/env');

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey || env.supabase.anonKey);

const teams = [
  { short: 'CSK', url: 'https://raw.githubusercontent.com/sarvesharora/ipl/master/assets/team-logo/csk.png' },
  { short: 'MI', url: 'https://raw.githubusercontent.com/sarvesharora/ipl/master/assets/team-logo/mi.png' },
  { short: 'RCB', url: 'https://raw.githubusercontent.com/sarvesharora/ipl/master/assets/team-logo/rcb.png' },
  { short: 'KKR', url: 'https://raw.githubusercontent.com/sarvesharora/ipl/master/assets/team-logo/kkr.png' },
  { short: 'DC', url: 'https://raw.githubusercontent.com/sarvesharora/ipl/master/assets/team-logo/dc.png' },
];

const downloadImage = async (url, filepath) => {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    let error = null;
    writer.on('error', err => {
      error = err;
      writer.close();
      reject(err);
    });
    writer.on('close', () => {
      if (!error) resolve(true);
    });
  });
};

const main = async () => {
  const publicDir = path.join(__dirname, '../client/public/logos');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  for (const team of teams) {
    const filename = `${team.short.toLowerCase()}.png`;
    const filepath = path.join(publicDir, filename);
    const dbPath = `/logos/${filename}`;

    try {
      console.log(`Downloading ${team.short}...`);
      await downloadImage(team.url, filepath);
      console.log(`Saved ${filepath}`);

      const { error } = await supabase
        .from('Teams')
        .update({ logo_url: dbPath })
        .eq('short_code', team.short);

      if (error) console.error(`Failed to update DB for ${team.short}:`, error);
      else console.log(`Updated DB for ${team.short}`);
      
    } catch (err) {
      console.error(`Error processing ${team.short}:`, err.message);
    }
  }
};

main();
