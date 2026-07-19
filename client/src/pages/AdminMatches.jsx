import React, { useState } from 'react';
import { fetchWithAuth } from '../services/api';

export default function AdminMatches() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Simplified form state for demonstration
  const [formData, setFormData] = useState({
    team_a_id: '',
    team_b_id: '',
    stadium_id: '',
    match_date: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await fetchWithAuth('/admin/matches', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setSuccess('Match created successfully!');
      setFormData({ team_a_id: '', team_b_id: '', stadium_id: '', match_date: '' });
    } catch (err) {
      setError(err.message || 'Failed to create match');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Manage Matches</h2>

      <div className="glass p-8 rounded-2xl">
        <h3 className="text-xl font-bold mb-6">Create New Match</h3>
        
        {success && <div className="bg-green-500/20 text-green-400 p-3 rounded mb-4">{success}</div>}
        {error && <div className="bg-red-500/20 text-red-500 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Team A ID (UUID)</label>
            <input 
              type="text" 
              required
              className="w-full bg-dark border border-gray-600 rounded p-2 text-white focus:border-primary outline-none"
              value={formData.team_a_id}
              onChange={e => setFormData({...formData, team_a_id: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Team B ID (UUID)</label>
            <input 
              type="text" 
              required
              className="w-full bg-dark border border-gray-600 rounded p-2 text-white focus:border-primary outline-none"
              value={formData.team_b_id}
              onChange={e => setFormData({...formData, team_b_id: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Stadium ID (UUID)</label>
            <input 
              type="text" 
              required
              className="w-full bg-dark border border-gray-600 rounded p-2 text-white focus:border-primary outline-none"
              value={formData.stadium_id}
              onChange={e => setFormData({...formData, stadium_id: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Match Date (ISO)</label>
            <input 
              type="datetime-local" 
              required
              className="w-full bg-dark border border-gray-600 rounded p-2 text-white focus:border-primary outline-none [color-scheme:dark]"
              value={formData.match_date}
              onChange={e => setFormData({...formData, match_date: e.target.value + ':00Z'})}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg mt-4 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Match'}
          </button>
        </form>
      </div>
    </div>
  );
}
