import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { MatchService } from '../services/api';
import clsx from 'clsx';
import LoginModal from './LoginModal';

const socket = io('http://localhost:5000');

export default function SeatMap({ matchId, categoryId, onSeatSelect, selectedSeatIds }) {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    MatchService.getSeats(matchId)
      .then(res => {
        // Filter seats by the selected category if provided
        const allSeats = res.data;
        if (categoryId) {
          setSeats(allSeats.filter(s => s.seat?.section?.category?.id === categoryId));
        } else {
          setSeats(allSeats);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load seats", err);
        setLoading(false);
      });

    socket.emit('join_match', matchId);

    socket.on('seat_locked', ({ seatId, lockedBy }) => {
      setSeats(prev => prev.map(s => 
        s.id === seatId ? { ...s, status: 'LOCKED', locked_by: lockedBy } : s
      ));
    });

    socket.on('seat_booked', ({ matchSeatIds }) => {
      setSeats(prev => prev.map(s => 
        matchSeatIds.includes(s.id) ? { ...s, status: 'BOOKED' } : s
      ));
    });

    return () => {
      socket.emit('leave_match', matchId);
      socket.off('seat_locked');
      socket.off('seat_booked');
    };
  }, [matchId, categoryId]);

  const handleSeatClick = async (seat) => {
    const isSelected = selectedSeatIds.includes(seat.id);
    
    if (isSelected) {
      // Unselect it locally (in reality we should unlock it via API if desired, but for hackathon UI is fine)
      onSeatSelect(seat.id, seat);
      setSeats(prev => prev.map(s => s.id === seat.id ? { ...s, status: 'AVAILABLE' } : s));
      return;
    }

    if (seat.status !== 'AVAILABLE') return;

    try {
      await MatchService.lockSeat(matchId, seat.id);
      onSeatSelect(seat.id, seat);
      setSeats(prev => prev.map(s => s.id === seat.id ? { ...s, status: 'LOCKED' } : s));
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('unauthorized')) {
        setShowLoginModal(true);
      } else {
        alert(err.message || 'Could not lock seat');
      }
    }
  };

  if (loading) return <div className="text-center p-8 text-on-surface-variant font-label-md">Loading seats...</div>;

  // Group by sections for display
  const sections = {};
  seats.forEach(s => {
    const sectionName = s.seat.section.name;
    if (!sections[sectionName]) sections[sectionName] = [];
    sections[sectionName].push(s);
  });

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Pitch Indicator */}
      <div className="w-full max-w-xl mx-auto h-24 bg-surface-variant rounded-full flex flex-col items-center justify-center border-4 border-outline-variant/30 shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-fixed-dim/20 to-transparent"></div>
        <span className="font-headline-md text-headline-md text-on-surface-variant/50 uppercase tracking-[0.5em] font-black z-10">Pitch</span>
      </div>
      
      {/* Legend */}
      <div className="bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant/30 rounded-xl p-4 flex justify-center gap-6 shadow-sm mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-surface-container rounded border border-outline"></div> 
          <span className="font-label-sm text-label-sm text-on-surface-variant">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-secondary-container rounded shadow-sm"></div> 
          <span className="font-label-sm text-label-sm text-on-surface-variant">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary-fixed rounded"></div> 
          <span className="font-label-sm text-label-sm text-on-surface-variant">Locked (Others)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-error/20 rounded border border-error/50"></div> 
          <span className="font-label-sm text-label-sm text-on-surface-variant">Booked</span>
        </div>
      </div>

      {Object.keys(sections).map(sectionName => (
        <div key={sectionName} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
          <h3 className="font-headline-md text-headline-md text-on-surface text-center mb-6">{sectionName}</h3>
          
          <div className="grid grid-cols-[repeat(auto-fit,minmax(2rem,1fr))] gap-2 justify-center max-w-lg mx-auto">
            {sections[sectionName].sort((a, b) => {
              if(a.seat.row_label === b.seat.row_label) return a.seat.seat_number - b.seat.seat_number;
              return a.seat.row_label.localeCompare(b.seat.row_label);
            }).map(s => {
              const isSelected = selectedSeatIds.includes(s.id);
              
              return (
                <button
                  key={s.id}
                  onClick={() => handleSeatClick(s)}
                  disabled={s.status === 'BOOKED' || (s.status === 'LOCKED' && !isSelected)}
                  className={clsx(
                    "w-8 h-8 rounded-t-lg rounded-b flex items-center justify-center text-[10px] font-bold transition-all transform hover:scale-110",
                    s.status === 'AVAILABLE' && "bg-surface-container border border-outline/30 text-on-surface-variant hover:bg-primary-fixed hover:text-on-primary-fixed cursor-pointer",
                    s.status === 'BOOKED' && "bg-error/10 border border-error/30 text-error/50 cursor-not-allowed",
                    s.status === 'LOCKED' && isSelected && "bg-secondary-container text-on-secondary-container shadow-md scale-105 border-b-2 border-secondary",
                    s.status === 'LOCKED' && !isSelected && "bg-primary-fixed text-primary-fixed-variant cursor-not-allowed"
                  )}
                  title={`Row ${s.seat.row_label} - Seat ${s.seat.seat_number} (₹${s.price})`}
                >
                  {s.seat.seat_number}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
}
