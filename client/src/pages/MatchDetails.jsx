import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MatchService } from '../services/api';

export default function MatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    MatchService.getById(id)
      .then(res => setMatch(res.data))
      .catch(console.error);
  }, [id]);

  const handleContinue = () => {
    navigate(`/match/${id}/seats`);
  };

  if (!match) return <div className="min-h-screen flex items-center justify-center text-on-surface-variant">Loading match details...</div>;

  return (
    <div className="w-full min-h-screen pb-stack-xl">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] md:h-[512px] overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Stadium Hero Image" 
            className="w-full h-full object-cover object-center opacity-40" 
            src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=2831"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full h-full max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop flex flex-col justify-end pb-stack-lg">
          <div className="mb-stack-sm flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider">
              {match.status === 'LIVE' && <span className="w-2 h-2 rounded-full bg-error mr-2 animate-pulse"></span>}
              {match.status}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-container/80 backdrop-blur-sm text-on-primary-container font-label-sm text-label-sm uppercase tracking-wider border border-primary-fixed/30">
              T20 League
            </span>
          </div>
          
          <div className="flex items-center justify-between w-full">
            {/* Team A */}
            <div className="flex flex-col items-center md:items-start text-on-background">
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-surface-container-lowest shadow-lg flex items-center justify-center mb-4 border-4 border-primary p-2 overflow-hidden">
                <img alt={match.team_a.short_code} className="w-full h-full object-contain" src={match.team_a.logo_url} />
              </div>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-center md:text-left drop-shadow-md">{match.team_a.name}</h1>
              <p className="font-label-md text-label-md text-on-background/80 uppercase tracking-widest mt-1">{match.team_a.short_code}</p>
            </div>
            
            {/* VS */}
            <div className="flex flex-col items-center justify-center mx-4 md:mx-8">
              <div className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-secondary-container italic opacity-90 drop-shadow-lg">VS</div>
            </div>
            
            {/* Team B */}
            <div className="flex flex-col items-center md:items-end text-on-background">
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-surface-container-lowest shadow-lg flex items-center justify-center mb-4 border-4 border-secondary-container p-2 overflow-hidden">
                <img alt={match.team_b.short_code} className="w-full h-full object-contain" src={match.team_b.logo_url} />
              </div>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-center md:text-right drop-shadow-md">{match.team_b.name}</h1>
              <p className="font-label-md text-label-md text-on-background/80 uppercase tracking-widest mt-1">{match.team_b.short_code}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content Area */}
      <div className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop mt-4 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Left Column: Details & Venue */}
          <div className="lg:col-span-2 space-y-gutter">
            {/* Match Info Bar */}
            <div className="bg-surface-container-lowest shadow-sm rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 border border-outline-variant/30">
              <div className="flex items-center gap-3 text-on-surface">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">calendar_today</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Date & Time</p>
                  <p className="font-headline-md text-headline-md">{new Date(match.match_date).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-outline-variant/30"></div>
              <div className="flex items-center gap-3 text-on-surface">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">stadium</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Venue</p>
                  <p className="font-headline-md text-headline-md">{match.stadium.name}</p>
                </div>
              </div>
            </div>
            
            {/* Venue Section */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
                <h2 className="font-headline-md text-headline-md text-on-surface">Venue Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-primary">{match.stadium.name}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1 flex items-start gap-1">
                      <span className="material-symbols-outlined text-[18px] mt-0.5">location_on</span>
                      {match.stadium.city}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/20">
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Capacity</p>
                      <p className="font-body-md text-body-md font-semibold text-on-surface">{match.stadium.total_capacity?.toLocaleString() ?? 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="h-64 md:h-auto bg-surface-container relative">
                  <img alt="Venue Map" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&q=80&w=2600"/>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Ticket Selection */}
          <div className="lg:col-span-1">
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/20 sticky top-24 overflow-hidden flex flex-col">
              <div className="p-6 bg-primary text-white">
                <h2 className="font-headline-md text-headline-md mb-1">Book Your Seats</h2>
                <p className="font-body-md text-body-md text-white/80">Interactive Stadium Layout</p>
              </div>
              
              <div className="p-6 space-y-4 bg-surface-bright flex flex-col items-center justify-center min-h-[200px] text-center">
                <span className="material-symbols-outlined text-[48px] text-primary/50 mb-2">stadium</span>
                <p className="text-body-md text-on-surface-variant">
                  Choose your preferred stand, select your block, and pick your exact seats from our new interactive bird's-eye view stadium map.
                </p>
              </div>
              
              {/* CTA Area */}
              <div className="p-6 border-t border-outline-variant/20 bg-surface-container-lowest">
                <button 
                  onClick={handleContinue}
                  className="w-full bg-primary hover:bg-primary-fixed-variant text-white font-label-lg text-label-lg font-bold py-4 rounded-xl transition-colors shadow-md flex justify-center items-center gap-2"
                >
                  Proceed to Stadium Layout
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
