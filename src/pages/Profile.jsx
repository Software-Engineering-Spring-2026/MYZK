import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

const COURSES = [
  'Bachelor Project','Software Engineering','Operating Systems','Machine Learning',
  'Embedded Systems','Database Systems','Computer Networks','Artificial Intelligence',
  'Mobile Development','Cyber Security','Data Structures','Algorithms',
];

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ---------------- AUTH ----------------
  const user = JSON.parse(localStorage.getItem('user'));
  const viewEmail = new URLSearchParams(location.search).get('email');
  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);
  if (!user) return null;
  const isAdminViewer = user?.role === 'admin';

  // ---------------- VIEW ANOTHER STUDENT ----------------
  if (viewEmail && viewEmail !== user.email) {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const viewed = storedUsers.find(u => u.email === viewEmail);
    const viewedName = viewed ? `${viewed.firstName} ${viewed.lastName}`.trim() : '';
    const viewedNameLower = viewedName.toLowerCase();
    const viewedProjects = (JSON.parse(localStorage.getItem('projects')) || [])
      .filter(p => {
        const creatorName = (p.creatorName || '').toLowerCase();
        const matchesOwner =
          p.creatorId === viewEmail ||
          p.creatorEmail === viewEmail ||
          p.ownerEmail === viewEmail ||
          (viewed?.id && p.creatorId === viewed.id) ||
          (viewedNameLower && creatorName === viewedNameLower);

        if (!matchesOwner) return false;
        if (!isAdminViewer && p.isPublic === false) return false;
        return true;
      });
    const viewedSkills = JSON.parse(localStorage.getItem(`skills_${viewEmail}`)) || viewed?.skills || [];
    const viewedMajor = localStorage.getItem(`major_${viewEmail}`) || viewed?.major || '';
    const viewedLinkedIn = localStorage.getItem(`linkedin_${viewEmail}`) || '';
    const viewedBio = localStorage.getItem(`bio_${viewEmail}`) || '';
    const viewedFavorites = JSON.parse(localStorage.getItem(`favorites_${viewEmail}`)) || [];
    const viewedInternships = JSON.parse(localStorage.getItem(`internships_${viewEmail}`)) || [];
    const displayName = viewedName || viewEmail;

    const viewedLangCounts = (() => {
      const all = viewedProjects.flatMap(p => p.languages || []);
      const counts = {};
      all.forEach(l => { counts[l] = (counts[l] || 0) + 1; });
      return { sorted: Object.entries(counts).sort((a, b) => b[1] - a[1]), total: all.length };
    })();

    const viewedTopCollabs = (() => {
      const map = {};
      viewedProjects.forEach(p => {
        (p.collaborators || []).filter(c => c.status === 'accepted').forEach(c => {
          if (!map[c.email]) map[c.email] = { email: c.email, name: c.name || c.email, count: 0 };
          map[c.email].count++;
        });
      });
      return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 5);
    })();

    const langColors = ['bg-emerald-500','bg-blue-500','bg-violet-500','bg-amber-500','bg-rose-500','bg-cyan-500'];

    return (
      <div className="min-h-screen bg-[#f7f4ee] text-slate-900 antialiased">
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-amber-200/70 blur-3xl" />
          <div className="absolute right-[-6%] top-20 h-[360px] w-[360px] rounded-full bg-emerald-200/60 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6 space-y-6">
          <PageHeader showBack={true} />

          {/* PROFILE CARD */}
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg backdrop-blur">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-700">
                {displayName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-semibold text-slate-900">{displayName}</h1>
                <p className="mt-1 text-sm text-slate-500">{viewEmail}</p>
                {viewedMajor && <p className="mt-1 text-sm font-medium text-emerald-600">{viewedMajor}</p>}
                {viewedBio && <p className="mt-3 leading-relaxed text-slate-600">{viewedBio}</p>}
                {viewedLinkedIn && (
                  <a href={viewedLinkedIn.startsWith('http') ? viewedLinkedIn : `https://${viewedLinkedIn}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:underline">
                    LinkedIn Profile →
                  </a>
                )}
              </div>
            </div>
            {viewedSkills.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {viewedSkills.map((s, i) => (
                    <span key={i} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* PROJECTS */}
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Projects ({viewedProjects.length})</h2>
            {viewedProjects.length === 0 ? (
              <p className="text-sm italic text-slate-400">No public projects.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {viewedProjects.map(p => (
                  <div key={p.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{p.title}</p>
                      <span className="mt-0.5 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">{p.course}</span>
                      {p.rating > 0 && <p className="mt-0.5 text-xs text-amber-500">{'★'.repeat(p.rating)}{'☆'.repeat(5 - p.rating)}</p>}
                    </div>
                    <button onClick={() => navigate(`/project/${p.id}`)} className="ml-3 shrink-0 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-500">
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PORTFOLIO STATISTICS */}
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
            <h2 className="mb-5 text-lg font-semibold text-slate-900">Portfolio Statistics</h2>
            <div className="grid gap-4 sm:grid-cols-3 mb-5">
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Projects</p>
                <p className="mt-1 text-3xl font-bold text-emerald-600">{viewedProjects.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Skills</p>
                <p className="mt-1 text-3xl font-bold text-emerald-600">{viewedSkills.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Internships</p>
                <p className="mt-1 text-3xl font-bold text-emerald-600">{viewedInternships.length}</p>
              </div>
            </div>
            {viewedLangCounts.total > 0 ? (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Languages Used</p>
                <div className="space-y-2.5">
                  {viewedLangCounts.sorted.map(([lang, count], i) => {
                    const pct = Math.round((count / viewedLangCounts.total) * 100);
                    return (
                      <div key={lang}>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-700">{lang}</span>
                          <span className="text-slate-400">{pct}% ({count})</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div className={`h-full rounded-full ${langColors[i % langColors.length]}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm italic text-slate-400">No programming languages recorded yet.</p>
            )}
          </div>

          {/* TOP COLLABORATORS */}
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Top Collaborators</h2>
            {viewedTopCollabs.length === 0 ? (
              <p className="text-sm italic text-slate-400">No accepted collaborators yet.</p>
            ) : (
              <div className="space-y-3">
                {viewedTopCollabs.map((c, idx) => (
                  <div key={c.email} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">#{idx + 1}</div>
                      <div>
                        <p className="font-semibold text-slate-900">{c.name}</p>
                        <p className="text-xs text-slate-400">{c.email}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{c.count} {c.count === 1 ? 'Project' : 'Projects'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FAVORITES */}
          {viewedFavorites.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Saved Portfolios & Projects</h2>
              <div className="space-y-2">
                {viewedFavorites.map((fav, i) => (
                  <div key={i} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4">
                    <div>
                      {fav.type === 'portfolio' ? (
                        <>
                          <p className="font-semibold text-slate-900">{fav.firstName} {fav.lastName}</p>
                          <p className="text-xs text-slate-400">Student Portfolio</p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-slate-900">{fav.title}</p>
                          <p className="text-xs text-slate-400">{fav.course}</p>
                        </>
                      )}
                    </div>
                    {fav.id && (
                      <button onClick={() => navigate(`/project/${fav.id}`)} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-200">View</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COMPLETED INTERNSHIPS */}
          {viewedInternships.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Completed Internships</h2>
              <div className="space-y-2">
                {viewedInternships.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <p className="text-sm text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------------- SHARED ----------------
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem(`profileImage_${user.email}`) || ''
  );
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      localStorage.setItem(`profileImage_${user.email}`, reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ---------------- STUDENT STATE ----------------
  const [major, setMajor] = useState(localStorage.getItem(`major_${user.email}`) || '');
  const [linkedIn, setLinkedIn] = useState(localStorage.getItem(`linkedin_${user.email}`) || '');
  const [skills, setSkills] = useState(
    JSON.parse(localStorage.getItem(`skills_${user.email}`)) || []
  );
  const [skillInput, setSkillInput] = useState('');
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem(`favorites_${user.email}`)) || []
  );
  const [completedInternships, setCompletedInternships] = useState(
    JSON.parse(localStorage.getItem(`internships_${user.email}`)) || []
  );
  const [newInternship, setNewInternship] = useState('');

  // ---------------- INSTRUCTOR STATE ----------------
  const [biography, setBiography] = useState(localStorage.getItem(`bio_${user.email}`) || '');
  const [researchInterests, setResearchInterests] = useState(localStorage.getItem(`research_${user.email}`) || '');
  const [education, setEducation] = useState(localStorage.getItem(`education_${user.email}`) || '');
  const [courses, setCourses] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(`courses_${user.email}`));
    if (saved) return saved.includes('Bachelor Project') ? saved : ['Bachelor Project', ...saved];
    return ['Bachelor Project'];
  });
  const [courseInput, setCourseInput] = useState('');

  // ---------------- EMPLOYER STATE ----------------
  const [companyBio, setCompanyBio] = useState(localStorage.getItem(`companyBio_${user.email}`) || '');
  const [companyAddress, setCompanyAddress] = useState(localStorage.getItem(`companyAddress_${user.email}`) || '');
  const [companyContact, setCompanyContact] = useState(localStorage.getItem(`companyContact_${user.email}`) || '');

  // ---------------- MY PROJECTS ----------------
  const [myProjects, setMyProjects] = useState(() => {
    const all = JSON.parse(localStorage.getItem('projects')) || [];
    return all.filter(p => p.creatorId === user.email);
  });

  // Auto-detected: employer-accepted + deadline passed
  const autoCompletedInternships = (() => {
    const empInternships = JSON.parse(localStorage.getItem('employerInternships')) || [];
    const statuses = JSON.parse(localStorage.getItem('applicantStatuses')) || {};
    const today = new Date();
    return empInternships.filter(i => {
      const expired = i.deadline && today > new Date(i.deadline);
      const accepted = statuses[`${i.id}_${user.email}`] === 'accepted';
      return expired && accepted;
    });
  })();

  const [showProjectEditModal, setShowProjectEditModal] = useState(false);
  const [projectEditForm, setProjectEditForm] = useState(null);
  const [projectEditLangInput, setProjectEditLangInput] = useState('');
  const [projectEditTagInput, setProjectEditTagInput] = useState('');
  const [projectDeleteTarget, setProjectDeleteTarget] = useState(null);

  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealTarget, setAppealTarget] = useState(null);
  const [appealMessage, setAppealMessage] = useState('');

  const [invitations, setInvitations] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`invitations_${user.email}`) || '[]'); } catch { return []; }
  });

  const saveProjectEdit = () => {
    if (!projectEditForm?.title?.trim() || !projectEditForm?.description?.trim() || !projectEditForm?.course) return;
    const all = JSON.parse(localStorage.getItem('projects')) || [];
    const updated = all.map(p => p.id === projectEditForm.id ? { ...p, ...projectEditForm } : p);
    localStorage.setItem('projects', JSON.stringify(updated));
    setMyProjects(updated.filter(p => p.creatorId === user.email));
    setShowProjectEditModal(false);
  };

  const confirmDeleteProject = () => {
    if (!projectDeleteTarget) return;
    const all = JSON.parse(localStorage.getItem('projects')) || [];
    const updated = all.filter(p => p.id !== projectDeleteTarget.id);
    localStorage.setItem('projects', JSON.stringify(updated));
    setMyProjects(updated.filter(p => p.creatorId === user.email));
    setProjectDeleteTarget(null);
  };

  // ---------------- APPEAL ----------------
  const submitAppeal = () => {
    if (!appealMessage.trim() || !appealTarget) return;
    const all = JSON.parse(localStorage.getItem('projects') || '[]');
    const updated = all.map(p => p.id === appealTarget.id ? { ...p, appeal: appealMessage.trim() } : p);
    localStorage.setItem('projects', JSON.stringify(updated));
    setMyProjects(updated.filter(p => p.creatorId === user.email));
    setShowAppealModal(false);
    setAppealMessage('');
    setAppealTarget(null);
  };

  // ---------------- INVITATIONS ----------------
  const handleInvitationResponse = (invId, response) => {
    const updated = invitations.map(inv => {
      if (inv.id !== invId) return inv;
      const stored = JSON.parse(localStorage.getItem('projects') || '[]');
      const projIdx = stored.findIndex(p => p.id === inv.projectId);
      if (projIdx >= 0) {
        const proj = { ...stored[projIdx] };
        if (response === 'accepted') {
          if (inv.role === 'instructor') {
            proj.instructors = (proj.instructors || []).map(i =>
              i.email === user.email ? { ...i, status: 'accepted' } : i
            );
          } else {
            proj.collaborators = (proj.collaborators || []).map(c =>
              c.email === user.email ? { ...c, status: 'accepted' } : c
            );
          }
        } else {
          if (inv.role === 'instructor') {
            proj.instructors = (proj.instructors || []).filter(i => i.email !== user.email);
          } else {
            proj.collaborators = (proj.collaborators || []).filter(c => c.email !== user.email);
          }
        }
        stored[projIdx] = proj;
        localStorage.setItem('projects', JSON.stringify(stored));

        // Notify the project creator
        const myName = user.firstName ? `${user.firstName} ${user.lastName}` : user.email;
        const roleLabel = inv.role === 'instructor' ? 'course instructor' : 'collaborator';
        const notifMsg = response === 'accepted'
          ? `${myName} accepted your invitation to join "${proj.title}" as a ${roleLabel}`
          : `${myName} declined your invitation to join "${proj.title}" as a ${roleLabel}`;
        const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifs.push({ id: Date.now().toString(), userId: proj.creatorId, message: notifMsg, read: false, createdAt: new Date().toISOString() });
        localStorage.setItem('notifications', JSON.stringify(notifs));
      }
      return { ...inv, status: response };
    });
    setInvitations(updated);
    localStorage.setItem(`invitations_${user.email}`, JSON.stringify(updated));
  };

  // ---------------- PROFILE COMPLETION ----------------
  const studentComplete = !!(major && skills.length > 0 && linkedIn);
  const instructorComplete = !!(biography && researchInterests && education);
  const showBanner = !isEditing && (
    (user.role === 'student' && !studentComplete) ||
    (user.role === 'instructor' && !instructorComplete)
  );

  // ---------------- SAVE ----------------
  const handleSave = () => {
    if (user.role === 'student') {
      localStorage.setItem(`major_${user.email}`, major);
      localStorage.setItem(`linkedin_${user.email}`, linkedIn);
      localStorage.setItem(`skills_${user.email}`, JSON.stringify(skills));
    } else if (user.role === 'instructor') {
      localStorage.setItem(`bio_${user.email}`, biography);
      localStorage.setItem(`research_${user.email}`, researchInterests);
      localStorage.setItem(`education_${user.email}`, education);
      localStorage.setItem(`courses_${user.email}`, JSON.stringify(courses));
    } else {
      localStorage.setItem(`companyBio_${user.email}`, companyBio);
      localStorage.setItem(`companyAddress_${user.email}`, companyAddress);
      localStorage.setItem(`companyContact_${user.email}`, companyContact);
    }
    setIsEditing(false);
  };

  // ---------------- SKILL HELPERS ----------------
  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || skills.includes(s)) return;
    setSkills(prev => [...prev, s]);
    setSkillInput('');
  };
  const removeSkill = (s) => setSkills(prev => prev.filter(x => x !== s));

  // ---------------- COURSE HELPERS ----------------
  const addCourse = () => {
    const c = courseInput.trim();
    if (!c || courses.includes(c)) return;
    setCourses(prev => [...prev, c]);
    setCourseInput('');
  };
  const removeCourse = (c) => {
    if (c === 'Bachelor Project') return;
    setCourses(prev => prev.filter(x => x !== c));
  };

  // ---------------- EMPLOYER HELPERS ----------------
  const openGoogleMaps = () => {
    const query = encodeURIComponent(companyAddress);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  // ---------------- INTERNSHIP HELPERS ----------------
  const addInternship = () => {
    if (!newInternship.trim()) return;
    const updated = [...completedInternships, newInternship.trim()];
    setCompletedInternships(updated);
    localStorage.setItem(`internships_${user.email}`, JSON.stringify(updated));
    setNewInternship('');
  };
  const removeInternship = (i) => {
    const updated = completedInternships.filter((_, idx) => idx !== i);
    setCompletedInternships(updated);
    localStorage.setItem(`internships_${user.email}`, JSON.stringify(updated));
  };

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-[#f7f4ee] text-slate-900 antialiased">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-amber-200/70 blur-3xl" />
        <div className="absolute right-[-6%] top-20 h-[360px] w-[360px] rounded-full bg-emerald-200/60 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_55%),radial-gradient(circle_at_20%_70%,rgba(251,191,36,0.18),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">

        <PageHeader showBack={true} />

        {/* PAGE TITLE */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900">My Profile</h1>
          <p className="mt-1 text-sm capitalize text-slate-500">{user.role} Account</p>
        </div>

        {/* COMPLETION BANNER */}
        {showBanner && (
          <div className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="mt-0.5 text-2xl">✨</span>
              <div>
                <p className="font-semibold text-amber-800">Complete your profile</p>
                <p className="mt-0.5 text-sm text-amber-600">
                  {user.role === 'student'
                    ? 'Add your major, skills, and LinkedIn link so employers can find and evaluate you.'
                    : 'Add your biography, research interests, and education background so students can learn about you.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="shrink-0 rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-amber-400"
            >
              Complete Now
            </button>
          </div>
        )}

        {/* PROFILE CARD */}
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">

            {/* AVATAR */}
            <div className="flex flex-col items-center gap-3">
              <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-emerald-100 shadow-md">
                {profileImage
                  ? <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                  : <div className="flex h-full w-full items-center justify-center bg-emerald-50 text-5xl">👤</div>
                }
              </div>
              <button
                onClick={() => fileInputRef.current.click()}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500"
              >
                Upload Photo
              </button>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
            </div>

            {/* INFO AREA */}
            <div className="flex-1 min-w-0">

              {/* NAME + ROLE + EDIT BUTTON */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.companyName}
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-500">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                    {user.role}
                  </span>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      ✏️ Edit Profile
                    </button>
                  ) : user.role === 'employer' ? (
                    <button
                      onClick={() => setIsEditing(false)}
                      className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      Done Editing
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ── STUDENT VIEW ── */}
              {user.role === 'student' && !isEditing && (
                <div className="mt-5 space-y-3">
                  {major ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Major</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{major}</span>
                    </div>
                  ) : <p className="text-sm italic text-slate-400">No major set yet.</p>}

                  {linkedIn ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">LinkedIn / CV</span>
                      <a
                        href={linkedIn.startsWith('http') ? linkedIn : `https://${linkedIn}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate max-w-xs text-sm font-medium text-emerald-600 transition hover:underline"
                      >
                        {linkedIn}
                      </a>
                    </div>
                  ) : <p className="text-sm italic text-slate-400">No LinkedIn link yet.</p>}

                  {skills.length > 0 ? (
                    <div>
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">Skills</span>
                      <div className="flex flex-wrap gap-2">
                        {skills.map(s => (
                          <span key={s} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">{s}</span>
                        ))}
                      </div>
                    </div>
                  ) : <p className="text-sm italic text-slate-400">No skills added yet.</p>}
                </div>
              )}

              {/* ── STUDENT EDIT ── */}
              {user.role === 'student' && isEditing && (
                <div className="mt-5 space-y-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-500">Major</label>
                    <div className="flex gap-2">
                      <input
                        value={major}
                        onChange={e => setMajor(e.target.value)}
                        placeholder="e.g. Computer Science"
                        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                      />
                      {major && (
                        <button onClick={() => setMajor('')} className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-100">
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-500">LinkedIn / CV Link</label>
                    <div className="flex gap-2">
                      <input
                        value={linkedIn}
                        onChange={e => setLinkedIn(e.target.value)}
                        placeholder="https://linkedin.com/in/yourname"
                        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                      />
                      {linkedIn && (
                        <button onClick={() => setLinkedIn('')} className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-100">
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-500">Skills</label>
                    <div className="mb-2 flex gap-2">
                      <input
                        value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                        placeholder="e.g. React, Python, SQL..."
                        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                      />
                      <button onClick={addSkill} className="rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-500">
                        Add
                      </button>
                    </div>
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {skills.map(s => (
                          <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                            {s}
                            <button onClick={() => removeSkill(s)} className="text-emerald-400 transition hover:text-red-500">✕</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── INSTRUCTOR VIEW ── */}
              {user.role === 'instructor' && !isEditing && (
                <div className="mt-5 space-y-3 max-w-3xl">
                  {biography
                    ? <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Biography</p>
                        <p className="text-sm text-slate-700 whitespace-pre-line">{biography}</p>
                      </div>
                    : <p className="text-sm italic text-slate-400">No biography yet.</p>
                  }
                  {researchInterests
                    ? <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-emerald-600">Research Interests</p>
                        <p className="text-sm text-emerald-800 whitespace-pre-line">{researchInterests}</p>
                      </div>
                    : <p className="text-sm italic text-slate-400">No research interests yet.</p>
                  }
                  {education
                    ? <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-600">Education Background</p>
                        <p className="text-sm text-amber-800 whitespace-pre-line">{education}</p>
                      </div>
                    : <p className="text-sm italic text-slate-400">No education background yet.</p>
                  }
                  {courses.length > 0 && (
                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-600">Courses Taught</p>
                      <div className="flex flex-wrap gap-2">
                        {courses.map(c => (
                          <span key={c} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── INSTRUCTOR EDIT ── */}
              {user.role === 'instructor' && isEditing && (
                <div className="mt-5 space-y-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-500">Biography</label>
                    <div className="relative">
                      <textarea
                        value={biography}
                        onChange={e => setBiography(e.target.value)}
                        rows={4}
                        placeholder="Write a short biography about yourself..."
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                      />
                      {biography && (
                        <button onClick={() => setBiography('')} className="absolute right-3 top-3 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-100">
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-500">Research Interests</label>
                    <div className="relative">
                      <textarea
                        value={researchInterests}
                        onChange={e => setResearchInterests(e.target.value)}
                        rows={4}
                        placeholder="e.g. Machine Learning, NLP, Computer Vision..."
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                      />
                      {researchInterests && (
                        <button onClick={() => setResearchInterests('')} className="absolute right-3 top-3 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-100">
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-500">Education Background</label>
                    <div className="relative">
                      <textarea
                        value={education}
                        onChange={e => setEducation(e.target.value)}
                        rows={4}
                        placeholder="e.g. PhD in Computer Science, MIT 2018..."
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                      />
                      {education && (
                        <button onClick={() => setEducation('')} className="absolute right-3 top-3 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-100">
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-500">Courses Taught</label>
                    <p className="mb-2 text-xs text-slate-400">Bachelor Project is always linked and cannot be removed.</p>
                    <div className="mb-3 flex gap-2">
                      <input
                        value={courseInput}
                        onChange={e => setCourseInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCourse(); } }}
                        placeholder="e.g. Data Structures"
                        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                      />
                      <button onClick={addCourse} className="rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-500">
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {courses.map(c => (
                        <span key={c} className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {c}
                          {c !== 'Bachelor Project'
                            ? <button onClick={() => removeCourse(c)} className="text-blue-400 transition hover:text-red-500">✕</button>
                            : <span className="text-blue-400 text-xs">🔒</span>
                          }
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── EMPLOYER VIEW ── */}
              {user.role === 'employer' && !isEditing && (
                <div className="mt-5 space-y-3">
                  {companyBio
                    ? <p className="text-sm leading-relaxed text-slate-600">{companyBio}</p>
                    : <p className="text-sm italic text-slate-400">No company biography yet.</p>
                  }
                  {companyAddress && (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-emerald-600">Address</p>
                      <p className="text-sm text-emerald-800">{companyAddress}</p>
                    </div>
                  )}
                  {companyContact && (
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Contact</p>
                      <p className="text-sm text-slate-700 whitespace-pre-line">{companyContact}</p>
                    </div>
                  )}
                </div>
              )}


            </div>
          </div>
        </div>

        {/* ══ INVITATIONS (student + instructor) ══ */}
        {(user.role === 'student' || user.role === 'instructor') && (
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
            <h3 className="mb-5 text-xl font-bold text-slate-900">Project Invitations</h3>
            {invitations.length === 0 ? (
              <p className="text-sm italic text-slate-400">No invitations yet.</p>
            ) : (
              <div className="space-y-3">
                {invitations.map(inv => (
                  <div key={inv.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 truncate">{inv.projectTitle}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        From <span className="font-medium text-slate-600">{inv.fromName}</span>
                        {' · '}
                        <span className="capitalize">{inv.role}</span>
                        {inv.createdAt && ` · ${inv.createdAt}`}
                      </p>
                    </div>
                    {inv.status === 'pending' ? (
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => handleInvitationResponse(inv.id, 'accepted')}
                          className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleInvitationResponse(inv.id, 'rejected')}
                          className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${inv.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                        {inv.status === 'accepted' ? 'Accepted ✓' : 'Rejected'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ INSTRUCTOR SECTIONS ══ */}
        {user.role === 'instructor' && (
          <div className="space-y-8">
            {(() => {
              const allStored = JSON.parse(localStorage.getItem('projects') || '[]');
              const instructorProjects = allStored.filter(p =>
                (p.instructors || []).some(i => i.email === user.email && i.status === 'accepted')
              );
              return (
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg backdrop-blur">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Assigned</span>
                      <h3 className="mt-0.5 text-2xl font-bold text-slate-900">Projects I'm Instructing</h3>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {instructorProjects.length} {instructorProjects.length === 1 ? 'Project' : 'Projects'}
                    </span>
                  </div>
                  {instructorProjects.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                      <p className="text-sm text-slate-400">You haven't been assigned as instructor on any project yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {instructorProjects.map(p => (
                        <div key={p.id} className="rounded-2xl border border-slate-100 bg-white p-5 transition hover:shadow-md">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">{p.course}</span>
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.isPublic ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-500'}`}>
                                  {p.isPublic ? 'Public' : 'Private'}
                                </span>
                                {p.flagged && (
                                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">Flagged</span>
                                )}
                                {p.createdAt && <span className="text-xs text-slate-400">{p.createdAt}</span>}
                              </div>
                              <h4 className="text-base font-bold text-slate-900">{p.title}</h4>
                              {p.description && <p className="mt-1 text-sm text-slate-500 line-clamp-2">{p.description}</p>}
                              <p className="mt-1 text-xs text-slate-400">
                                Creator: <span className="font-medium text-slate-600">{p.creatorName || p.creatorId}</span>
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-0.5">
                              {[1,2,3,4,5].map(s => (
                                <svg key={s} viewBox="0 0 24 24" className={`h-3.5 w-3.5 ${s <= (p.rating||0) ? 'fill-amber-400' : 'fill-slate-200'}`}>
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          {p.languages?.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {p.languages.map(l => (
                                <span key={l} className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">{l}</span>
                              ))}
                            </div>
                          )}
                          {p.flagged && p.appeal && (
                            <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 p-3">
                              <p className="text-xs font-semibold text-amber-700">Student Appeal:</p>
                              <p className="mt-0.5 text-sm text-amber-800">{p.appeal}</p>
                            </div>
                          )}
                          <div className="mt-4">
                            <button
                              onClick={() => navigate(`/project/${p.id}`)}
                              className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500"
                            >
                              View Project
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* ══ STUDENT SECTIONS ══ */}
        {user.role === 'student' && (
          <div className="space-y-8">

            {/* MY PROJECTS */}
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg backdrop-blur">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Your Work</span>
                  <h3 className="mt-0.5 text-2xl font-bold text-slate-900">My Projects</h3>
                </div>
                <button
                  onClick={() => navigate('/create')}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-emerald-500"
                >
                  + New Project
                </button>
              </div>
              {myProjects.length > 0 ? (
                <div className="space-y-4">
                  {myProjects.map(p => (
                    <div key={p.id} className="rounded-2xl border border-slate-100 bg-white p-5 transition hover:shadow-md">
                      {/* Title row */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1.5 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">{p.course}</span>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.isPublic ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-500'}`}>
                              {p.isPublic ? 'Public' : 'Private'}
                            </span>
                            {p.flagged && <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">Flagged</span>}
                            {p.createdAt && <span className="text-xs text-slate-400">{p.createdAt}</span>}
                          </div>
                          <h4 className="text-base font-bold text-slate-900">{p.title}</h4>
                          {p.description && <p className="mt-1 text-sm text-slate-500 line-clamp-2">{p.description}</p>}
                        </div>
                        {/* Rating stars */}
                        <div className="flex items-center gap-0.5 shrink-0">
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} viewBox="0 0 24 24" className={`h-3.5 w-3.5 ${s <= (p.rating||0) ? 'fill-amber-400' : 'fill-slate-200'}`}>
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                          {p.rating && <span className="ml-1 text-xs text-slate-400">{p.rating}/5</span>}
                        </div>
                      </div>

                      {/* Languages */}
                      {p.languages?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {p.languages.map(l => (
                            <span key={l} className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">{l}</span>
                          ))}
                        </div>
                      )}

                      {/* Tags */}
                      {p.tags?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {p.tags.map(t => (
                            <span key={t} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">{t}</span>
                          ))}
                        </div>
                      )}

                      {/* Links */}
                      {(p.githubLink || p.demoVideo) && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {p.githubLink && (
                            <a href={p.githubLink} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                              </svg>
                              GitHub
                            </a>
                          )}
                          {p.demoVideo && (
                            <a href={p.demoVideo} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                                <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                              </svg>
                              Demo Video
                            </a>
                          )}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => navigate(`/project/${p.id}`)}
                          className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setProjectEditForm({
                              id: p.id,
                              title: p.title,
                              description: p.description || '',
                              course: p.course,
                              githubLink: p.githubLink || '',
                              demoVideo: p.demoVideo || '',
                              languages: [...(p.languages || [])],
                              tags: [...(p.tags || [])],
                            });
                            setProjectEditLangInput('');
                            setProjectEditTagInput('');
                            setShowProjectEditModal(true);
                          }}
                          className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setProjectDeleteTarget(p)}
                          className="rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                        {p.flagged && !p.appeal && (
                          <button
                            onClick={() => { setAppealTarget(p); setAppealMessage(''); setShowAppealModal(true); }}
                            className="rounded-full bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                          >
                            Appeal Flag
                          </button>
                        )}
                        {p.flagged && p.appeal && (
                          <span className="rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700">
                            Appeal Sent ✓
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <p className="text-sm text-slate-400">No projects yet.</p>
                  <button onClick={() => navigate('/create')} className="mt-3 rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500">
                    + Create your first project
                  </button>
                </div>
              )}
            </div>

            {/* COLLABORATING ON */}
            {(() => {
              const allStored = JSON.parse(localStorage.getItem('projects') || '[]');
              const collabProjects = allStored.filter(p =>
                p.creatorId !== user.email &&
                (p.collaborators || []).some(c => c.email === user.email && c.status === 'accepted')
              );
              return (
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-sky-600">Contributions</span>
                      <h3 className="mt-0.5 text-2xl font-bold text-slate-900">Collaborating On</h3>
                    </div>
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">{collabProjects.length} {collabProjects.length === 1 ? 'Project' : 'Projects'}</span>
                  </div>
                  {collabProjects.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                      <p className="text-sm text-slate-400">You haven't been added as a collaborator on any project yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {collabProjects.map(p => (
                        <div key={p.id} className="rounded-2xl border border-slate-100 bg-white p-4 transition hover:shadow-md">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-700">{p.course}</span>
                                {p.createdAt && <span className="text-xs text-slate-400">{p.createdAt}</span>}
                              </div>
                              <h4 className="font-bold text-slate-900">{p.title}</h4>
                              {p.description && <p className="mt-1 text-sm text-slate-500 line-clamp-2">{p.description}</p>}
                              <p className="mt-1 text-xs text-slate-400">Creator: <span className="text-slate-600">{p.creatorName || p.creatorId}</span></p>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              {[1,2,3,4,5].map(s => (
                                <svg key={s} viewBox="0 0 24 24" className={`h-3.5 w-3.5 ${s <= (p.rating||0) ? 'fill-amber-400' : 'fill-slate-200'}`}>
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          {p.languages?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {p.languages.map(l => (
                                <span key={l} className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">{l}</span>
                              ))}
                            </div>
                          )}
                          <div className="mt-3">
                            <button
                              onClick={() => navigate(`/project/${p.id}`)}
                              className="rounded-full bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500"
                            >
                              View Project
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* FAVORITES */}
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
              <h3 className="mb-5 text-xl font-bold text-slate-900">Favorite Projects & Portfolios</h3>
              {favorites.length > 0 ? (
                <div className="space-y-3">
                  {favorites.map((fav, i) => (
                    <div key={i} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4">
                      <div>
                        {fav.type === 'portfolio' ? (
                          <>
                            <p className="font-semibold text-slate-900">{fav.firstName} {fav.lastName}</p>
                            <p className="text-sm text-slate-400">Student Portfolio</p>
                          </>
                        ) : (
                          <>
                            <p className="font-semibold text-slate-900">{fav.title}</p>
                            <p className="text-sm text-slate-400">{fav.course}</p>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          const updated = favorites.filter((_, idx) => idx !== i);
                          setFavorites(updated);
                          localStorage.setItem(`favorites_${user.email}`, JSON.stringify(updated));
                        }}
                        className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm italic text-slate-400">No favorites added yet.</p>}
            </div>

            {/* PORTFOLIO STATS */}
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
              <h3 className="mb-6 text-xl font-bold text-slate-900">Portfolio Statistics</h3>
              <div className="grid gap-4 sm:grid-cols-3 mb-6">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Total Projects</p>
                  <p className="mt-2 text-4xl font-bold text-emerald-600">{myProjects.length}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Skills</p>
                  <p className="text-4xl font-bold text-emerald-600">{skills.length}</p>
                  <p className="mt-1 text-xs text-slate-400">on profile</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Internships</p>
                  <p className="text-4xl font-bold text-emerald-600">{completedInternships.length + autoCompletedInternships.length}</p>
                  <p className="mt-1 text-xs text-slate-400">completed</p>
                </div>
              </div>
              {/* Programming languages breakdown */}
              {(() => {
                const allLangs = myProjects.flatMap(p => p.languages || []);
                if (allLangs.length === 0) return (
                  <p className="text-sm italic text-slate-400">No programming languages recorded across your projects yet.</p>
                );
                const counts = {};
                allLangs.forEach(l => { counts[l] = (counts[l] || 0) + 1; });
                const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
                const total = allLangs.length;
                const colors = ['bg-emerald-500','bg-blue-500','bg-violet-500','bg-amber-500','bg-rose-500','bg-cyan-500','bg-orange-500'];
                return (
                  <div>
                    <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Languages Used</p>
                    <div className="space-y-2.5">
                      {sorted.map(([lang, count], i) => {
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={lang}>
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <span className="font-medium text-slate-700">{lang}</span>
                              <span className="text-slate-400">{pct}% ({count})</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full transition-all ${colors[i % colors.length]}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* TOP COLLABORATORS */}
            {(() => {
              const collabMap = {};
              myProjects.forEach(p => {
                (p.collaborators || []).filter(c => c.status === 'accepted').forEach(c => {
                  if (!collabMap[c.email]) {
                    collabMap[c.email] = { email: c.email, name: c.name || c.email, count: 0 };
                  }
                  collabMap[c.email].count++;
                });
              });
              const topCollabs = Object.values(collabMap).sort((a, b) => b.count - a.count).slice(0, 5);
              return (
                <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
                  <h3 className="mb-6 text-xl font-bold text-slate-900">Top Collaborators</h3>
                  {topCollabs.length === 0 ? (
                    <p className="text-sm italic text-slate-400">No accepted collaborators on your projects yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {topCollabs.map((collab, index) => (
                        <div key={collab.email} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                              #{index + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{collab.name}</p>
                              <p className="text-xs text-slate-400">{collab.email}</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                            {collab.count} {collab.count === 1 ? 'Project' : 'Projects'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}


            {/* COMPLETED INTERNSHIPS */}
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
              <h3 className="mb-5 text-xl font-bold text-slate-900">Completed Internships</h3>

              {/* Platform-verified (auto) */}
              {autoCompletedInternships.length > 0 && (
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Platform Verified</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">{autoCompletedInternships.length}</span>
                  </div>
                  <div className="space-y-2">
                    {autoCompletedInternships.map((i) => (
                      <div key={i.id} className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-900">{i.title}</p>
                          <p className="text-xs text-slate-500">{i.company} · {i.duration} · Deadline: {i.deadline}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">Completed</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manually added */}
              {autoCompletedInternships.length > 0 && (
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Added Manually</p>
              )}
              <div className="mb-4 flex gap-2">
                <input
                  value={newInternship}
                  onChange={e => setNewInternship(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addInternship(); }}
                  placeholder="e.g. Frontend Intern @ Google (external)"
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
                <button onClick={addInternship} className="rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-500">
                  Add
                </button>
              </div>
              {completedInternships.length > 0 ? (
                <div className="space-y-2">
                  {completedInternships.map((item, i) => (
                    <div key={i} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4">
                      <p className="text-sm text-slate-700">{item}</p>
                      <button onClick={() => removeInternship(i)} className="text-red-400 transition hover:text-red-600">✕</button>
                    </div>
                  ))}
                </div>
              ) : autoCompletedInternships.length === 0 ? (
                <p className="text-sm italic text-slate-400">No internships yet. Complete an internship through the platform or add one manually.</p>
              ) : null}
            </div>

          </div>
        )}

        {/* ══ EMPLOYER SECTIONS ══ */}
        {user.role === 'employer' && (
          <div className="space-y-8">

            {/* COMPANY BIO */}
            {isEditing && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <h3 className="text-2xl font-bold mb-5">Company Biography</h3>
                <textarea
                  value={companyBio}
                  onChange={e => setCompanyBio(e.target.value)}
                  rows={5}
                  placeholder="Write company biography..."
                  className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#10b981]"
                />
                <button
                  onClick={() => localStorage.setItem(`companyBio_${user.email}`, companyBio)}
                  className="mt-5 bg-[#059669] hover:bg-[#047857] text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Save Biography
                </button>
              </div>
            )}

            {/* COMPANY ADDRESS */}
            {isEditing && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <h3 className="text-2xl font-bold mb-5">Company Address</h3>
                <input
                  type="text"
                  value={companyAddress}
                  onChange={e => setCompanyAddress(e.target.value)}
                  placeholder="Enter company address..."
                  className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#10b981]"
                />
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => localStorage.setItem(`companyAddress_${user.email}`, companyAddress)}
                    className="bg-[#059669] hover:bg-[#047857] text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    Save Address
                  </button>
                  <button
                    onClick={openGoogleMaps}
                    className="bg-[#111827] hover:bg-black text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    Open Google Maps
                  </button>
                </div>
              </div>
            )}

            {/* CONTACT */}
            {isEditing && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <h3 className="text-2xl font-bold mb-5">Contact Information</h3>
                <textarea
                  value={companyContact}
                  onChange={e => setCompanyContact(e.target.value)}
                  rows={4}
                  placeholder="Add contact information..."
                  className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#10b981]"
                />
                <button
                  onClick={() => localStorage.setItem(`companyContact_${user.email}`, companyContact)}
                  className="mt-5 bg-[#059669] hover:bg-[#047857] text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Save Contact Info
                </button>
              </div>
            )}

            {/* FAVORITES — always visible */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-2xl font-bold mb-5">Favorite Projects & Portfolios</h3>
              {favorites.length > 0 ? (
                <div className="space-y-3">
                  {favorites.map((fav, i) => (
                    <div key={i} className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-[#111827]">{fav.title || `${fav.firstName} ${fav.lastName}`}</p>
                        <p className="text-gray-500 text-sm mt-1">{fav.course || 'Student Portfolio'}</p>
                      </div>
                      <button
                        onClick={() => setFavorites(prev => prev.filter((_, idx) => idx !== i))}
                        className="text-red-500 text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : <p className="text-gray-400">No favorites added yet.</p>}
            </div>

          </div>
        )}

      </div>

      {/* ══ APPEAL MODAL ══ */}
      {showAppealModal && appealTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="mb-1 text-lg font-semibold text-slate-900">Appeal Flag</h3>
            <p className="mb-4 text-sm text-slate-500">
              Explain why <span className="font-semibold text-slate-700">"{appealTarget.title}"</span> should be unflagged. Keep it brief and clear.
            </p>
            <textarea
              value={appealMessage}
              onChange={e => setAppealMessage(e.target.value.slice(0, 300))}
              rows={4}
              maxLength={300}
              placeholder="Describe why this flag should be removed..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            />
            <p className="mt-1 text-right text-xs text-slate-400">{appealMessage.length}/300</p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => { setShowAppealModal(false); setAppealMessage(''); setAppealTarget(null); }}
                className="rounded-full px-4 py-2 text-sm text-slate-500 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={submitAppeal}
                disabled={!appealMessage.trim()}
                className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Appeal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ PROJECT EDIT MODAL ══ */}
      {showProjectEditModal && projectEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="mb-5 text-lg font-semibold text-slate-900">Edit Project</h3>
            <div className="space-y-4">

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Title <span className="text-red-500">*</span></label>
                <input
                  value={projectEditForm.title}
                  onChange={e => setProjectEditForm({ ...projectEditForm, title: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Description <span className="text-red-500">*</span></label>
                <textarea
                  value={projectEditForm.description}
                  onChange={e => setProjectEditForm({ ...projectEditForm, description: e.target.value })}
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Course <span className="text-red-500">*</span></label>
                <select
                  value={projectEditForm.course}
                  onChange={e => setProjectEditForm({ ...projectEditForm, course: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                >
                  {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">GitHub Repository</label>
                <input
                  value={projectEditForm.githubLink}
                  onChange={e => setProjectEditForm({ ...projectEditForm, githubLink: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Demo Video URL</label>
                <input
                  value={projectEditForm.demoVideo}
                  onChange={e => setProjectEditForm({ ...projectEditForm, demoVideo: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Programming Languages / Tech Stack</label>
                <div className="flex gap-2">
                  <input
                    value={projectEditLangInput}
                    onChange={e => setProjectEditLangInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const v = projectEditLangInput.trim();
                        if (v && !projectEditForm.languages.includes(v)) {
                          setProjectEditForm({ ...projectEditForm, languages: [...projectEditForm.languages, v] });
                          setProjectEditLangInput('');
                        }
                      }
                    }}
                    placeholder="e.g. Python"
                    className="flex-1 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const v = projectEditLangInput.trim();
                      if (v && !projectEditForm.languages.includes(v)) {
                        setProjectEditForm({ ...projectEditForm, languages: [...projectEditForm.languages, v] });
                        setProjectEditLangInput('');
                      }
                    }}
                    className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200"
                  >
                    Add
                  </button>
                </div>
                {projectEditForm.languages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {projectEditForm.languages.map(lang => (
                      <span key={lang} className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        {lang}
                        <button
                          type="button"
                          onClick={() => setProjectEditForm({ ...projectEditForm, languages: projectEditForm.languages.filter(l => l !== lang) })}
                          className="ml-0.5 text-blue-400 hover:text-blue-800"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Tags</label>
                <div className="flex gap-2">
                  <input
                    value={projectEditTagInput}
                    onChange={e => setProjectEditTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const v = projectEditTagInput.trim();
                        if (v && !projectEditForm.tags.includes(v)) {
                          setProjectEditForm({ ...projectEditForm, tags: [...projectEditForm.tags, v] });
                          setProjectEditTagInput('');
                        }
                      }
                    }}
                    placeholder="e.g. AR"
                    className="flex-1 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const v = projectEditTagInput.trim();
                      if (v && !projectEditForm.tags.includes(v)) {
                        setProjectEditForm({ ...projectEditForm, tags: [...projectEditForm.tags, v] });
                        setProjectEditTagInput('');
                      }
                    }}
                    className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200"
                  >
                    Add
                  </button>
                </div>
                {projectEditForm.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {projectEditForm.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                        {tag}
                        <button
                          type="button"
                          onClick={() => setProjectEditForm({ ...projectEditForm, tags: projectEditForm.tags.filter(t => t !== tag) })}
                          className="ml-0.5 text-emerald-500 hover:text-emerald-800"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowProjectEditModal(false)} className="rounded-full px-4 py-2 text-sm text-slate-500 transition hover:bg-slate-100">Cancel</button>
              <button onClick={saveProjectEdit} className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ PROJECT DELETE CONFIRM MODAL ══ */}
      {projectDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">Delete Project?</h3>
            <p className="mb-6 text-sm text-slate-500">
              This will permanently delete <span className="font-semibold text-slate-700">"{projectDeleteTarget.title}"</span> and all its data. This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setProjectDeleteTarget(null)} className="rounded-full px-4 py-2 text-sm text-slate-500 transition hover:bg-slate-100">Cancel</button>
              <button onClick={confirmDeleteProject} className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
