import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MatchService } from '../services/api';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MatchService.getAll()
      .then(res => setMatches(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
      {/* Filter Bar */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 mb-stack-lg flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="w-full md:w-1/3 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-outline">sports_cricket</span>
          <input className="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Select Team" type="text" />
        </div>
        <div className="w-full md:w-1/3 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-outline">stadium</span>
          <input className="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Select Stadium" type="text" />
        </div>
        <div className="w-full md:w-1/3 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-outline">calendar_month</span>
          <input className="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="date" />
        </div>
        <button className="w-full md:w-auto bg-primary-container text-white px-6 py-2 rounded-lg text-label-md font-label-md font-bold hover:bg-primary transition-colors flex-shrink-0">
          Apply Filters
        </button>
      </div>

      {/* Section Title */}
      <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg mb-stack-md">Live Matches</h1>
      
      {/* Grid of Match Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {loading ? (
          <div className="col-span-full text-center p-10 text-on-surface-variant">Loading matches...</div>
        ) : matches.length === 0 ? (
          <div className="col-span-full text-center p-10 text-on-surface-variant">No matches found.</div>
        ) : matches.map(match => (
          <Link to={`/match/${match.id}`} key={match.id} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-md flex flex-col group cursor-pointer transition-transform duration-300 hover:-translate-y-1">
            <div className="relative h-48 w-full overflow-hidden">
              <div 
                className="bg-cover bg-center w-full h-full transition-transform duration-500 group-hover:scale-105" 
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=2805')` }}
              ></div>
              <div className="absolute top-4 right-4 bg-secondary-container text-on-surface px-2 py-1 rounded text-label-sm font-label-sm font-bold flex items-center gap-1 shadow-sm">
                {match.status}
              </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mb-1 text-primary-container font-bold overflow-hidden shadow-inner">
                    <img src={match.team_a.logo_url} alt={match.team_a.short_code} className="w-8 h-8 object-contain" />
                  </div>
                  <span className="text-label-md font-label-md">{match.team_a.short_code}</span>
                </div>
                <div className="text-headline-md font-headline-md text-primary">v</div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mb-1 text-primary-container font-bold overflow-hidden shadow-inner">
                    <img src={match.team_b.logo_url} alt={match.team_b.short_code} className="w-8 h-8 object-contain" />
                  </div>
                  <span className="text-label-md font-label-md">{match.team_b.short_code}</span>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-body-md font-body-md text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline">stadium</span> {match.stadium.name}
                </p>
                <p className="text-body-md font-body-md text-on-surface-variant flex items-center gap-2 mt-1">
                  <span className="material-symbols-outlined text-outline">schedule</span> {new Date(match.match_date).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="mt-auto flex justify-between items-center pt-4 border-t border-outline-variant">
                <span className="text-headline-md font-headline-md text-primary">₹500+</span>
                <button className="bg-primary text-white px-4 py-2 rounded-lg text-label-md font-label-md font-bold hover:bg-primary-fixed-variant transition-colors">Book Now</button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
