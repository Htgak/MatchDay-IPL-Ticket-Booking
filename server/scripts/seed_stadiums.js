require('dotenv').config({ path: '../.env' });
const db = require('../src/db/index');

// Stadium Constants
const CX = 300, CY = 250;
const RADIUS_OUTER = 230;
const RADIUS_MID = 160;
const RADIUS_INNER = 100;

const STANDS = [
  {
    name: 'Sachin Tendulkar Pavilion',
    position: 'northwest',
    color: '#B47ED5',
    price: 5000,
    startAngle: 190,
    endAngle: 280,
    blocks: [
      { name: 'A', ring: 'outer', index: 0, totalInRing: 7 },
      { name: 'B', ring: 'outer', index: 1, totalInRing: 7 },
      { name: 'C', ring: 'outer', index: 2, totalInRing: 7 },
      { name: 'D', ring: 'outer', index: 3, totalInRing: 7 },
      { name: 'E', ring: 'outer', index: 4, totalInRing: 7 },
      { name: 'F', ring: 'outer', index: 5, totalInRing: 7 },
      { name: 'G', ring: 'outer', index: 6, totalInRing: 7 },
      { name: 'P', ring: 'inner', index: 0, totalInRing: 8 },
      { name: 'Q', ring: 'inner', index: 1, totalInRing: 8 },
      { name: 'R', ring: 'inner', index: 2, totalInRing: 8 },
      { name: 'S', ring: 'inner', index: 3, totalInRing: 8 },
      { name: 'T', ring: 'inner', index: 4, totalInRing: 8 },
      { name: 'U', ring: 'inner', index: 5, totalInRing: 8 },
      { name: 'V', ring: 'inner', index: 6, totalInRing: 8 },
      { name: 'N', ring: 'inner', index: 7, totalInRing: 8 },
    ]
  },
  {
    name: 'North Stand',
    position: 'northeast',
    color: '#F8A5A6',
    price: 3000,
    startAngle: 280,
    endAngle: 340,
    blocks: [
      { name: 'H', ring: 'outer', index: 0, totalInRing: 4 },
      { name: 'I', ring: 'outer', index: 1, totalInRing: 4 },
      { name: 'J', ring: 'outer', index: 2, totalInRing: 4 },
      { name: 'K', ring: 'outer', index: 3, totalInRing: 4 },
      { name: 'W', ring: 'inner', index: 0, totalInRing: 5 },
      { name: 'X', ring: 'inner', index: 1, totalInRing: 5 },
      { name: 'Y', ring: 'inner', index: 2, totalInRing: 5 },
      { name: 'M', ring: 'inner', index: 3, totalInRing: 5 },
      { name: 'L', ring: 'inner', index: 4, totalInRing: 5 },
    ]
  },
  {
    name: 'Sunil Gavaskar Pavilion',
    position: 'east',
    color: '#4DA9E2',
    price: 4000,
    startAngle: 340,
    endAngle: 50,
    blocks: [
      { name: 'A', ring: 'outer', index: 0, totalInRing: 6 },
      { name: 'B', ring: 'outer', index: 1, totalInRing: 6 },
      { name: 'C', ring: 'outer', index: 2, totalInRing: 6 },
      { name: 'D', ring: 'outer', index: 3, totalInRing: 6 },
      { name: 'E', ring: 'outer', index: 4, totalInRing: 6 },
      { name: 'F', ring: 'outer', index: 5, totalInRing: 6 },
      { name: 'L', ring: 'inner', index: 0, totalInRing: 6 },
      { name: 'K', ring: 'inner', index: 1, totalInRing: 6 },
      { name: 'J', ring: 'inner', index: 2, totalInRing: 6 },
      { name: 'I', ring: 'inner', index: 3, totalInRing: 6 },
      { name: 'H', ring: 'inner', index: 4, totalInRing: 6 },
      { name: 'G', ring: 'inner', index: 5, totalInRing: 6 },
    ]
  },
  {
    name: 'Divecha & MCA Pavilion',
    position: 'southeast',
    color: '#E040FB',
    price: 6000,
    startAngle: 50,
    endAngle: 90,
    blocks: [
      { name: 'Div_G', ring: 'inner', index: 0, totalInRing: 9 },
      { name: 'Div_F', ring: 'inner', index: 1, totalInRing: 9 },
      { name: 'Div_E', ring: 'inner', index: 2, totalInRing: 9 },
      { name: 'Div_D', ring: 'inner', index: 3, totalInRing: 9 },
      { name: 'Div_C', ring: 'inner', index: 4, totalInRing: 9 },
      { name: 'MCA_J', ring: 'inner', index: 5, totalInRing: 9 },
      { name: 'MCA_K', ring: 'inner', index: 6, totalInRing: 9 },
      { name: 'MCA_L', ring: 'inner', index: 7, totalInRing: 9 },
      { name: 'MCA_M', ring: 'inner', index: 8, totalInRing: 9 },
    ]
  },
  {
    name: 'Grand Stand',
    position: 'south',
    color: '#EF5350',
    price: 8000,
    startAngle: 90,
    endAngle: 120,
    blocks: [
      { name: 'Level 2', ring: 'inner', index: 0, totalInRing: 1 },
      { name: 'Level 3', ring: 'mid', index: 0, totalInRing: 1 },
      { name: 'Level 4', ring: 'outer', index: 0, totalInRing: 1 },
    ]
  },
  {
    name: 'Garware Pavilion',
    position: 'southwest',
    color: '#FCD015',
    price: 4500,
    startAngle: 120,
    endAngle: 160,
    blocks: [
      { name: 'A', ring: 'outer', index: 0, totalInRing: 4 },
      { name: 'B', ring: 'outer', index: 1, totalInRing: 4 },
      { name: 'C', ring: 'outer', index: 2, totalInRing: 4 },
      { name: 'D', ring: 'outer', index: 3, totalInRing: 4 },
      { name: 'H', ring: 'inner', index: 0, totalInRing: 8 },
      { name: 'G', ring: 'inner', index: 1, totalInRing: 8 },
      { name: 'F', ring: 'inner', index: 2, totalInRing: 8 },
      { name: 'E', ring: 'inner', index: 3, totalInRing: 8 },
      { name: 'I', ring: 'inner', index: 4, totalInRing: 8 },
      { name: 'J', ring: 'inner', index: 5, totalInRing: 8 },
      { name: 'K', ring: 'inner', index: 6, totalInRing: 8 },
      { name: 'L', ring: 'inner', index: 7, totalInRing: 8 },
    ]
  },
  {
    name: 'Vijay Merchant Pavilion',
    position: 'west',
    color: '#16A34A',
    price: 3500,
    startAngle: 160,
    endAngle: 190,
    blocks: [
      { name: 'A', ring: 'outer', index: 0, totalInRing: 6 },
      { name: 'B', ring: 'outer', index: 1, totalInRing: 6 },
      { name: 'C', ring: 'outer', index: 2, totalInRing: 6 },
      { name: 'D', ring: 'outer', index: 3, totalInRing: 6 },
      { name: 'E', ring: 'outer', index: 4, totalInRing: 6 },
      { name: 'F', ring: 'outer', index: 5, totalInRing: 6 },
      { name: 'L', ring: 'inner', index: 0, totalInRing: 6 },
      { name: 'K', ring: 'inner', index: 1, totalInRing: 6 },
      { name: 'J', ring: 'inner', index: 2, totalInRing: 6 },
      { name: 'I', ring: 'inner', index: 3, totalInRing: 6 },
      { name: 'H', ring: 'inner', index: 4, totalInRing: 6 },
      { name: 'G', ring: 'inner', index: 5, totalInRing: 6 },
    ]
  }
];

