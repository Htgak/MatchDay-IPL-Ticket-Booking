import React from 'react';
import { STANDS, calculateBlockAngles, CX, CY, RADIUS_OUTER, RADIUS_MID, RADIUS_INNER } from '../constants/stadiumLayout';

// Helper: point on an ellipse at angle theta (degrees)
function ellipsePoint(cx, cy, r, thetaDeg) {
  const theta = (thetaDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(theta),
    y: cy + r * Math.sin(theta),
  };
}

// SVG arc path for a "ring segment" (block section)
function ringPath(cx, cy, outerR, innerR, startAngle, endAngle) {
  const o1 = ellipsePoint(cx, cy, outerR, startAngle);
  const o2 = ellipsePoint(cx, cy, outerR, endAngle);
  const i1 = ellipsePoint(cx, cy, innerR, startAngle);
  const i2 = ellipsePoint(cx, cy, innerR, endAngle);

  const diff = endAngle - startAngle;
  // If the span is more than 180 degrees, large arc flag is 1
  const largeArc = Math.abs(diff) > 180 ? 1 : 0;

  return [
    `M ${o1.x.toFixed(2)},${o1.y.toFixed(2)}`,
    `A ${outerR},${outerR} 0 ${largeArc},1 ${o2.x.toFixed(2)},${o2.y.toFixed(2)}`,
    `L ${i2.x.toFixed(2)},${i2.y.toFixed(2)}`,
    `A ${innerR},${innerR} 0 ${largeArc},0 ${i1.x.toFixed(2)},${i1.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

export default function StadiumSVG({ standsData, hoveredBlock, setHoveredBlock, onSelectBlock }) {
  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-label-md font-label-md text-on-surface-variant">
          Click on any colored block to select your seats
        </p>
      </div>

      <svg
        viewBox="0 -50 600 600"
        className="w-full max-w-3xl drop-shadow-2xl"
        style={{ fontFamily: 'inherit' }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="ground-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#84cc78" />
            <stop offset="70%" stopColor="#55a64b" />
            <stop offset="100%" stopColor="#307d27" />
          </radialGradient>
        </defs>

        {/* Outer Ring Background */}
        <circle cx={CX} cy={CY} r={RADIUS_OUTER + 15} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />

        {/* Render Blocks */}
        {STANDS.map((stand) => {
          // Find the corresponding database stand (matched by name)
          const dbStand = standsData?.find(s => s.name === stand.name);

          return stand.blocks.map((block) => {
            const { start, end } = calculateBlockAngles(stand, block);
            
            let innerR, outerR;
            if (block.ring === 'outer') {
              innerR = RADIUS_MID + 5;
              outerR = RADIUS_OUTER;
            } else if (block.ring === 'mid') {
              innerR = RADIUS_INNER + 20;
              outerR = RADIUS_MID - 5;
            } else {
              innerR = RADIUS_INNER;
              outerR = RADIUS_MID - 5;
            }

            const path = ringPath(CX, CY, outerR, innerR, start, end);
            const blockId = `${stand.name}-${block.name}`;
            const isHovered = hoveredBlock === blockId;

            // Find matching db block if available
            const dbBlock = dbStand?.blocks?.find(b => b.name === block.name) || null;

            return (
              <g
                key={blockId}
                onClick={() => {
                  if (dbBlock) onSelectBlock(dbStand, dbBlock);
                }}
                onMouseEnter={() => setHoveredBlock(blockId)}
                onMouseLeave={() => setHoveredBlock(null)}
                style={{ cursor: dbBlock ? 'pointer' : 'not-allowed' }}
              >
                <path
                  d={path}
                  fill={stand.color}
                  stroke="#ffffff"
                  strokeWidth="2"
                  style={{
                    transition: 'all 0.2s ease',
                    filter: isHovered ? 'url(#glow)' : 'none',
                    transformOrigin: `${CX}px ${CY}px`,
                    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  }}
                  opacity={isHovered ? 1 : 0.85}
                />
                
                {/* Block Label */}
                {(() => {
                  const midAngle = (start + end) / 2;
                  const midR = (innerR + outerR) / 2;
                  const lp = ellipsePoint(CX, CY, midR, midAngle);
                  
                  // Don't show long labels if they won't fit, just show short block names
                  const labelText = block.name.replace('Div_', '').replace('MCA_', '');
                  
                  return (
                    <text
                      x={lp.x}
                      y={lp.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="9"
                      fontWeight="bold"
                      style={{ pointerEvents: 'none', textShadow: '0px 1px 2px rgba(0,0,0,0.5)' }}
                    >
                      {labelText}
                    </text>
                  );
                })()}
              </g>
            );
          });
        })}

        {/* Cricket Ground */}
        <circle cx={CX} cy={CY} r={RADIUS_INNER - 5} fill="url(#ground-grad)" />
        
        {/* Pitch */}
        <rect x={CX - 8} y={CY - 25} width="16" height="50" fill="#fcd34d" rx="2" />
        <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle" 
              fill="#b45309" fontSize="10" fontWeight="bold" transform={`rotate(-90 ${CX} ${CY})`}>
          PITCH
        </text>

        {/* Hover Tooltip inside SVG */}
        {hoveredBlock && (() => {
          // find stand & block info
          let hStand, hBlock;
          for (const s of STANDS) {
            const b = s.blocks.find(blk => `${s.name}-${blk.name}` === hoveredBlock);
            if (b) {
              hStand = s;
              hBlock = b;
              break;
            }
          }
          if (!hStand) return null;

          // Attempt to find db data
          const dbStand = standsData?.find(s => s.name === hStand.name);
          const dbBlock = dbStand?.blocks?.find(b => b.name === hBlock.name);

          const { start, end } = calculateBlockAngles(hStand, hBlock);
          const midAngle = (start + end) / 2;
          const tooltipPos = ellipsePoint(CX, CY, RADIUS_OUTER + 45, midAngle);

          return (
            <g transform={`translate(${tooltipPos.x}, ${tooltipPos.y})`}>
              <rect x="-70" y="-35" width="140" height="70" rx="8"
                fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))" />
              <text textAnchor="middle" y="-15" fill="#0f172a" fontSize="10" fontWeight="800">
                {hStand.name}
              </text>
              <text textAnchor="middle" y="0" fill="#64748b" fontSize="10" fontWeight="600">
                Block {hBlock.name}
              </text>
              <text textAnchor="middle" y="15" fill="#059669" fontSize="10" fontWeight="700">
                {dbBlock ? `₹${(dbBlock.price || dbStand?.price_from || hStand.price).toLocaleString()} • ${dbBlock.available_seats || 0} left` : 'Loading...'}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
