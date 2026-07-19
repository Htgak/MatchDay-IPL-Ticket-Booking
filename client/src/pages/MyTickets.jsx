import React, { useEffect, useState } from 'react';
import { BookingService } from '../services/api';
import { Link } from 'react-router-dom';

export default function MyTickets() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BookingService.getUserBookings()
      .then(res => setBookings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen text-center p-10 mt-10 text-on-surface-variant font-label-md">Loading tickets...</div>;

  return (
    <div className="w-full max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-stack-xl min-h-screen">
      <header className="mb-stack-lg">
        <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-primary mb-2">My Tickets</h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant">Manage your upcoming matches and view past attendance.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-outline-variant mb-stack-lg">
        <button className="text-primary font-bold border-b-2 border-primary pb-2 px-1 text-label-md font-label-md">Upcoming</button>
        <button className="text-on-surface-variant hover:text-primary transition-colors pb-2 px-1 text-label-md font-label-md font-medium">Past Matches</button>
      </div>

      {/* Tickets List */}
      <div className="flex flex-col gap-stack-md">
        {bookings.length === 0 ? (
          <div className="text-center py-stack-xl text-on-surface-variant bg-surface-container-lowest rounded-xl border border-outline-variant/30">
            <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">confirmation_number</span>
            <h3 className="font-headline-md text-headline-md mb-2">No tickets found</h3>
            <p>You haven't booked any matches yet.</p>
            <Link to="/matches" className="inline-block mt-4 text-primary font-bold hover:underline">Browse Matches</Link>
          </div>
        ) : bookings.map(booking => {
          const match = booking.match;
          const isLive = match.status === 'LIVE';
          
          return (
            <article key={booking.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 flex flex-col md:flex-row overflow-hidden relative shadow-[0_4px_20px_rgba(27,42,107,0.04)] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(27,42,107,0.08)] transition-all">
              {/* Status Badge */}
              <div className={`absolute top-4 left-4 md:left-auto md:right-4 z-10 text-label-sm font-label-sm px-2 py-1 rounded shadow-sm font-bold ${isLive ? 'bg-error text-on-error' : 'bg-primary-container text-white'}`}>
                {isLive ? 'LIVE' : 'UPCOMING'}
              </div>

              {/* Match Thumbnail */}
              <div className="md:w-64 h-48 md:h-auto shrink-0 relative bg-surface-variant p-4 flex items-center justify-center">
                <div className="flex w-full h-full items-center justify-center gap-4">
                  <img className="w-16 h-16 object-contain" src={match.team_a.logo_url} alt={match.team_a.short_code} />
                  <span className="font-display-lg text-outline-variant italic">VS</span>
                  <img className="w-16 h-16 object-contain" src={match.team_b.logo_url} alt={match.team_b.short_code} />
                </div>
              </div>

              {/* Ticket Details */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">stadium</span>
                    <span className="text-label-sm font-label-sm text-on-surface-variant">{match.stadium.name}, {match.stadium.city}</span>
                  </div>
                  <h2 className="text-headline-md font-headline-md text-primary mb-1">{match.team_a.name} vs {match.team_b.name}</h2>
                  <p className="text-body-md font-body-md text-on-surface">T20 League Match</p>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  <div>
                    <span className="text-label-sm font-label-sm text-outline block mb-1">Date</span>
                    <span className="text-body-md font-body-md font-bold text-on-surface">{new Date(match.match_date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-label-sm font-label-sm text-outline block mb-1">Time</span>
                    <span className="text-body-md font-body-md font-bold text-on-surface">{new Date(match.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div>
                    <span className="text-label-sm font-label-sm text-outline block mb-1">Seats</span>
                    <span className="text-body-md font-body-md font-bold text-on-surface">{booking.seats.length} Ticket(s)</span>
                  </div>
                  <div>
                    <span className="text-label-sm font-label-sm text-outline block mb-1">Status</span>
                    <span className={`text-body-md font-body-md font-bold ${booking.status === 'CONFIRMED' ? 'text-primary' : 'text-error'}`}>{booking.status}</span>
                  </div>
                </div>
              </div>

              {/* QR Section */}
              <div className="bg-surface-container-lowest border-t md:border-t-0 md:border-l border-outline-variant/30 p-6 flex items-center justify-center md:w-48 shrink-0 flex-col gap-3">
                <div className="w-24 h-24 border border-outline-variant/50 p-1 rounded bg-white relative">
                  <div className="w-full h-full opacity-80" style={{ background: 'repeating-linear-gradient(45deg, #001256, #001256 2px, #ffffff 2px, #ffffff 4px)' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[32px] bg-white rounded-sm p-1">qr_code_scanner</span>
                  </div>
                </div>
                <Link to={`/ticket/${booking.id}`} className="text-label-md font-label-md text-primary font-bold hover:text-on-primary-fixed-variant transition-colors flex items-center gap-1">
                  View Pass
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
