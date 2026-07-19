import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
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
      {/* Left: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 py-12 bg-background">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-10">
            <span className="text-headline-md font-black text-primary">MatchDay</span>
          </Link>

          <h1 className="text-display-lg-mobile font-display-lg-mobile text-on-surface mb-2">Welcome back</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant mb-8">Sign in to book your IPL seats</p>

          {error && (
            <div className="bg-error-container text-on-error-container rounded-lg px-4 py-3 mb-6 text-body-md font-body-md flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-label-md font-label-md text-on-surface mb-2" htmlFor="email">Email address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter Your Email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-label-md font-label-md text-on-surface mb-2" htmlFor="password">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
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
                <><span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> Signing in...</>
              ) : (
                <><span className="material-symbols-outlined text-[20px]">login</span> Sign In</>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-body-md font-body-md text-on-surface-variant">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">Create one</Link>
          </p>
        </div>
      </div>

      {/* Right: IPL Image Panel */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=2805"
          alt="IPL Stadium"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-16 text-white">
          <div className="flex gap-3 mb-6">
            {['CSK', 'MI', 'RCB', 'KKR', 'DC', 'SRH', 'RR', 'GT'].map(team => (
              <span key={team} className="bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 rounded-full text-label-sm font-label-sm font-bold">{team}</span>
            ))}
          </div>
          <h2 className="text-display-lg-mobile font-display-lg-mobile font-black mb-3 leading-tight">The IPL Experience<br />Awaits You</h2>
          <p className="text-body-lg font-body-lg text-white/80 max-w-sm">Book seats for the biggest cricket tournament on the planet. Real-time seat selection, instant confirmations.</p>
        </div>
      </div>
    </div>
  );
}
