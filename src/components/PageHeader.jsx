import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PageHeader({ showBack = true }) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [notifications, setNotifications] = useState(() => {
    try { return JSON.parse(localStorage.getItem('notifications')) || []; } catch { return []; }
  });

  const [settings, setSettings] = useState({
    allNotifications: true,
    cookies: true,
    emailNotifications: true,
    pushNotifications: false,
  });

  const myNotifications = notifications.filter(n => n.userId === user?.email);
  const unreadCount = myNotifications.filter(n => !n.read).length;

  const toggleRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: !n.read } : n);
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const toggleSetting = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const signOut = () => { localStorage.removeItem('user'); navigate('/login'); };

  if (!user) return null;

  // Only hide Profile button when viewing your own profile (no email param or email = own)
  const viewEmail = new URLSearchParams(location.search).get('email');
  const isOnOwnProfile = location.pathname === '/profile' && (!viewEmail || viewEmail === user.email);

  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      {/* Back arrow + Home button */}
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-400 shadow-sm transition hover:bg-white hover:text-slate-700"
            title="Go back"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
        )}
        <button
          onClick={() => navigate('/home')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-400 shadow-sm transition hover:bg-white hover:text-slate-700"
          title="Home"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
      </div>

      {/* Right-side action buttons */}
      <div className="relative flex items-center gap-3">
        {/* Create Project — students only */}
        {user.role === 'student' && (
          <button
            onClick={() => navigate('/create')}
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-500"
          >
            + Create Project
          </button>
        )}

        {/* Messages */}
        {(() => {
          const unreadMsgs = (() => { try { return JSON.parse(localStorage.getItem('privateMessages') || '[]').filter(m => m.toEmail === user.email && !m.read).length; } catch { return 0; } })();
          return (
            <button
              onClick={() => navigate('/messages')}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 shadow-sm transition hover:bg-white"
              title="Messages"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 text-slate-500">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              {unreadMsgs > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
                  {unreadMsgs > 9 ? '9+' : unreadMsgs}
                </span>
              )}
            </button>
          );
        })()}

        {/* Profile — hidden only when already on own /profile */}
        {!isOnOwnProfile && (
          <button
            onClick={() => {
              // If already on /profile (viewing someone else), force a full remount
              // via hard navigation to avoid a hooks-ordering white screen
              if (location.pathname === '/profile') {
                window.location.href = '/profile';
              } else {
                navigate('/profile');
              }
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-lg shadow-sm transition hover:bg-white"
            title="My Profile"
          >
            👤
          </button>
        )}

        {/* Notifications bell — settings accessible via link inside dropdown */}
        <div className="relative" onMouseEnter={() => setShowNotifications(true)} onMouseLeave={() => { setShowNotifications(false); setShowSettings(false); }}>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 shadow-sm transition hover:bg-white">
            🔔
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full bg-red-500" />
            )}
          </button>
          {showNotifications && (
            <>
              <div className="absolute left-0 right-0 h-2" style={{ top: '100%' }} />
              <div className="absolute right-0 top-full z-50 mt-2 w-96 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-center justify-between bg-emerald-600 px-5 py-4 text-white">
                  <h3 className="font-semibold">Notifications</h3>
                  <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold">{unreadCount} New</span>
                </div>
                <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                  {myNotifications.length === 0 ? (
                    <p className="p-5 text-center text-sm italic text-slate-400">No notifications yet.</p>
                  ) : myNotifications.map(n => (
                    <div key={n.id} className="flex gap-3 p-4 transition hover:bg-slate-50">
                      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${n.read ? 'bg-slate-200' : 'bg-emerald-500'}`} />
                      <div className="flex-1">
                        <p className={`text-sm ${n.read ? 'text-slate-400' : 'font-medium text-slate-700'}`}>{n.text || n.message}</p>
                        <button onClick={() => toggleRead(n.id)} className="mt-1 text-xs font-semibold text-emerald-600 hover:underline">
                          {n.read ? 'Mark as unread' : 'Mark as read'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Notification Preferences — small link at bottom of dropdown */}
                <div className="border-t border-slate-100 px-5 py-3">
                  <button
                    onClick={() => setShowSettings(s => !s)}
                    className="text-xs text-slate-400 transition hover:text-slate-600"
                  >
                    Notification Preferences {showSettings ? '▲' : '▼'}
                  </button>
                  {showSettings && (
                    <div className="mt-3 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50">
                      {[
                        { key: 'allNotifications', label: 'All Notifications' },
                        { key: 'cookies', label: 'Save Cookies' },
                        { key: 'emailNotifications', label: 'Email Notifications' },
                        { key: 'pushNotifications', label: 'Push Notifications' },
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between px-4 py-2.5">
                          <span className="text-xs font-medium text-slate-600">{item.label}</span>
                          <button
                            onClick={() => toggleSetting(item.key)}
                            className={`relative h-5 w-10 rounded-full transition-colors ${settings[item.key] ? 'bg-emerald-500' : 'bg-slate-200'}`}
                          >
                            <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${settings[item.key] ? 'left-[22px]' : 'left-0.5'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sign Out */}
        <button
          onClick={signOut}
          className="rounded-full border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
