// Centralize the Wankhede stadium geometric layout constants for the SVG rendering
export const CX = 300, CY = 250;
export const RADIUS_OUTER = 230;
export const RADIUS_MID = 160;
export const RADIUS_INNER = 100;

export const STANDS = [
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
    endAngle: 50, // wraps around
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

export function calculateBlockAngles(stand, block) {
  let sAngle = stand.startAngle;
  let eAngle = stand.endAngle;
  // Handle wraparound for East stand (340 to 50)
  if (eAngle < sAngle) eAngle += 360;
  
  const diff = eAngle - sAngle;
  // Account for gap between stands and blocks
  const blockSpan = (diff * 0.95) / block.totalInRing;
  const standStart = sAngle + (diff * 0.025);
  
  const bStart = standStart + (blockSpan * block.index);
  const bEnd = bStart + blockSpan * 0.95; // Small gap between blocks
  
  return { start: bStart, end: bEnd };
}
