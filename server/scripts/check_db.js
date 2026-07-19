const supabase = require('./src/config/supabase');
require('dotenv').config();

async function check() {
  const { data: matches } = await supabase.from('Matches').select('id, stadium_id');
  console.log("Matches:", matches);

  const { data: stands } = await supabase.from('Stands').select('id, name, stadium_id');
  console.log("Stands in DB:", stands.map(s => s.name + " (" + s.stadium_id + ")").slice(0, 5));
}
check();
