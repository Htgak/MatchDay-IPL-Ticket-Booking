import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookingService } from '../services/api';

export default function TicketDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BookingService.getUserBookings()
      .then(res => {
        const b = res.data.find(b => b.id === id);
        setBooking(b);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen text-center p-10 mt-10 text-on-surface-variant font-label-md">Loading ticket...</div>;
  if (!booking) return <div className="min-h-screen text-center p-10 mt-10 text-on-surface-variant font-label-md">Ticket not found <Link to="/tickets" className="text-primary underline block mt-4">Go to My Tickets</Link></div>;

  const match = booking.match;
  const firstSeat = booking.seats[0]?.match_seat?.seat;
  const blockName = firstSeat?.row?.block?.name || 'N/A';
  const seatsList = booking.seats.map(s => `${s.match_seat?.seat?.row?.name}-${s.match_seat?.seat?.seat_number}`).join(', ') || '-';

  const downloadPDF = () => {
    const element = document.getElementById('ticket-card');
    const opt = {
      margin:       0.2,
      filename:     `IPL-Ticket-${booking.id.substring(0, 8)}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    // Dynamically load html2pdf from CDN
    if (window.html2pdf) {
      window.html2pdf().from(element).set(opt).save();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        window.html2pdf().from(element).set(opt).save();
      };
      document.head.appendChild(script);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md antialiased w-full absolute top-0 z-50">
      <main className="flex-grow flex items-center justify-center py-stack-xl px-margin-mobile md:px-margin-desktop bg-surface-container-low w-full">
        <div className="max-w-md w-full animate-[fade-in-up_0.5s_ease-out]">
          
          <div className="text-center mb-stack-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-container text-on-secondary-fixed mb-4 shadow-[0_4px_20px_rgba(27,42,107,0.08)]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "32px" }}>check_circle</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary">Booking Confirmed!</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">Your tickets are ready. See you at the match.</p>
          </div>
          
          {/* Ticket Card */}
          <div id="ticket-card" className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(27,42,107,0.08)] border border-surface-variant flex flex-col bg-white">
            
            {/* Match Details Header */}
            <div className="p-stack-md bg-primary-container text-on-primary-container relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ background: 'repeating-linear-gradient(45deg, #001256, #001256 10px, transparent 10px, transparent 20px)' }}></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-2 py-1 bg-secondary-container text-on-secondary-fixed rounded text-label-sm font-label-sm mb-2">T20 LEAGUE</span>
                    <h2 className="font-headline-md text-headline-md text-on-primary font-bold">{match.team_a.name} vs {match.team_b.name}</h2>
                  </div>
                  <div className="text-right">
                    <p className="font-label-sm text-label-sm text-primary-fixed-dim">DATE</p>
                    <p className="font-label-md text-label-md text-on-primary font-bold">{new Date(match.match_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center text-primary-fixed-dim mt-2">
                  <span className="material-symbols-outlined mr-2" style={{ fontSize: "16px" }}>stadium</span>
                  <span className="font-label-sm text-label-sm">{match.stadium.name}, {match.stadium.city}</span>
                </div>
              </div>
            </div>
            
            {/* Seat Info */}
            <div className="p-stack-md border-b border-dashed border-outline-variant ticket-cutout bg-surface-container-lowest relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-surface-container-low"></div>
              <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-surface-container-low"></div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">TICKETS</p>
                  <p className="font-headline-md text-headline-md text-primary font-bold">{booking.seats.length}</p>
                </div>
                <div className="border-l border-r border-outline-variant px-2">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">BLOCK</p>
                  <p className="font-headline-md text-headline-md text-primary font-bold">{blockName}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">SEAT</p>
                  <p className="font-headline-md text-headline-md text-primary font-bold">{seatsList}</p>
                </div>
              </div>
            </div>
            
            {/* QR Code Section */}
            <div className="p-stack-md flex flex-col items-center bg-surface-container-lowest relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-surface-container-low"></div>
              <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-surface-container-low"></div>
              
              <div className="p-4 bg-white border border-surface-variant rounded-lg mb-4">
                <img 
                  className="w-48 h-48 object-cover rounded mix-blend-multiply" 
                  alt="QR Code" 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TKT-${booking.id}`}
                />
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Scan at the turnstile for entry</p>
              <p className="font-label-md text-label-md text-primary font-mono mt-2 tracking-widest">TKT-{booking.id.toString().substring(0, 8).toUpperCase()}</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-stack-lg flex flex-col gap-4">
            <button 
              onClick={downloadPDF}
              className="w-full bg-primary text-white font-label-md text-label-md py-4 rounded-xl flex items-center justify-center hover:-translate-y-0.5 transition-transform shadow-md hover:bg-primary-fixed-variant"
            >
              <span className="material-symbols-outlined mr-2">download</span>
              Download PDF Ticket
            </button>
            <Link to="/tickets" className="w-full bg-transparent border-2 border-primary text-primary font-label-md text-label-md py-4 rounded-xl flex items-center justify-center hover:bg-primary/5 transition-colors text-center">
              Back to My Tickets
            </Link>
          </div>
          
        </div>
      </main>
      
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .ticket-cutout { position: relative; }
        .ticket-cutout::before, .ticket-cutout::after {
          content: '';
          position: absolute;
          top: -12px;
          width: 24px;
          height: 24px;
          background-color: theme('colors.surface-container-low');
          border-radius: 50%;
          z-index: 10;
        }
        .ticket-cutout::before { left: -12px; }
        .ticket-cutout::after { right: -12px; }
      `}</style>
    </div>
  );
}
