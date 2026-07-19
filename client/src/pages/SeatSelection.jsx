import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MatchService, BookingService } from '../services/api';
import StadiumSVG from '../components/StadiumSVG';
import BlockSelector from '../components/BlockSelector';
import SeatGrid from '../components/SeatGrid';

// Step identifiers
const STEP = { STADIUM: 'stadium', SEATS: 'seats' };

export default function SeatSelection() {
  const { id: matchId } = useParams();
  const navigate = useNavigate();

  // Match info
  const [match, setMatch] = useState(null);

  // Navigation state
  const [step, setStep] = useState(STEP.STADIUM);
  const [selectedStand, setSelectedStand] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);

  // Data
  const [stands, setStands] = useState([]);
  const [blockData, setBlockData] = useState(null); // { block, rows }

  // Loading
  const [loading, setLoading] = useState(false);

  // Selected seats: [{match_seat_id, seat_number, row_name, price}]
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Timer (5 min countdown once first seat selected)
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerActive, setTimerActive] = useState(false);
  const [isProceeding, setIsProceeding] = useState(false);

  // Hover for SVG
  const [hoveredStand, setHoveredStand] = useState(null);

  // Load match + stands on mount
  useEffect(() => {
    const token = localStorage.getItem('supabase_token');
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    setLoading(true);
    Promise.all([
      MatchService.getById(matchId),
      MatchService.getStands(matchId),
    ])
      .then(([matchRes, standsRes]) => {
        setMatch(matchRes.data);
        setStands(standsRes.data);
      })
      .catch(err => console.error('Failed to load match/stands:', err))
      .finally(() => setLoading(false));
  }, [matchId, navigate]);

  // Timer countdown
  useEffect(() => {
    if (!timerActive) return;
    if (timeLeft <= 0) {
      alert('Your seat selection timed out. Please start over.');
      navigate(`/match/${matchId}`);
      return;
    }
    const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(t);
  }, [timerActive, timeLeft, matchId, navigate]);

  const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // ── Block selected ──
  const handleSelectBlock = async (stand, block) => {
    setSelectedStand(stand);
    setSelectedBlock(block);
    setLoading(true);
    try {
      const res = await MatchService.getBlockSeats(matchId, block.id);
      setBlockData(res.data);
      setStep(STEP.SEATS);
    } catch (err) {
      alert('Could not load seats. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Seat toggled ──
  const handleSeatToggle = useCallback(async (seat, adding) => {
    if (adding) {
      try {
        await MatchService.lockSeat(matchId, seat.match_seat_id);
        setSelectedSeats(prev => [...prev, {
          match_seat_id: seat.match_seat_id,
          seat_number: seat.seat_number,
          row_name: blockData?.rows.find(r => r.seats.some(s => s.match_seat_id === seat.match_seat_id))?.name || '',
          price: seat.price,
          block_name: selectedBlock?.name,
          stand_name: selectedStand?.name,
        }]);
        if (!timerActive) setTimerActive(true);
      } catch (err) {
        alert(err.message || 'Could not lock seat. It may have been locked by another user.');
      }
    } else {
      setSelectedSeats(prev => prev.filter(s => s.match_seat_id !== seat.match_seat_id));
    }
  }, [matchId, blockData, selectedBlock, selectedStand, timerActive]);

  // ── Proceed to checkout ──
  const handleProceed = async () => {
    if (selectedSeats.length === 0) return;
    setIsProceeding(true);
    try {
      const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
      navigate('/checkout', {
        state: {
          matchId,
          seatIds: selectedSeats.map(s => s.match_seat_id),
          subtotal
        }
      });
    } finally {
      setIsProceeding(false);
    }
  };

  // ── Back navigation ──
  const goBack = () => {
    if (step === STEP.SEATS) { setStep(STEP.STADIUM); setBlockData(null); setSelectedBlock(null); setSelectedStand(null); }
    else navigate(`/match/${matchId}`);
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  if (loading && step === STEP.STADIUM && !match) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-on-surface-variant">Loading stadium...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen flex flex-col text-on-surface">

      {/* ── Top AppBar ── */}
      <header className="bg-primary sticky top-0 z-50 shadow-md">
        <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={goBack}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-white text-[20px]">arrow_back</span>
            </button>
            <div>
              <h1 className="text-headline-sm font-headline-sm font-black text-white leading-tight">
                {match ? `${match.team_a.short_code} vs ${match.team_b.short_code}` : 'Select Seats'}
              </h1>
              <p className="text-label-xs text-white/60">
                {match?.stadium?.name}
              </p>
            </div>
          </div>

          {timerActive && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold
              ${timeLeft <= 60
                ? 'bg-error/20 border-error/40 text-error animate-pulse'
                : 'bg-white/10 border-white/20 text-white'}`}>
              <span className="material-symbols-outlined text-[16px]">timer</span>
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
      </header>

      {/* ── Breadcrumb ── */}
      <div className="bg-surface-container-low border-b border-outline-variant/20 px-margin-mobile md:px-margin-desktop py-2">
        <div className="max-w-container-max-width mx-auto flex items-center gap-1 text-label-sm font-label-sm">
          <button onClick={() => setStep(STEP.STADIUM)}
            className={`hover:text-primary transition-colors ${step === STEP.STADIUM ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
            Stadium
          </button>
          {selectedStand && step === STEP.SEATS && (
            <>
              <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
              <span className="text-primary font-bold">{selectedStand.name} - Block {selectedBlock.name}</span>
            </>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="flex-grow max-w-container-max-width mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-md md:py-stack-lg">
        <div className={`flex gap-8 ${selectedSeats.length > 0 ? 'md:flex-row' : 'flex-col'}`}>

          {/* Left: Dynamic content area */}
          <div className="flex-grow min-w-0">
            {loading && step !== STEP.STADIUM ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="text-on-surface-variant text-label-md">Loading...</p>
              </div>
            ) : (
              <>
                {step === STEP.STADIUM && (
                  <StadiumSVG
                    standsData={stands}
                    hoveredBlock={hoveredStand}
                    setHoveredBlock={setHoveredStand}
                    onSelectBlock={handleSelectBlock}
                  />
                )}

                {step === STEP.SEATS && blockData && (
                  <div className="flex flex-col gap-4">
                    {/* Block header */}
                    <div className="flex items-center gap-4">
                      <button onClick={goBack}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/30">
                        <span className="material-symbols-outlined text-[20px] text-on-surface-variant">arrow_back</span>
                      </button>
                      <div>
                        <h2 className="text-headline-md font-headline-md font-bold text-on-surface">
                          {selectedStand?.name} — Block {selectedBlock?.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-label-sm font-label-sm px-2 py-0.5 rounded-full font-bold"
                            style={{ background: selectedBlock?.color_code + '30', color: selectedBlock?.color_code }}>
                            {selectedBlock?.category}
                          </span>
                          <span className="text-label-sm font-label-sm text-on-surface-variant">
                            ₹{selectedBlock?.price?.toLocaleString()} per seat
                          </span>
                        </div>
                      </div>
                    </div>

                    <SeatGrid
                      matchId={matchId}
                      block={blockData.block}
                      rows={blockData.rows}
                      selectedSeats={selectedSeats}
                      onSeatToggle={handleSeatToggle}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right: Booking Summary (visible when seats selected) */}
          {selectedSeats.length > 0 && (
            <aside className="w-full md:w-80 shrink-0">
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm sticky top-24">
                <h3 className="text-headline-sm font-headline-sm font-bold text-on-surface mb-4">
                  Your Selection
                </h3>

                {/* Selected seat list */}
                <div className="flex flex-col gap-2 mb-4 max-h-48 overflow-y-auto pr-1">
                  {selectedSeats.map(seat => (
                    <div key={seat.match_seat_id}
                      className="flex justify-between items-center bg-surface-container rounded-lg px-3 py-2">
                      <div>
                        <p className="text-label-md font-label-md font-bold text-on-surface">
                          {seat.stand_name?.split(' ')[0]} · Block {seat.block_name} · Row {seat.row_name}
                        </p>
                        <p className="text-label-sm font-label-sm text-on-surface-variant">
                          Seat {seat.seat_number}
                        </p>
                      </div>
                      <span className="text-label-md font-label-md font-bold text-primary">
                        ₹{seat.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-outline-variant/30 pt-3 mb-4">
                  <div className="flex justify-between text-label-md font-label-md text-on-surface-variant mb-1">
                    <span>Subtotal ({selectedSeats.length} ticket{selectedSeats.length > 1 ? 's' : ''})</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-headline-sm font-headline-sm font-bold text-on-surface">
                    <span>Total</span>
                    <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceed}
                  disabled={isProceeding}
                  className="w-full bg-primary text-on-primary font-bold text-label-lg font-label-lg py-3.5 rounded-xl hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {isProceeding ? 'Preparing...' : 'Proceed to Pay'}
                  {!isProceeding && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
                </button>

                <p className="text-label-xs text-on-surface-variant/60 text-center mt-3">
                  Max 6 seats per booking
                </p>
              </div>
            </aside>
          )}
        </div>
      </main>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] max-w-sm w-full p-6 text-center bg-white">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">lock</span>
            </div>
            <h3 className="text-headline-md font-headline-md text-on-surface mb-2 font-bold">Login Required</h3>
            <p className="text-body-md font-body-md text-on-surface-variant mb-6">
              Dude,I dont know I wish i could So please Login
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-primary text-white font-bold text-label-md font-label-md py-3 rounded-xl hover:bg-primary-fixed-variant transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => navigate(-1)}
                className="w-full bg-transparent border border-outline text-on-surface-variant font-bold text-label-md font-label-md py-3 rounded-xl hover:bg-surface-container-high transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