function calculateBlockAngles(stand, block) {
  let sAngle = stand.startAngle;
  let eAngle = stand.endAngle;
  if (eAngle < sAngle) eAngle += 360;

  const diff = eAngle - sAngle;
  // Account for gap between stands and blocks
  const blockSpan = (diff * 0.95) / block.totalInRing;
  const standStart = sAngle + (diff * 0.025);
  
  const bStart = standStart + (blockSpan * block.index);
  const bEnd = bStart + blockSpan * 0.95; // Small gap between blocks
  return { start: bStart, end: bEnd };
}

async function runSeed() {
  console.log("Starting PostgreSQL Seed Generator...");
  
  try {
    // 1. Get Stadiums
    const { rows: stadiums } = await db.query('SELECT * FROM "Stadiums"');
    if (!stadiums || stadiums.length === 0) throw new Error("No stadiums found in DB. Did you run init.sql?");
    
    // 2. Wipe existing hierarchical data
    console.log("Wiping existing hierarchy...");
    await db.query(`
      DELETE FROM "Tickets";
      DELETE FROM "BookingSeats";
      DELETE FROM "Payments";
      DELETE FROM "Bookings";
      DELETE FROM "MatchSeats";
      DELETE FROM "Seats";
      DELETE FROM "Rows";
      DELETE FROM "Blocks";
      DELETE FROM "Stands";
      DELETE FROM "Matches";
    `);
    
    const { rows: teams } = await db.query('SELECT * FROM "Teams"');
    
    // 3. Get team IDs
    const csk = teams.find(t => t.short_code === 'CSK').id;
    const mi = teams.find(t => t.short_code === 'MI').id;
    const rcb = teams.find(t => t.short_code === 'RCB').id;
    const kkr = teams.find(t => t.short_code === 'KKR').id;
    const dc = teams.find(t => t.short_code === 'DC').id;
    const srh = teams.find(t => t.short_code === 'SRH').id;

    // Map to store created seats per stadium
    const seatsByStadium = {};

    // Build the Stands, Blocks, Rows, and Seats hierarchy once for each stadium
    for (const stadium of stadiums) {
      console.log(`Seeding structure for Stadium: ${stadium.name}`);
      seatsByStadium[stadium.id] = [];

      for (const s of STANDS) {
        console.log(`- Inserting Stand: ${s.name}`);
        const { rows: standRows } = await db.query(
          'INSERT INTO "Stands" (stadium_id, name, position) VALUES ($1, $2, $3) RETURNING id',
          [stadium.id, s.name, s.position]
        );
        const standData = standRows[0];
          
        for (const b of s.blocks) {
          const { rows: blockRows } = await db.query(
            'INSERT INTO "Blocks" (stand_id, name, category, color_code, price) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [standData.id, b.name, 'Standard', s.color, s.price]
          );
          const blockData = blockRows[0];
            
          const { start: bStart, end: bEnd } = calculateBlockAngles(s, b);
          
          let minR, maxR;
          if (b.ring === 'outer') { minR = RADIUS_MID + 10; maxR = RADIUS_OUTER; }
          else if (b.ring === 'mid') { minR = RADIUS_INNER + 40; maxR = RADIUS_MID - 10; }
          else { minR = RADIUS_INNER; maxR = RADIUS_MID - 10; }
          
          const ROWS = 5;
          const SEATS_PER_ROW = 10;
          
          for (let r = 0; r < ROWS; r++) {
            const rowName = String.fromCharCode(65 + r);
            const { rows: rowRows } = await db.query(
              'INSERT INTO "Rows" (block_id, name) VALUES ($1, $2) RETURNING id',
              [blockData.id, rowName]
            );
            const rowData = rowRows[0];
              
            const radius = minR + (maxR - minR) * (r / (ROWS - 1));
            
            const seatsVals = [];
            for (let i = 0; i < SEATS_PER_ROW; i++) {
              const angleDeg = bStart + (bEnd - bStart) * (i / (SEATS_PER_ROW - 1));
              const angleRad = angleDeg * (Math.PI / 180);
              
              const cx = CX + radius * Math.cos(angleRad);
              const cy = CY + radius * Math.sin(angleRad);
              
              seatsVals.push(`('${rowData.id}', ${i + 1}, ${Math.round(cx * 10) / 10}, ${Math.round(cy * 10) / 10})`);
            }
            
            if (seatsVals.length > 0) {
              const { rows: insertedSeats } = await db.query(`
                INSERT INTO "Seats" (row_id, seat_number, x, y)
                VALUES ${seatsVals.join(',')}
                RETURNING id
              `);
              
              for (const seat of insertedSeats) {
                seatsByStadium[stadium.id].push({ id: seat.id, price: s.price });
              }
            }
          }
        }
      } 
    }

    // Now create unique matches at specific venues
    const matchesToCreate = [
      { teamA: mi, teamB: csk, stadiumIndex: 1, dateOffset: 7, desc: 'MI vs CSK' },                 // Wankhede Stadium
      { teamA: rcb, teamB: kkr, stadiumIndex: 2, dateOffset: 8, desc: 'RCB vs KKR' },               // M. Chinnaswamy Stadium
      { teamA: srh, teamB: dc, stadiumIndex: 3, dateOffset: 9, desc: 'SRH vs DC' },                 // Eden Gardens
      { teamA: csk, teamB: rcb, stadiumIndex: 0, dateOffset: 10, desc: 'CSK vs RCB' },              // M. A. Chidambaram Stadium
      { teamA: mi, teamB: srh, stadiumIndex: 1, dateOffset: 11, desc: 'MI vs SRH' },                // Wankhede Stadium
      { teamA: kkr, teamB: dc, stadiumIndex: 3, dateOffset: 12, desc: 'KKR vs DC' },                // Eden Gardens
      { teamA: rcb, teamB: srh, stadiumIndex: 2, dateOffset: 13, desc: 'RCB vs SRH' },              // M. Chinnaswamy Stadium
      { teamA: csk, teamB: dc, stadiumIndex: 0, dateOffset: 14, desc: 'CSK vs DC' }                 // M. A. Chidambaram Stadium
    ];

    for (const mData of matchesToCreate) {
      const stadium = stadiums[mData.stadiumIndex];
      console.log(`Creating Match: ${mData.desc} at ${stadium.name}`);
      const { rows: matchRows } = await db.query(
        'INSERT INTO "Matches" (team_a, team_b, stadium_id, date, status) VALUES ($1, $2, $3, NOW() + ($4 * INTERVAL \'1 day\'), \'UPCOMING\') RETURNING id',
        [mData.teamA, mData.teamB, stadium.id, mData.dateOffset]
      );
      const match = matchRows[0];

      const stadiumSeats = seatsByStadium[stadium.id];
      const allMatchSeats = stadiumSeats.map(seat => `('${match.id}', '${seat.id}', 'AVAILABLE', ${seat.price})`);

      console.log(`Inserting ${allMatchSeats.length} MatchSeats for match ${match.id}...`);
      const chunkSize = 1000;
      for (let i = 0; i < allMatchSeats.length; i += chunkSize) {
        const chunk = allMatchSeats.slice(i, i + chunkSize);
        await db.query(`
          INSERT INTO "MatchSeats" (match_id, seat_id, status, price)
          VALUES ${chunk.join(',')}
        `);
      }
    } 
    
    console.log("Seeding complete!");
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

runSeed();
