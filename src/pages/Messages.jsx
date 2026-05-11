import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

function pushNotification(toEmail, message) {
  const stored = JSON.parse(localStorage.getItem('notifications') || '[]');
  stored.push({ id: Date.now().toString(), userId: toEmail, message, read: false, createdAt: new Date().toISOString() });
  localStorage.setItem('notifications', JSON.stringify(stored));
}

function displayName(u) {
  if (!u) return '';
  return u.firstName ? `${u.firstName} ${u.lastName}` : u.companyName || u.email;
}

export default function Messages() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);
  if (!user) return null;

  const myName = displayName(user);

  const allUsers = (() => {
    const stored = JSON.parse(localStorage.getItem('users') || '[]');
    return stored.filter(u => u.email !== user.email && u.role !== 'admin');
  })();

  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem('privateMessages') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('privateMessages', JSON.stringify(messages));
  }, [messages]);

  // Group into conversations
  const conversations = (() => {
    const mine = messages.filter(m => m.fromEmail === user.email || m.toEmail === user.email);
    const map = {};
    mine.forEach(m => {
      const otherEmail = m.fromEmail === user.email ? m.toEmail : m.fromEmail;
      const otherName  = m.fromEmail === user.email ? m.toName  : m.fromName;
      if (!map[otherEmail]) map[otherEmail] = { email: otherEmail, name: otherName, msgs: [], unread: 0 };
      map[otherEmail].msgs.push(m);
      if (m.toEmail === user.email && !m.read) map[otherEmail].unread++;
    });
    Object.values(map).forEach(c => c.msgs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
    return Object.values(map).sort((a, b) => {
      const la = a.msgs[a.msgs.length - 1]?.timestamp || '';
      const lb = b.msgs[b.msgs.length - 1]?.timestamp || '';
      return new Date(lb) - new Date(la);
    });
  })();

  const preselect = new URLSearchParams(location.search).get('with');
  const [selectedEmail, setSelectedEmail] = useState(preselect || conversations[0]?.email || null);
  const [inputText, setInputText] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [showNewConvo, setShowNewConvo] = useState(false);
  const bottomRef = useRef(null);

  // Mark as read when conversation opens
  useEffect(() => {
    if (!selectedEmail) return;
    setMessages(prev => prev.map(m =>
      m.toEmail === user.email && m.fromEmail === selectedEmail && !m.read ? { ...m, read: true } : m
    ));
  }, [selectedEmail]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedEmail]);

  const threadMessages = messages
    .filter(m => (m.fromEmail === user.email && m.toEmail === selectedEmail) || (m.fromEmail === selectedEmail && m.toEmail === user.email))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const selectedConvo = conversations.find(c => c.email === selectedEmail);
  const selectedUser = allUsers.find(u => u.email === selectedEmail);
  const recipientName = selectedConvo?.name || (selectedUser ? displayName(selectedUser) : selectedEmail || '');

  const sendMessage = () => {
    if (!inputText.trim() || !selectedEmail) return;
    const toUser = allUsers.find(u => u.email === selectedEmail);
    const msg = {
      id: Date.now().toString(),
      fromEmail: user.email,
      fromName: myName,
      toEmail: selectedEmail,
      toName: toUser ? displayName(toUser) : selectedEmail,
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages(prev => [...prev, msg]);
    pushNotification(selectedEmail, `New message from ${myName}`);
    setInputText('');
  };

  const startConvo = (u) => {
    setSelectedEmail(u.email);
    setShowNewConvo(false);
    setUserSearch('');
  };

  const filteredUsers = allUsers.filter(u =>
    `${u.firstName || ''} ${u.lastName || ''} ${u.companyName || ''} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase())
  );

  const totalUnread = messages.filter(m => m.toEmail === user.email && !m.read).length;

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-slate-900 antialiased">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-amber-200/70 blur-3xl" />
        <div className="absolute right-[-6%] top-20 h-[360px] w-[360px] rounded-full bg-emerald-200/60 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <PageHeader showBack={true} />

        <div
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-lg backdrop-blur"
          style={{ height: 'calc(100vh - 180px)', minHeight: '520px' }}
        >
          <div className="flex h-full">

            {/* ── SIDEBAR ── */}
            <div className="flex w-72 shrink-0 flex-col border-r border-slate-100">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="font-semibold text-slate-900">Messages</h2>
                  {totalUnread > 0 && <p className="text-xs text-slate-400">{totalUnread} unread</p>}
                </div>
                <button
                  onClick={() => setShowNewConvo(v => !v)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
                  title="New message"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>

              {/* New conversation search */}
              {showNewConvo && (
                <div className="border-b border-slate-100 p-3">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    placeholder="Search users…"
                    autoFocus
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-300 focus:outline-none"
                  />
                  <div className="mt-2 max-h-48 overflow-y-auto space-y-0.5">
                    {filteredUsers.slice(0, 10).map(u => (
                      <button
                        key={u.email}
                        onClick={() => startConvo(u)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-emerald-50"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                          {(u.firstName || u.companyName || '?')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-800">{displayName(u)}</p>
                          <p className="truncate text-xs capitalize text-slate-400">{u.role}</p>
                        </div>
                      </button>
                    ))}
                    {filteredUsers.length === 0 && <p className="py-3 text-center text-xs text-slate-400">No users found</p>}
                  </div>
                </div>
              )}

              {/* Conversation list */}
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 && !showNewConvo && (
                  <div className="px-5 py-12 text-center">
                    <p className="text-sm text-slate-400">No conversations yet.</p>
                    <button onClick={() => setShowNewConvo(true)} className="mt-2 text-xs font-semibold text-emerald-600 hover:underline">
                      Start one →
                    </button>
                  </div>
                )}
                {conversations.map(c => {
                  const last = c.msgs[c.msgs.length - 1];
                  const isSelected = c.email === selectedEmail;
                  return (
                    <button
                      key={c.email}
                      onClick={() => setSelectedEmail(c.email)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${isSelected ? 'bg-emerald-50/60 border-r-2 border-emerald-400' : ''}`}
                    >
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                        {c.name[0]?.toUpperCase()}
                        {c.unread > 0 && (
                          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
                            {c.unread}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`truncate text-sm ${c.unread > 0 ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>{c.name}</p>
                          {last && (
                            <span className="shrink-0 text-[10px] text-slate-400">
                              {new Date(last.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                        {last && (
                          <p className={`truncate text-xs ${c.unread > 0 ? 'font-medium text-slate-600' : 'text-slate-400'}`}>
                            {last.fromEmail === user.email ? 'You: ' : ''}{last.text}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── CHAT AREA ── */}
            <div className="flex flex-1 flex-col min-w-0">
              {!selectedEmail ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="text-center">
                    <div className="mb-3 text-5xl">💬</div>
                    <p className="font-medium text-slate-600">Select a conversation</p>
                    <p className="mt-1 text-sm text-slate-400">or press + to start a new one</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat header */}
                  <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                      {recipientName[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{recipientName}</p>
                      <p className="text-xs text-slate-400">{selectedEmail}</p>
                    </div>
                  </div>

                  {/* Thread */}
                  <div className="flex-1 overflow-y-auto space-y-3 p-6">
                    {threadMessages.length === 0 && (
                      <p className="mt-12 text-center text-sm italic text-slate-400">No messages yet. Say hello! 👋</p>
                    )}
                    {threadMessages.map(m => {
                      const isMe = m.fromEmail === user.email;
                      return (
                        <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${isMe ? 'bg-emerald-600 text-white' : 'border border-slate-100 bg-white text-slate-800'}`}>
                            <p className="text-sm leading-relaxed">{m.text}</p>
                            <p className={`mt-1 text-[10px] ${isMe ? 'text-white/60' : 'text-slate-400'}`}>
                              {new Date(m.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>

                  {/* Send bar */}
                  <div className="flex gap-3 border-t border-slate-100 p-4">
                    <input
                      type="text"
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      placeholder={`Message ${recipientName}…`}
                      className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputText.trim()}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white transition hover:bg-emerald-500 disabled:opacity-40"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
