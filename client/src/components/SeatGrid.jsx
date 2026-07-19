import React from 'react';

export default function SeatGrid({ matchId, block, rows, selectedSeats, onSeatToggle }) {
  // Fallback for price if missing
  const blockPrice = block.price || 0;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 py-3 px-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-lg rounded-b-sm bg-surface-container border-2 border-outline/30 shadow-sm" />
          <span className="text-label-sm font-label-sm text-on-surface">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-lg rounded-b-sm bg-primary border-2 border-primary shadow-sm" />
          <span className="text-label-sm font-label-sm text-on-surface">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-lg rounded-b-sm bg-error border-2 border-error shadow-sm" />
          <span className="text-label-sm font-label-sm text-on-surface">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-lg rounded-b-sm bg-tertiary border-2 border-tertiary shadow-sm" />
          <span className="text-label-sm font-label-sm text-on-surface">Locked</span>
        </div>
      </div>

      {/* Seat Container */}
      <div 
        className="w-full bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-inner overflow-auto relative p-6 touch-pan-x touch-pan-y"
        style={{ minHeight: '400px', maxHeight: '70vh' }}
      >
        <div className="min-w-max flex flex-col gap-3 mx-auto pb-8 pt-4">
          {/* Pitch indicator */}
          <div className="w-full max-w-md mx-auto h-16 bg-gradient-to-b from-green-500/20 to-transparent border-t-8 border-green-600 rounded-t-[100px] mb-10 flex items-start justify-center pt-2">
             <span className="text-green-800 font-bold tracking-[0.2em] text-sm">PITCH</span>
          </div>
          
          {rows.map(row => (
            <div key={row.id} className="flex items-center gap-6 justify-center">
              {/* Row Label Left */}
              <div className="w-8 text-right font-bold text-on-surface-variant text-sm select-none">
                {row.name}
              </div>
              
              {/* Seats */}
              <div className="flex items-center gap-2">
                {row.seats.map(seat => {
                  const isSelected = selectedSeats.some(s => s.match_seat_id === seat.match_seat_id);
                  const { status, match_seat_id } = seat;
                  
                  let bgColor = 'bg-surface-container';
                  let textColor = 'text-on-surface-variant';
                  let borderColor = 'border-outline/30';
                  let cursor = 'cursor-pointer hover:bg-primary-container hover:border-primary';
                  let opacity = '';
                  
                  if (!match_seat_id) {
                    bgColor = 'bg-surface-container-high';
                    cursor = 'cursor-not-allowed opacity-50';
                  } else if (status === 'BOOKED') {
                    bgColor = 'bg-error';
                    textColor = 'text-on-error';
                    borderColor = 'border-error';
                    cursor = 'cursor-not-allowed';
                  } else if (status === 'LOCKED' && !isSelected) {
                    bgColor = 'bg-tertiary';
                    textColor = 'text-on-tertiary';
                    borderColor = 'border-tertiary';
                    cursor = 'cursor-not-allowed';
                  } else if (isSelected) {
                    bgColor = 'bg-primary';
                    textColor = 'text-on-primary';
                    borderColor = 'border-primary shadow-md transform -translate-y-1';
                  }
                  
                  return (
                    <button
                      key={seat.id}
                      disabled={!match_seat_id || status === 'BOOKED' || (status === 'LOCKED' && !isSelected)}
                      onClick={() => {
                        if (match_seat_id && status === 'AVAILABLE') {
                          onSeatToggle(seat, !isSelected);
                        } else if (isSelected) {
                          onSeatToggle(seat, false);
                        }
                      }}
                      className={`relative w-8 h-9 rounded-t-xl rounded-b-sm border-2 flex items-center justify-center text-xs font-bold transition-all duration-200 ${bgColor} ${textColor} ${borderColor} ${cursor} ${opacity}`}
                      title={`Row ${row.name} - Seat ${seat.seat_number} | ₹${blockPrice.toLocaleString()}`}
                    >
                      {seat.seat_number}
                    </button>
                  );
                })}
              </div>
              
              {/* Row Label Right */}
              <div className="w-8 text-left font-bold text-on-surface-variant text-sm select-none">
                {row.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
