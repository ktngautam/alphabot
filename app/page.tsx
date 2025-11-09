'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const activated = urlParams.get('status') === 'activated';
    const user = urlParams.get('user');

    if (activated && user) {
      setStatus('AlphaBot Activated!');
      setUsername(user);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-bold mb-4">AlphaBot</h1>
      <p className="text-xl mb-8 max-w-md">
        1 tweet/day. Your voice. Zero effort.
      </p>

      {status ? (
        <div className="bg-gray-900 p-6 rounded-lg border border-neon">
          <p className="text-2xl text-neon font-bold mb-2">{status}</p>
          <p className="text-lg">@{username} is now on autopilot.</p>
          <p className="text-sm text-gray-400 mt-4">
            Your first tweet posts at <strong>9:00 AM</strong> tomorrow.
          </p>
          <p className="text-xs text-gray-500 mt-2">Check Supabase → users table</p>
        </div>
      ) : (
        <button
          onClick={() => {
            fetch('https://alpha-backend-production.up.railway.app/auth/x', {
            credentials: 'include'  // Important for cookies!
          })
            .then(res => res.json())
            .then(data => window.location.href = data.url)
            .catch(err => console.error('Error:', err));

          }}
          className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition"
        >
          Connect X to Activate
        </button>
      )}
    </div>
  );
}
