'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
  x_id: string;
  username: string;
  active: boolean;
  next_post_at: string;
  created_at: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyPostsEnabled, setDailyPostsEnabled] = useState(true);
  const [postFrequency, setPostFrequency] = useState('1');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const username = urlParams.get('user');
      
      if (!username) {
        router.push('/');
        return;
      }

      try {
        const response = await fetch(
          `https://alpha-backend-production.up.railway.app/api/user/${username}`,
          { credentials: 'include' }
        );
        
        if (!response.ok) throw new Error('Failed to fetch user');
        
        const userData = await response.json();
        setUser(userData);
        setDailyPostsEnabled(userData.active);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const toggleDailyPosts = async (enabled: boolean) => {
    if (!user) return;
    
    setDailyPostsEnabled(enabled);
    
    try {
      await fetch(
        `https://alpha-backend-production.up.railway.app/api/user/${user.username}/toggle`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active: enabled }),
          credentials: 'include',
        }
      );
    } catch (error) {
      console.error('Error updating status:', error);
      setDailyPostsEnabled(!enabled);
    }
  };

  const updateFrequency = async (frequency: string) => {
    if (!user) return;
    
    setPostFrequency(frequency);
    
    try {
      await fetch(
        `https://alpha-backend-production.up.railway.app/api/user/${user.username}/frequency`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ frequency: parseInt(frequency) }),
          credentials: 'include',
        }
      );
    } catch (error) {
      console.error('Error updating frequency:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
            <span className="text-white text-xl">◆</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Alphabot</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center cursor-pointer">
            <span className="text-xl">👤</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome, @{user.username}!
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Automation Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Automation Status</h3>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${dailyPostsEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className={`font-medium ${dailyPostsEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                  {dailyPostsEnabled ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Daily Posts Toggle */}
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Daily Posts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={dailyPostsEnabled}
                    onChange={(e) => toggleDailyPosts(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Post Frequency */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">Post Frequency</label>
                <select
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
                  value={postFrequency}
                  onChange={(e) => updateFrequency(e.target.value)}
                >
                  <option value="1">1 per day</option>
                  <option value="2">2 per day</option>
                  <option value="3">3 per day</option>
                </select>
              </div>
            </div>

            <button className="mt-6 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition">
              Manage Settings
              <span>→</span>
            </button>
          </div>

          {/* Latest Tweet Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Your Latest AI-Generated Tweet
            </h3>
            
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">👤</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">{user.username}</span>
                    <span className="text-gray-500">@{user.username}</span>
                    <span className="text-gray-400">· 2h</span>
                  </div>
                  <p className="text-gray-800 leading-relaxed mb-4">
                    Artificial intelligence is the new electricity. The companies that figure out how to harness it will be the titans of the 21st century. What's one industry you believe will be most transformed by AI in the next 5 years? #AI #FutureTech #Innovation
                  </p>
                  
                  {/* Tweet Stats */}
                  <div className="flex gap-8 text-gray-500 text-sm">
                    <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>1.2K</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-green-500 cursor-pointer transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>3.5K</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-red-500 cursor-pointer transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>15K</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>2.1M</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Next scheduled post: {new Date(user.next_post_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 text-center">
        <div className="flex justify-center gap-8 text-gray-500 text-sm">
          <a href="#" className="hover:text-gray-700 transition">Help/FAQ</a>
          <a href="#" className="hover:text-gray-700 transition">Terms of Service</a>
          <a href="#" className="hover:text-gray-700 transition">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
