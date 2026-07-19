import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('supabase_token');
  const userName = localStorage.getItem('user_name') || 'Profile';

  const handleLogout = () => {
    localStorage.removeItem('supabase_token');
    localStorage.removeItem('user_name');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="bg-primary dark:bg-primary-container text-on-primary dark:text-on-primary-container docked full-width top-0 sticky shadow-md z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max-width mx-auto">
        {/* Brand Logo */}
        <Link to="/" className="text-headline-md font-headline-md font-black text-white flex-shrink-0 mr-gutter">
          MatchDay
        </Link>
        
        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex flex-1 items-center space-x-6 justify-center">
          <Link to="/matches" className="text-white/80 font-medium hover:text-white transition-colors hover:bg-primary-fixed-variant/20 rounded-lg px-3 py-2 text-label-md font-label-md">
            Matches
          </Link>
          <Link to="/tickets" className="text-white/80 font-medium hover:text-white transition-colors hover:bg-primary-fixed-variant/20 rounded-lg px-3 py-2 text-label-md font-label-md">
            My Tickets
          </Link>
        </div>

        {/* Trailing Actions & Search */}
        <div className="flex items-center space-x-4">
          {/* Search removed as per user request */}
          {token ? (
            <div className="hidden lg:flex items-center gap-4">
              <span className="text-white font-medium bg-primary-fixed-variant/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">person</span>
                {userName}
              </span>
              <button onClick={handleLogout} className="text-white/80 font-medium hover:text-white transition-colors text-label-md font-label-md hover:bg-primary-fixed-variant/20 rounded-lg px-4 py-2">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden lg:flex items-center gap-1 text-white/80 font-medium hover:text-white transition-colors text-label-md font-label-md hover:bg-primary-fixed-variant/20 rounded-lg px-4 py-2">
              <span className="material-symbols-outlined text-[18px]">login</span> Sign In
            </Link>
          )}
          <Link to="/matches" className="bg-secondary-container text-on-secondary-fixed font-bold text-label-md font-label-md px-4 py-2 rounded-lg hover:bg-secondary-fixed transition-colors shadow-sm active:opacity-90 active:scale-[0.99]">
            Book Tickets
          </Link>
          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white/80 hover:text-white p-2 hover:bg-primary-fixed-variant/20 rounded-lg transition-all">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
