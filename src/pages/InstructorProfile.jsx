import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

const MOCK_INSTRUCTORS = [
  { userId: 'ins-1', email: 'rania.mansour@guc.edu.eg',  firstName: 'Rania',   lastName: 'Mansour', subject: 'Bachelor Project',           status: 'accepted' },
  { userId: 'ins-2', email: 'tarek.sobhy@guc.edu.eg',    firstName: 'Tarek',   lastName: 'Sobhy',   subject: 'Database Systems',           status: 'accepted' },
  { userId: 'ins-3', email: 'hana.elgazzar@guc.edu.eg',  firstName: 'Hana',    lastName: 'Elgazzar',subject: 'Machine Learning',           status: 'accepted' },
  { userId: 'ins-4', email: 'karim.wahba@guc.edu.eg',    firstName: 'Karim',   lastName: 'Wahba',   subject: 'Computer Networks',          status: 'accepted' },
  { userId: 'ins-5', email: 'dina.salah@guc.edu.eg',     firstName: 'Dina',    lastName: 'Salah',   subject: 'Artificial Intelligence',    status: 'accepted' },
  { userId: 'ins-6', email: 'mostafa.aly@guc.edu.eg',    firstName: 'Mostafa', lastName: 'Aly',     subject: 'Embedded Systems',           status: 'accepted' },
];

function InstructorProfile() {
  const { email: encodedEmail } = useParams();
  const email = decodeURIComponent(encodedEmail);

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const allInstructors = [
    ...MOCK_INSTRUCTORS,
    ...users.filter(u => u.role === 'instructor'),
  ];

  const instructor = allInstructors.find(i => i.email === email);

  if (!instructor) {
    return (
      <div className="min-h-screen bg-[#f7f4ee] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 text-lg">Instructor not found.</p>
          <Link to="/home" className="mt-4 inline-block rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Load profile data from localStorage
  const profileImage     = localStorage.getItem(`profileImage_${email}`) || '';
  const biography        = localStorage.getItem(`bio_${email}`) || '';
  const researchInterests= localStorage.getItem(`research_${email}`) || '';
  const education        = localStorage.getItem(`education_${email}`) || '';

  const savedCourses = (() => {
    try { return JSON.parse(localStorage.getItem(`courses_${email}`)); } catch { return null; }
  })();

  // Build courses list: always include Bachelor Project; add subject for mock instructors
  const courses = (() => {
    if (savedCourses && savedCourses.length > 0) {
      return savedCourses.includes('Bachelor Project') ? savedCourses : ['Bachelor Project', ...savedCourses];
    }
    const base = ['Bachelor Project'];
    if (instructor.subject && instructor.subject !== 'Bachelor Project') base.push(instructor.subject);
    return base;
  })();

  // Projects this instructor is linked to
  const allProjects = (() => {
    try { return JSON.parse(localStorage.getItem('projects')) || []; } catch { return []; }
  })();
  const linkedProjects = allProjects.filter(p =>
    p.instructors?.some(i => i.email === email && i.status === 'accepted')
  );

  const initials = `${instructor.firstName[0]}${instructor.lastName[0]}`;

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-slate-900 antialiased">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-amber-200/70 blur-3xl" />
        <div className="absolute right-[-6%] top-20 h-[360px] w-[360px] rounded-full bg-emerald-200/60 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_55%),radial-gradient(circle_at_20%_70%,rgba(251,191,36,0.18),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <PageHeader showBack={true} />

        {/* PROFILE CARD */}
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start">

            {/* AVATAR */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-emerald-100 shadow-md">
                {profileImage
                  ? <img src={profileImage} alt={`${instructor.firstName} ${instructor.lastName}`} className="h-full w-full object-cover" />
                  : <div className="flex h-full w-full items-center justify-center bg-emerald-50 text-3xl font-bold text-emerald-600">{initials}</div>
                }
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${instructor.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {instructor.status === 'accepted' ? 'Active Instructor' : 'Pending'}
              </span>
            </div>

            {/* INFO */}
            <div className="flex-1 min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  Course Instructor
                </span>
                {instructor.subject && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {instructor.subject}
                  </span>
                )}
              </div>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                {instructor.firstName} {instructor.lastName}
              </h1>
              <p className="mt-1 text-sm text-slate-500">{instructor.email}</p>

              {/* BIO PREVIEW */}
              {biography && (
                <p className="mt-4 text-sm leading-relaxed text-slate-600 max-w-2xl">
                  {biography}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* LEFT COLUMN */}
          <div className="space-y-6 lg:col-span-2">

            {/* BIOGRAPHY */}
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Biography</h2>
              {biography
                ? <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">{biography}</p>
                : <p className="text-sm italic text-slate-400">No biography provided yet.</p>
              }
            </div>

            {/* RESEARCH INTERESTS */}
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Research Interests</h2>
              {researchInterests
                ? <p className="text-sm leading-relaxed text-emerald-800 whitespace-pre-line">{researchInterests}</p>
                : <p className="text-sm italic text-slate-400">No research interests listed yet.</p>
              }
            </div>

            {/* EDUCATION BACKGROUND */}
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Education Background</h2>
              {education
                ? <p className="text-sm leading-relaxed text-amber-800 whitespace-pre-line">{education}</p>
                : <p className="text-sm italic text-slate-400">No education background listed yet.</p>
              }
            </div>

            {/* LINKED PROJECTS */}
            {linkedProjects.length > 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Supervised Projects</h2>
                <div className="space-y-3">
                  {linkedProjects.map(p => (
                    <Link
                      key={p.id}
                      to={`/project/${p.id}`}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{p.title}</p>
                        <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">{p.course}</span>
                      </div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 text-slate-400">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            {/* COURSES TAUGHT */}
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Courses Taught</h2>
              <div className="flex flex-wrap gap-2">
                {courses.map(c => (
                  <span
                    key={c}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${c === 'Bachelor Project' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}
                  >
                    {c}
                    {c === 'Bachelor Project' && <span className="ml-1 text-emerald-500">🔒</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">At a Glance</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Courses</span>
                  <span className="text-lg font-bold text-emerald-600">{courses.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Projects</span>
                  <span className="text-lg font-bold text-emerald-600">{linkedProjects.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Status</span>
                  <span className={`text-xs font-semibold capitalize ${instructor.status === 'accepted' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {instructor.status}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorProfile;
