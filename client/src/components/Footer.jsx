import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface full-width border-t border-outline-variant flat no shadows mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-stack-lg max-w-container-max-width mx-auto gap-stack-md">
        {/* Brand Logo */}
        <div className="text-headline-sm font-headline-sm font-black text-primary dark:text-inverse-primary mb-4 md:mb-0">
            MatchDay
        </div>
        {/* Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-label-sm font-label-sm">
          <a className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Privacy Policy</a>
          <a className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Terms of Service</a>
          <a className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">Contact Us</a>
          <a className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">About Us</a>
          <a className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors" href="#">FAQs</a>
        </div>
        {/* Copyright */}
        <div className="text-body-md font-body-md text-on-surface-variant dark:text-surface-variant mt-4 md:mt-0 text-center md:text-right">
            © 2024 MatchDay Cricket. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
