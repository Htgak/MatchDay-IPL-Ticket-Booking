import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MatchService } from '../services/api';

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    MatchService.getAll()
      .then(res => setMatches(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const slideImages = [
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=2938",
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=2805",
    "https://images.unsplash.com/photo-1607734834519-d8576ae60ea6?auto=format&fit=crop&q=80&w=2805"
  ];

  const featuredMatches = matches.slice(0, 3);
  const upcomingMatches = matches.length > 3 ? matches.slice(3) : matches;

  useEffect(() => {
    if (featuredMatches.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % featuredMatches.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredMatches.length]);

  const currentMatch = featuredMatches[activeSlide];

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[614px] min-h-[400px] max-h-[600px] bg-primary flex items-end">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent z-10"></div>
          {currentMatch ? (
            <img 
              className="w-full h-full object-cover object-center transition-all duration-1000 ease-in-out" 
              alt="Cricket stadium at night" 
              src={slideImages[activeSlide % slideImages.length]}
              key={activeSlide} // Trigger re-render transition
            />
          ) : (
            <div className="w-full h-full bg-primary-dark"></div>
          )}
        </div>
        
        <div className="relative z-20 w-full max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop pb-stack-lg md:pb-stack-xl flex flex-col md:flex-row md:justify-between md:items-end">
          <div className="max-w-2xl text-white">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-secondary-container text-on-secondary-fixed px-3 py-1 rounded-sm text-label-sm font-label-sm font-bold uppercase tracking-wider">Featured Match</span>
              {currentMatch && (
                <span className="text-white/80 text-label-sm font-label-sm">
                  {new Date(currentMatch.match_date).toLocaleString([], { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
            <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg mb-4 text-white min-h-[1.2em] transition-opacity duration-500">
              {currentMatch ? `${currentMatch.team_a.name} vs ${currentMatch.team_b.name}` : 'Loading...'}
            </h1>
            <p className="text-body-lg font-body-lg text-white/90 mb-6 max-w-xl min-h-[3em]">
              {currentMatch ? `The rivalry resumes at the ${currentMatch.stadium.name}. Secure your seats for the most anticipated clash of the season.` : 'Get ready for the biggest cricket matches.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {currentMatch && (
                <Link to={`/match/${currentMatch.id}`} className="bg-secondary-container text-on-secondary-fixed font-bold text-label-md font-label-md px-6 py-4 rounded-lg hover:bg-secondary-fixed transition-colors text-center w-full sm:w-auto">
                  Get Tickets
                </Link>
              )}
              <Link to="/matches" className="bg-transparent border-2 border-white/30 text-white font-bold text-label-md font-label-md px-6 py-4 rounded-lg hover:bg-white/10 transition-colors text-center w-full sm:w-auto">
                View All Matches
              </Link>
            </div>
          </div>
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {featuredMatches.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${activeSlide === index ? 'w-8 bg-secondary-container' : 'w-2 bg-white/40'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Upcoming Matches Horizontal Scroll */}
      <section className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-stack-xl">
        <div className="flex justify-between items-end mb-stack-lg">
          <div>
            <span className="text-outline text-label-sm font-label-sm uppercase tracking-[0.15em] font-bold block mb-2">T20 League</span>
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface">Upcoming Matches</h2>
          </div>
          <Link to="/matches" className="hidden md:flex items-center text-primary font-label-md text-label-md hover:text-primary-fixed-variant transition-colors group">
            View All <span className="material-symbols-outlined ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-6 pt-2 -mx-margin-mobile px-margin-mobile md:-mx-margin-desktop md:px-margin-desktop no-scrollbar snap-x snap-mandatory">
          {loading ? (
            <div className="w-full text-center p-8 text-on-surface-variant">Loading matches...</div>
          ) : upcomingMatches.map(match => (
            <Link to={`/match/${match.id}`} key={match.id} className="w-[85vw] md:w-[400px] flex-none bg-surface-container-lowest rounded-xl card-shadow overflow-hidden flex flex-col snap-start group cursor-pointer relative">
              <div className="relative h-48 w-full bg-surface-variant overflow-hidden">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={match.stadium.name} 
                  src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=2805"
                />
                <div className="absolute top-4 right-4 bg-primary text-white text-label-sm font-label-sm font-bold px-3 py-1.5 rounded-sm shadow-md uppercase">
                  {new Date(match.match_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="text-on-surface-variant text-label-sm font-label-sm mb-1">{match.stadium.name}, {match.stadium.city}</span>
                    <h3 className="text-headline-md font-headline-md text-on-surface leading-tight flex items-center gap-2">
                      <img src={match.team_a.logo_url} alt={match.team_a.short_code} className="w-6 h-6 object-contain" />
                      {match.team_a.short_code}
                      <span className="text-outline-variant text-body-md font-body-md mx-1">v</span> 
                      {match.team_b.short_code}
                      <img src={match.team_b.logo_url} alt={match.team_b.short_code} className="w-6 h-6 object-contain" />
                    </h3>
                  </div>
                </div>
                <div className="flex items-center text-on-surface-variant text-body-md font-body-md mb-6 space-x-2">
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  <span>{new Date(match.match_date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="mt-auto pt-4 border-t border-outline-variant/30 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-outline text-label-sm font-label-sm">Status</span>
                    <span className="text-on-surface font-bold text-body-lg font-body-lg text-primary">{match.status}</span>
                  </div>
                  <button className="bg-primary text-white hover:bg-primary-fixed-variant px-4 py-2 rounded-lg text-label-md font-label-md font-bold transition-colors">Book</button>
                </div>
              </div>
            </Link>
          ))}

          {/* View All Mobile Link */}
          <div className="w-12 md:hidden flex-none flex items-center justify-center snap-start">
            <Link to="/matches" className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center text-primary shadow-sm active:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
