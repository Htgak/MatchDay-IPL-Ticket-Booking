import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../services/api';

export default function WaitingQueue({ matchId }) {
  const [queueStatus, setQueueStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkQueueStatus = async () => {
    try {
      const res = await fetchWithAuth(`/matches/${matchId}/queue/status`);
      setQueueStatus(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkQueueStatus();
    // Poll queue status every 10 seconds
    const interval = setInterval(checkQueueStatus, 10000);
    return () => clearInterval(interval);
  }, [matchId]);

  const handleJoinQueue = async () => {
    setLoading(true);
    try {
      await fetchWithAuth(`/matches/${matchId}/queue/join`, { method: 'POST' });
      await checkQueueStatus();
    } catch (err) {
      setError('Failed to join queue');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveQueue = async () => {
    setLoading(true);
    try {
      await fetchWithAuth(`/matches/${matchId}/queue/leave`, { method: 'POST' });
      setQueueStatus(prev => ({ ...prev, inQueue: false }));
    } catch (err) {
      setError('Failed to leave queue');
    } finally {
      setLoading(false);
    }
  };

  if (!queueStatus) return null;

  return (
    <div className="bg-blue-900/40 border border-blue-500/30 rounded-2xl p-6 text-center mt-6">
      <h3 className="text-xl font-bold mb-2 text-blue-400">High Demand Match</h3>
      <p className="text-gray-300 mb-6">
        This match is currently full or seats are locked. Join the queue to get access when seats become available.
      </p>

      {queueStatus.inQueue ? (
        <div className="space-y-4">
          <div className="inline-block bg-dark p-4 rounded-xl border border-white/10">
            <p className="text-sm text-gray-400">Your Position</p>
            <p className="text-4xl font-black text-white">{queueStatus.position + 1}</p>
            <p className="text-xs text-gray-500 mt-1">out of {queueStatus.totalSize}</p>
          </div>
          <p className="text-sm text-blue-300 animate-pulse">Waiting for seats to open...</p>
          <button 
            onClick={handleLeaveQueue}
            disabled={loading}
            className="text-gray-400 underline text-sm hover:text-white"
          >
            Leave Queue
          </button>
        </div>
      ) : (
        <div>
          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
          <button 
            onClick={handleJoinQueue}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg"
          >
            {loading ? 'Joining...' : 'Join Queue'}
          </button>
        </div>
      )}
    </div>
  );
}
