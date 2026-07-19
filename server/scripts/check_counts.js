const supabase = require('./src/config/supabase');
require('dotenv').config();

async function check() {
  const { count: matchSeatsCount } = await supabase.from('MatchSeats').select('*', { count: 'exact', head: true });
  console.log(`Total MatchSeats: ${matchSeatsCount}`);
  
  const { data: matches } = await supabase.from('Matches').select('id, match_date');
  console.log(`Total Matches: ${matches.length}`);
  
  for (const m of matches) {
    const { count } = await supabase.from('MatchSeats').select('*', { count: 'exact', head: true }).eq('match_id', m.id);
    console.log(`Match ${m.id} (${m.match_date}) -> ${count} MatchSeats`);
  }
}

check().catch(console.error);
