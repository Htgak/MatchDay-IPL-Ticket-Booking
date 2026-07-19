async function run() {
  try {
    const matches = await fetch('http://localhost:5000/api/matches').then(res => res.json());
    const matchId = matches.data[0].id;
    console.log('Match ID:', matchId);

    const stands = await fetch(`http://localhost:5000/api/matches/${matchId}/stands`).then(res => res.json());
    console.log('Stands:', stands.data.length);
    const standId = stands.data[0].id;

    const blocks = await fetch(`http://localhost:5000/api/matches/${matchId}/stands/${standId}/blocks`).then(res => res.json());
    console.log('Blocks:', blocks.data.map(b => b.available_seats));
    const blockId = blocks.data[0].id;

    const seats = await fetch(`http://localhost:5000/api/matches/${matchId}/blocks/${blockId}/seats`).then(res => res.json());
    console.log('Rows:', seats.data.rows.length);
    if (seats.data.rows.length > 0) {
      console.log('First row seats status:', seats.data.rows[0].seats.map(s => s.status).slice(0,5));
    }
  } catch (err) {
    console.error(err);
  }
}
run();
