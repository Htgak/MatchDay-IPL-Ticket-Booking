const supabase = require('./src/config/supabase');
require('dotenv').config();

async function testApi() {
  const { data: matches } = await supabase.from('Matches').select('id, stadium_id').limit(1);
  const matchId = matches[0].id;
  
  console.log('Testing matchId:', matchId);

  const { data: stands } = await supabase.from('Stands').select('id, name').eq('stadium_id', matches[0].stadium_id);
  const standId = stands[0].id;
  console.log('Testing standId:', standId);

  const { data: blocks } = await supabase.from('Blocks').select('id, name').eq('stand_id', standId);
  const blockId = blocks[0].id;
  console.log('Testing blockId:', blockId);

  const { data: rows } = await supabase.from('Rows').select('id').eq('block_id', blockId);
  const rowIds = rows.map(r => r.id);
  const { data: seats } = await supabase.from('Seats').select('id').in('row_id', rowIds);
  const seatIds = seats.map(s => s.id);
  const { data: matchSeats, error } = await supabase.from('MatchSeats').select('id, status, seat_id').eq('match_id', matchId).in('seat_id', seatIds);

  console.log('Row IDs:', rowIds.length);
  console.log('Seat IDs:', seatIds.length);
  console.log('MatchSeats array length:', matchSeats?.length);
  if (error) console.log('MatchSeats Error:', error);
  if (matchSeats && matchSeats.length > 0) {
    console.log('First MatchSeat:', matchSeats[0]);
  }
}

testApi().catch(console.error);
