import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-surface text-on-surface w-full max-w-sm rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-error-container text-on-error-container rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[32px]">person_off</span>
        </div>
        
        <h2 className="text-headline-md font-headline-md font-bold mb-3">Login Required</h2>
        <p className="text-body-lg font-body-lg text-on-surface-variant mb-8">
          Dude, I dont know you ,please login
        </p>
        
        <div className="w-full flex flex-col gap-3">
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md text-label-md font-bold hover:bg-primary-fixed-variant transition-colors shadow-md"
          >
            Login to Continue
          </button>
          <button 
            onClick={onClose}
            className="w-full bg-transparent text-primary py-3 rounded-xl font-label-md text-label-md font-bold hover:bg-surface-variant transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
