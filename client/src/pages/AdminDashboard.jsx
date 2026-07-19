import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../services/api';
import { Users, Ticket, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWithAuth('/admin/stats')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load stats');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-10 text-primary">Loading dashboard...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <Link to="/admin/matches" className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-lg font-bold">
          Manage Matches
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="glass p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="p-4 bg-blue-500/20 rounded-xl text-blue-500"><Users size={32} /></div>
          <div>
            <p className="text-gray-400">Total Users</p>
            <p className="text-3xl font-black">{stats.totalUsers}</p>
          </div>
        </div>
        
        <div className="glass p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-green-500">
          <div className="p-4 bg-green-500/20 rounded-xl text-green-500"><Ticket size={32} /></div>
          <div>
            <p className="text-gray-400">Total Bookings</p>
            <p className="text-3xl font-black">{stats.totalBookings}</p>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-yellow-500">
          <div className="p-4 bg-yellow-500/20 rounded-xl text-yellow-500"><IndianRupee size={32} /></div>
          <div>
            <p className="text-gray-400">Total Revenue</p>
            <p className="text-3xl font-black">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      {/* Could add charts or recent activity here in the future */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        <p className="text-gray-400 italic">No recent activity to display.</p>
      </div>
    </div>
  );
}
