import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [step, setStep] = useState(1);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');

      localStorage.setItem('supabase_token', data.data.token);
      localStorage.setItem('user_name', data.data.user.name);
      localStorage.setItem('user_email', data.data.user.email || '');
      localStorage.setItem('user_phone', data.data.user.phone || '');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: IPL Image Panel */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=2938"
          alt="IPL Cricket Match"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-container/90 via-primary/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-16 text-white">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[24px]">confirmation_number</span>
            </div>
            <span className="font-bold text-headline-md font-headline-md">Instant Booking</span>
          </div>
          <h2 className="text-display-lg-mobile font-display-lg-mobile font-black mb-3 leading-tight">Join Millions of<br />Cricket Fans</h2>
          <p className="text-body-lg font-body-lg text-white/80 max-w-sm">Get exclusive access to IPL match tickets, real-time seat locking and digital QR passes delivered instantly.</p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[['50K+', 'Happy Fans'], ['10+', 'Stadiums'], ['₹3k', 'Starting From']].map(([val, label]) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="font-black text-headline-md font-headline-md text-secondary-container">{val}</p>
                <p className="text-label-sm font-label-sm text-white/70 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 py-12 bg-background overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 mb-10">
            <span className="text-headline-md font-black text-primary">MatchDay</span>
          </Link>

          {step === 2 ? (
            <div className="text-center mt-4">
              <div className="w-20 h-20 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[40px]">mark_email_read</span>
              </div>
              <h1 className="text-display-sm font-display-sm font-bold text-on-surface mb-4">Enter OTP</h1>
              <p className="text-body-lg font-body-lg text-on-surface-variant mb-8">
                We sent a 6-digit code to <br />
                <span className="font-bold text-on-surface">{form.email}</span>
              </p>

              {error && (
                <div className="bg-error-container text-on-error-container rounded-lg px-4 py-3 mb-6 text-body-md font-body-md flex items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">pin</span>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-body-lg font-bold tracking-widest text-on-surface text-center focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white font-headline-md text-headline-md py-4 rounded-xl hover:bg-primary-fixed-variant transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <><span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> Verifying...</>
                  ) : (
                    <><span className="material-symbols-outlined text-[20px]">verified</span> Verify & Login</>
                  )}
                </button>
              </form>

              <button
                onClick={() => setStep(1)}
                className="mt-6 text-primary font-bold text-body-md hover:underline bg-transparent border-none cursor-pointer"
              >
                ← Back to registration
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-display-lg-mobile font-display-lg-mobile text-on-surface mb-2">Create account</h1>
              <p className="text-body-lg font-body-lg text-on-surface-variant mb-8">Start booking IPL tickets today</p>

              {error && (
                <div className="bg-error-container text-on-error-container rounded-lg px-4 py-3 mb-6 text-body-md font-body-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-label-md font-label-md text-on-surface mb-2" htmlFor="name">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Thala,King Kohli,Hitman"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-label-md font-label-md text-on-surface mb-2" htmlFor="reg-email">Email address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                    <input
                      id="reg-email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter the Email that You Want To Register"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-label-md font-label-md text-on-surface mb-2" htmlFor="reg-password">Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                    <input
                      id="reg-password"
                      name="password"
                      type="password"
                      required
                      minLength={6}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min. 6 characters"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white font-headline-md text-headline-md py-4 rounded-xl hover:bg-primary-fixed-variant transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <><span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> Sending OTP...</>
                  ) : (
                    <><span className="material-symbols-outlined text-[20px]">how_to_reg</span> Create Account</>
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-body-md font-body-md text-on-surface-variant">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
