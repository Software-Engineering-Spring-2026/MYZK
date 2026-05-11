import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [projectRatingFilter, setProjectRatingFilter] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const [settings, setSettings] = useState({
    allNotifications: true,
    cookies: true,
    emailNotifications: true,
    pushNotifications: false,
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    const currentEmail = JSON.parse(localStorage.getItem('user'))?.email || '';
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // ---------------- AUTH ----------------
  const user = JSON.parse(localStorage.getItem('user'));
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem(`favorites_${user?.email}`)) || []
  );

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const closeAllFilters = () => {
    setShowProjectFilter(false);
    setShowInternshipFilter(false);
    setShowInternshipSort(false);
    setShowProjectSort(false);
    setShowStudentFilter(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', closeAllFilters, true);
    return () => window.removeEventListener('scroll', closeAllFilters, true);
  }, []);

  if (!user) return null;

  // ---------------- SEARCH STATES ----------------
  const [discoverTab, setDiscoverTab] = useState('projects');
  const [showProjectFilter, setShowProjectFilter] = useState(false);
  const projectFilterBtnRef = useRef(null);
  const [filterBtnPos, setFilterBtnPos] = useState({ top: 0, left: 0, width: 0 });
  const filterHideTimeout = useRef(null);
  const internshipFilterTimeout = useRef(null);
  const internshipSortTimeout = useRef(null);
  const projectSortTimeout = useRef(null);
  const studentFilterTimeout = useRef(null);
  const internshipFilterBtnRef = useRef(null);
  const [internshipFilterPos, setInternshipFilterPos] = useState({ top: 0, left: 0 });
  const internshipSortBtnRef = useRef(null);
  const [internshipSortPos, setInternshipSortPos] = useState({ top: 0, left: 0 });
  const projectSortBtnRef = useRef(null);
  const [projectSortPos, setProjectSortPos] = useState({ top: 0, left: 0 });
  const studentFilterBtnRef = useRef(null);
  const [studentFilterPos, setStudentFilterPos] = useState({ top: 0, left: 0 });
  const [showInternshipSort, setShowInternshipSort] = useState(false);
  const [instructorSearch, setInstructorSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [projectDateSearch, setProjectDateSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [internshipSort, setInternshipSort] = useState('newest');
  const [internshipSearch, setInternshipSearch] = useState('');
  const [internshipDateFilter, setInternshipDateFilter] = useState('');
  const [internshipDurationFilter, setInternshipDurationFilter] = useState('');
  const [showInternshipFilter, setShowInternshipFilter] = useState(false);
  const [internshipCompanyFilter, setInternshipCompanyFilter] = useState('');
  const [projectCourseFilter, setProjectCourseFilter] = useState('');
  const [projectInstructorFilter, setProjectInstructorFilter] = useState('');
  const [projectSortBy, setProjectSortBy] = useState('');
  const [showProjectSort, setShowProjectSort] = useState(false);
  const [showStudentFilter, setShowStudentFilter] = useState(false);
  const [studentMajorFilter, setStudentMajorFilter] = useState('');
  const [studentSkillsFilter, setStudentSkillsFilter] = useState('');
  const [studentSortByProjects, setStudentSortByProjects] = useState('');
  const [selectedStudentPortfolio, setSelectedStudentPortfolio] = useState(null);
  const [courseSearch, setCourseSearch] = useState('');
const [showApplySuccess, setShowApplySuccess] = useState(false);
const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
const [selectedInternship, setSelectedInternship] = useState(null);
const [coverLetter, setCoverLetter] = useState('');
const [appliedInternships, setAppliedInternships] = useState(
  JSON.parse(localStorage.getItem(`appliedInternships_${user?.email}`)) || []
);

const [showInternshipModal, setShowInternshipModal] = useState(false);
const [editingInternship, setEditingInternship] = useState(null);

const [employerInternships, setEmployerInternships] = useState(
  JSON.parse(localStorage.getItem('employerInternships')) || []
);
const [selectedInternshipForApplicants, setSelectedInternshipForApplicants] = useState(null);
const [applicantStatuses, setApplicantStatuses] = useState(
  JSON.parse(localStorage.getItem('applicantStatuses')) || {}
);
const [applicantSortByContributors, setApplicantSortByContributors] = useState(false);

const [internshipForm, setInternshipForm] = useState({
  title: '',
  responsibilities: '',
  skills: '',
  duration: '',
  deadline: '',
  languages: '',
});



  // ---------------- LOCAL STORAGE USERS ----------------
  const users = JSON.parse(localStorage.getItem('users')) || [];

  // ---------------- MOCK INSTRUCTORS ----------------
  const mockInstructors = [
    { userId: 'ins-1', email: 'rania.mansour@guc.edu.eg', firstName: 'Rania', lastName: 'Mansour', subject: 'Bachelor Project', status: 'accepted' },
    { userId: 'ins-2', email: 'tarek.sobhy@guc.edu.eg', firstName: 'Tarek', lastName: 'Sobhy', subject: 'Database Systems', status: 'accepted' },
    { userId: 'ins-3', email: 'hana.elgazzar@guc.edu.eg', firstName: 'Hana', lastName: 'Elgazzar', subject: 'Machine Learning', status: 'accepted' },
    { userId: 'ins-4', email: 'karim.wahba@guc.edu.eg', firstName: 'Karim', lastName: 'Wahba', subject: 'Computer Networks', status: 'accepted' },
    { userId: 'ins-5', email: 'dina.salah@guc.edu.eg', firstName: 'Dina', lastName: 'Salah', subject: 'Artificial Intelligence', status: 'accepted' },
    { userId: 'ins-6', email: 'mostafa.aly@guc.edu.eg', firstName: 'Mostafa', lastName: 'Aly', subject: 'Embedded Systems', status: 'accepted' },
  ];

  // ---------------- MOCK INTERNSHIPS ----------------
const mockInternships = [
  {
    id: 'mock-int-1', title: 'Backend Engineer Intern', company: 'Paymob', location: 'New Cairo',
    duration: '3 Months', postedDate: '2026-04-20', deadline: '2026-06-15',
    status: 'Currently Hiring', archived: false,
    responsibilities: 'Build and maintain RESTful payment APIs, collaborate with the core engineering team on transaction processing, write unit and integration tests.',
    skills: 'Node.js, REST APIs, PostgreSQL, Git',
    languages: 'JavaScript, TypeScript',
  },
  {
    id: 'mock-int-2', title: 'Data Engineering Intern', company: 'Paymob', location: 'New Cairo',
    duration: '6 Months', postedDate: '2026-04-25', deadline: '2026-07-01',
    status: 'Currently Hiring', archived: false,
    responsibilities: 'Design and maintain ETL pipelines, build dashboards for transaction analytics, work with the data team on schema design.',
    skills: 'Python, SQL, Apache Spark, dbt',
    languages: 'Python, SQL',
  },
  {
    id: 'mock-int-3', title: 'Software Engineering Intern', company: 'VOIS', location: 'Smart Village',
    duration: '3 Months', postedDate: '2026-05-01', deadline: '2026-06-30',
    status: 'Currently Hiring', archived: false,
    responsibilities: 'Develop internal tooling for the telecom platform, participate in agile sprints, write documentation for new features.',
    skills: 'Java, Spring Boot, SQL, Git',
    languages: 'Java, Python',
  },
  {
    id: 'mock-int-4', title: 'Mobile Developer Intern', company: 'Fawry', location: 'Heliopolis',
    duration: '3 Months', postedDate: '2026-05-05', deadline: '2026-06-20',
    status: 'Currently Hiring', archived: false,
    responsibilities: 'Maintain and enhance Fawry\'s consumer-facing Flutter app, implement new payment flows, fix reported UI bugs.',
    skills: 'Flutter, Dart, Firebase, REST APIs',
    languages: 'Dart',
  },
  {
    id: 'mock-int-5', title: 'Data Science Intern', company: 'Synapse Analytics', location: 'Remote',
    duration: '4 Months', postedDate: '2026-05-08', deadline: '2026-07-31',
    status: 'Currently Hiring', archived: false,
    responsibilities: 'Build predictive models for client analytics dashboards, clean and explore datasets, present findings to project leads.',
    skills: 'Python, Pandas, Scikit-learn, Tableau',
    languages: 'Python',
  },
  {
    id: 'mock-int-6', title: 'Embedded Systems Intern', company: 'Valeo', location: '6th October',
    duration: '6 Months', postedDate: '2026-04-15', deadline: '2026-06-01',
    status: 'Currently Hiring', archived: false,
    responsibilities: 'Develop low-level firmware for automotive ECUs, write tests on AUTOSAR components, debug hardware/software integration issues.',
    skills: 'C, AUTOSAR, CAN Bus, Embedded Linux',
    languages: 'C, C++',
  },
  {
    id: 'mock-int-7', title: 'Frontend Engineer Intern', company: 'Bosta', location: 'Cairo',
    duration: '3 Months', postedDate: '2026-05-10', deadline: '2026-07-15',
    status: 'Currently Hiring', archived: false,
    responsibilities: 'Build shipment tracking UI components, integrate with logistics APIs, work with designers on mobile-first responsive layouts.',
    skills: 'React, TypeScript, CSS, REST APIs',
    languages: 'JavaScript, TypeScript',
  },
  {
    id: 'mock-int-8', title: 'Full Stack Intern', company: 'Swvl', location: 'New Cairo',
    duration: '6 Months', postedDate: '2026-04-30', deadline: '2026-06-28',
    status: 'Currently Hiring', archived: false,
    responsibilities: 'Develop features across the ride-sharing platform stack, maintain Node.js microservices, contribute to React dashboard improvements.',
    skills: 'React, Node.js, MongoDB, Docker',
    languages: 'JavaScript, TypeScript',
  },
];

  const allInternships = [
  ...mockInternships,
  ...employerInternships,
];

const filteredInternships = [...allInternships]
  .filter((i) => !i.archived)
  .filter((i) =>
    `${i.title} ${i.company || ''} ${i.location || ''}`
      .toLowerCase()
      .includes(internshipSearch.toLowerCase())
  )
  .filter(
    (i) =>
      internshipDurationFilter === '' ||
      i.duration === internshipDurationFilter
  )
  .filter(
    (i) =>
      internshipCompanyFilter === '' ||
      (i.company || '').toLowerCase().includes(internshipCompanyFilter.toLowerCase())
  )
  .sort((a, b) =>
    internshipSort === 'newest'
      ? new Date(b.postedDate || 0) - new Date(a.postedDate || 0)
      : new Date(a.postedDate || 0) - new Date(b.postedDate || 0)
  );

  // ---------------- MOCK PROJECTS ----------------
  const mockProjects = [
    {
      id: 'project-seeded-1', title: 'GUC Lost & Found Platform',
      description: 'A full-stack web app that lets GUC students report lost items and claim found ones with real-time notifications.',
      course: 'Bachelor Project', createdAt: '2026-03-15', rating: 4,
      creatorId: 'layla.hassan@student.guc.edu.eg', creatorName: 'Layla Hassan',
      isPublic: true, flagged: false, tags: ['React', 'Node.js', 'PostgreSQL'],
    },
    {
      id: 'project-seeded-2', title: 'Smart Irrigation Controller',
      description: 'An IoT system using soil-moisture sensors and an Arduino controller to automate irrigation scheduling.',
      course: 'Embedded Systems', createdAt: '2026-02-28', rating: 5,
      creatorId: 'omar.farouk@student.guc.edu.eg', creatorName: 'Omar Farouk',
      isPublic: true, flagged: false, tags: ['Java', 'Arduino', 'IoT'],
    },
    {
      id: 'project-seeded-3', title: 'Arabic Sentiment Analyzer',
      description: 'A fine-tuned transformer model for multi-class sentiment analysis on Arabic social media text.',
      course: 'Machine Learning', createdAt: '2026-04-05', rating: 4,
      creatorId: 'nour.sherif@student.guc.edu.eg', creatorName: 'Nour Sherif',
      isPublic: true, flagged: true, tags: ['Python', 'PyTorch', 'NLP'],
    },
    {
      id: 'project-seeded-4', title: 'GUC Room Booking App',
      description: 'A Flutter mobile app for reserving study rooms and labs on campus with live availability.',
      course: 'Mobile Application Development', createdAt: '2026-04-18', rating: 3,
      creatorId: 'youssef.khaled@student.guc.edu.eg', creatorName: 'Youssef Khaled',
      isPublic: true, flagged: false, tags: ['Flutter', 'Firebase', 'Dart'],
    },
    {
      id: 'project-seeded-5', title: 'Campus Clinic Scheduler',
      description: 'A web portal for booking appointments at the GUC clinic with doctor availability and SMS reminders.',
      course: 'Database Systems', createdAt: '2026-05-02', rating: 0,
      creatorId: 'layla.hassan@student.guc.edu.eg', creatorName: 'Layla Hassan',
      isPublic: false, flagged: false, tags: ['React', 'PostgreSQL', 'Node.js'],
    },
  ];

  const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];

  // ---------------- MOCK STUDENTS ----------------
  const mockStudents = [
    { firstName: 'Layla', lastName: 'Hassan', email: 'layla.hassan@student.guc.edu.eg', role: 'student', major: 'Computer Science', skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'] },
    { firstName: 'Omar', lastName: 'Farouk', email: 'omar.farouk@student.guc.edu.eg', role: 'student', major: 'Computer Engineering', skills: ['Java', 'Spring Boot', 'SQL', 'Arduino'] },
    { firstName: 'Nour', lastName: 'Sherif', email: 'nour.sherif@student.guc.edu.eg', role: 'student', major: 'Media Engineering', skills: ['Python', 'PyTorch', 'NLP', 'Data Analysis'] },
    { firstName: 'Youssef', lastName: 'Khaled', email: 'youssef.khaled@student.guc.edu.eg', role: 'student', major: 'Computer Science', skills: ['Flutter', 'Firebase', 'Dart', 'React Native'] },
    { firstName: 'Mariam', lastName: 'Samy', email: 'mariam.samy@student.guc.edu.eg', role: 'student', major: 'Computer Science', skills: ['Python', 'Machine Learning', 'TensorFlow', 'Keras'] },
    { firstName: 'Adam', lastName: 'Ashraf', email: 'adam.ashraf@student.guc.edu.eg', role: 'student', major: 'Computer Engineering', skills: ['Cyber Security', 'Linux', 'Penetration Testing'] },
  ];

  const allStudents = [...mockStudents, ...users.filter((u) => u.role === 'student')];
  const allProjects = [...mockProjects, ...storedProjects];

  const mockCourses = [
    { name: 'Bachelor Project', code: 'CSEN 700' },
    { name: 'Software Engineering', code: 'CSEN 603' },
    { name: 'Database Systems', code: 'CSEN 604' },
    { name: 'Operating Systems', code: 'CSEN 602' },
    { name: 'Machine Learning', code: 'CSEN 702' },
    { name: 'Artificial Intelligence', code: 'CSEN 701' },
    { name: 'Computer Networks', code: 'CSEN 601' },
    { name: 'Data Structures & Algorithms', code: 'CSEN 301' },
    { name: 'Mobile Application Development', code: 'CSEN 606' },
    { name: 'Cyber Security', code: 'CSEN 703' },
    { name: 'Embedded Systems', code: 'CSEN 503' },
    { name: 'Web Application Development', code: 'CSEN 605' },
  ];

  // ---------------- FILTERING ----------------
  const filteredInstructors = mockInstructors.filter((i) =>
    `${i.firstName} ${i.lastName} ${i.email} ${i.subject}`.toLowerCase().includes(instructorSearch.toLowerCase())
  );

const filteredProjects = allProjects
  .filter((p) => p.isPublic !== false)
  .filter((p) => !p.flagged)
  .filter((p) =>
    `${p.title} ${p.description} ${p.course}`.toLowerCase().includes(projectSearch.toLowerCase())
  )
  .filter((p) => projectDateSearch === '' || p.createdAt?.includes(projectDateSearch))
  .filter((p) => projectRatingFilter === 0 || (p.rating || 0) >= projectRatingFilter)
  .filter((p) => projectCourseFilter === '' || (p.course || '').toLowerCase().includes(projectCourseFilter.toLowerCase()))
  .filter((p) =>
    projectInstructorFilter === '' ||
    (p.instructors || []).some(i =>
      `${i.firstName || ''} ${i.lastName || ''} ${i.email || ''}`.toLowerCase().includes(projectInstructorFilter.toLowerCase())
    )
  )
  .sort((a, b) => {
    if (projectSortBy === 'date_asc') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    if (projectSortBy === 'date_desc') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (projectSortBy === 'rating_asc') return (a.rating || 0) - (b.rating || 0);
    if (projectSortBy === 'rating_desc') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const filteredStudents = allStudents
    .filter((s) =>
      `${s.firstName} ${s.lastName} ${s.email} ${(s.skills || []).join(' ')} ${s.major || ''}`
        .toLowerCase()
        .includes(studentSearch.toLowerCase())
    )
    .filter((s) => studentMajorFilter === '' || (s.major || '').toLowerCase().includes(studentMajorFilter.toLowerCase()))
    .filter((s) =>
      studentSkillsFilter === '' ||
      (s.skills || []).some(sk => sk.toLowerCase().includes(studentSkillsFilter.toLowerCase()))
    )
    .map((s) => ({ ...s, projectCount: allProjects.filter(p => p.creatorId === s.email).length }))
    .sort((a, b) =>
      studentSortByProjects === 'desc' ? b.projectCount - a.projectCount
      : studentSortByProjects === 'asc' ? a.projectCount - b.projectCount
      : 0
    );

  // ---------------- HELPERS ----------------
  const myNotifications = notifications.filter(n => n.userId === user?.email);
  const toggleRead = (id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: !n.read } : n));
  const unreadCount = myNotifications.filter((n) => !n.read).length;

  // Write a notification directly to localStorage for a different user (cross-user notify)
  const notifyUser = (toEmail, message) => {
    const stored = JSON.parse(localStorage.getItem('notifications') || '[]');
    stored.push({ id: Date.now().toString(), userId: toEmail, message, read: false, createdAt: new Date().toISOString() });
    localStorage.setItem('notifications', JSON.stringify(stored));
  };

const toggleSetting = (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const togglePortfolioFavorite = (student) => {
    const alreadyExists = favorites.some((fav) => fav.email === student.email);
    const updatedFavorites = alreadyExists
      ? favorites.filter((fav) => fav.email !== student.email)
      : [...favorites, { type: 'portfolio', ...student }];
    setFavorites(updatedFavorites);
    localStorage.setItem(`favorites_${user.email}`, JSON.stringify(updatedFavorites));
  };

  // ---------------- DASHBOARDS ----------------
  const StudentDashboard = () => {
    const myProjects = allProjects.filter(p => p.creatorId === user.email);
    return (
    <div className="space-y-6">
      {/* MY PROJECTS */}
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Your Work</span>
            <h2 className="mt-0.5 text-xl font-semibold text-slate-900">My Projects</h2>
          </div>
          <button
            onClick={() => navigate('/create')}
            className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-emerald-500"
          >
            + New Project
          </button>
        </div>
        {myProjects.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">📁</div>
            <p className="text-sm font-medium text-slate-600">No projects yet.</p>
            <p className="text-xs text-slate-400">Create your first project to showcase your work.</p>
            <button
              onClick={() => navigate('/create')}
              className="mt-1 rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow transition hover:bg-emerald-500"
            >
              + Create your first project
            </button>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {myProjects.map(p => (
              <div
                key={p.id}
                className="min-w-[220px] max-w-[220px] shrink-0 rounded-2xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <p className="truncate font-semibold text-slate-900">{p.title}</p>
                {p.course && (
                  <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">{p.course}</span>
                )}
                <div className="mt-2 flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} viewBox="0 0 24 24" className={`h-3 w-3 ${s <= (p.rating||0) ? 'fill-amber-400' : 'fill-slate-200'}`}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-1 text-xs text-slate-400">{p.createdAt}</p>
                <button
                  onClick={() => navigate(`/project/${p.id}`)}
                  className="mt-3 w-full rounded-full bg-emerald-600 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FIND INTERNSHIPS */}
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Find Internships</h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">New Opportunities</span>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row mb-6">
  <input
    type="text"
    value={internshipSearch}
    onChange={(e) => setInternshipSearch(e.target.value)}
    placeholder="Search by title or company name..."
    className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
  />

  <div
    ref={internshipFilterBtnRef}
    className="relative"
    onMouseEnter={() => {
      clearTimeout(internshipFilterTimeout.current);
      setShowInternshipSort(false); setShowProjectFilter(false); setShowProjectSort(false); setShowStudentFilter(false);
      const rect = internshipFilterBtnRef.current?.getBoundingClientRect();
      if (rect) setInternshipFilterPos({ top: rect.bottom + 8, left: rect.right - 256 });
      setShowInternshipFilter(true);
    }}
    onMouseLeave={() => { internshipFilterTimeout.current = setTimeout(() => setShowInternshipFilter(false), 150); }}
  >
    <button
      className={`flex min-w-[140px] items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${(internshipCompanyFilter || internshipDurationFilter) ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : showInternshipFilter ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
      <span>
        Filter{(internshipCompanyFilter || internshipDurationFilter) ? ` (${[internshipCompanyFilter && 'Company', internshipDurationFilter && 'Duration'].filter(Boolean).length})` : ''}
      </span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  </div>

          <div
            ref={internshipSortBtnRef}
            className="relative"
            onMouseEnter={() => {
              clearTimeout(internshipSortTimeout.current);
              setShowInternshipFilter(false); setShowProjectFilter(false); setShowProjectSort(false); setShowStudentFilter(false);
              const rect = internshipSortBtnRef.current?.getBoundingClientRect();
              if (rect) setInternshipSortPos({ top: rect.bottom + 8, left: rect.right - 192 });
              setShowInternshipSort(true);
            }}
            onMouseLeave={() => { internshipSortTimeout.current = setTimeout(() => setShowInternshipSort(false), 150); }}
          >
            <button
              className={`flex min-w-[160px] items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${showInternshipSort ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              <span>{internshipSort === 'newest' ? 'Newest First' : 'Oldest First'}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInternships.length > 0 ? filteredInternships.map((internship) => (
            <div key={internship.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{internship.title}</p>
                  <p className="mt-0.5 text-sm font-medium text-emerald-600">{internship.company}</p>
                </div>
                {internship.status && (() => {
                  const expired = internship.deadline && new Date() > new Date(internship.deadline) && internship.status === 'Currently Hiring';
                  return (
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${expired ? 'bg-slate-200 text-slate-600' : internship.status === 'Currently Hiring' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {expired ? 'Internship Expired' : internship.status}
                    </span>
                  );
                })()}
              </div>
              {/* Badges */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {internship.location && <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">{internship.location}</span>}
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">{internship.duration}</span>
              </div>
              {/* Deadline */}
              {internship.deadline && (() => {
                const passed = new Date() > new Date(internship.deadline);
                return <p className={`mt-2 text-xs font-semibold ${passed ? 'text-red-500' : 'text-slate-500'}`}>{passed ? 'Deadline passed: ' : 'Apply by: '}{internship.deadline}</p>;
              })()}
              {/* Responsibilities */}
              {internship.responsibilities && (
                <p className="mt-3 text-xs leading-relaxed text-slate-500 line-clamp-2">{internship.responsibilities}</p>
              )}
              {/* Skills & Languages */}
              {internship.skills && (
                <div className="mt-2.5">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Skills</p>
                  <p className="text-xs text-slate-600">{internship.skills}</p>
                </div>
              )}
              {internship.languages && (
                <p className="mt-1.5 text-xs text-slate-400">Languages: {internship.languages}</p>
              )}
              {/* Footer */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-slate-300">Posted: {internship.postedDate}</p>
                {(() => {
                  const deadlinePassed = internship.deadline && new Date() > new Date(internship.deadline);
                  const alreadyApplied = appliedInternships.includes(internship.id);
                  const positionFilled = internship.status === 'Position Filled';
                  const blocked = alreadyApplied || positionFilled || deadlinePassed;
                  return (
                    <button
                      disabled={blocked}
                      onClick={() => { if (blocked) return; setSelectedInternship(internship); setShowCoverLetterModal(true); }}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold shadow transition ${
                        alreadyApplied ? 'cursor-not-allowed bg-slate-300 text-white'
                        : positionFilled ? 'cursor-not-allowed bg-red-200 text-red-700'
                        : deadlinePassed ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      {alreadyApplied ? 'Applied' : positionFilled ? 'Position Filled' : deadlinePassed ? 'Deadline Passed' : 'Apply'}
                    </button>
                  );
                })()}
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="text-4xl">📋</span>
              <p className="font-medium text-slate-600">No internships match your search.</p>
              {(internshipSearch || internshipCompanyFilter || internshipDurationFilter) && (
                <button
                  onClick={() => { setInternshipSearch(''); setInternshipCompanyFilter(''); setInternshipDurationFilter(''); }}
                  className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-100"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

{showApplySuccess && (
  <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700 shadow-sm">
    ✅ Internship application submitted successfully!
  </div>
)}
{showCoverLetterModal && selectedInternship && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900">
          Apply for Internship
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          {selectedInternship.title} at{' '}
          {selectedInternship.company}
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Cover Letter
        </label>

        <textarea
          value={coverLetter}
          maxLength={250}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Explain briefly why you fit this role..."
          rows={5}
          className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
        />

        <div className="mt-2 text-right text-xs text-slate-400">
          {coverLetter.length}/250
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          onClick={() => {
            setShowCoverLetterModal(false);
            setSelectedInternship(null);
            setCoverLetter('');
          }}
          className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            if (!coverLetter.trim()) return;

            const updatedApplied = [
              ...appliedInternships,
              selectedInternship.id,
            ];

            setAppliedInternships(updatedApplied);

            localStorage.setItem(
              `appliedInternships_${user.email}`,
              JSON.stringify(updatedApplied)
            );

            localStorage.setItem(
              `coverLetter_${user.email}_${selectedInternship.id}`,
              coverLetter
            );

            const allAppUsers = JSON.parse(localStorage.getItem('users') || '[]');
            const employer = allAppUsers.find(u => u.role === 'employer' && u.companyName === selectedInternship.company);
            if (employer) {
              const studentName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
              notifyUser(employer.email, `${studentName} applied to your "${selectedInternship.title}" internship.`);
            }

            setShowCoverLetterModal(false);
            setSelectedInternship(null);
            setCoverLetter('');

            setShowApplySuccess(true);

            setTimeout(() => {
              setShowApplySuccess(false);
            }, 2500);
          }}
          className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          Submit Application
        </button>
      </div>
    </div>
  </div>
)}
    </div>
    );
  };

  const InstructorDashboard = () => {
    const recommendedProjects = allProjects
      .filter(p => !p.flagged && p.isPublic !== false)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);
    const filteredCourses = mockCourses.filter(c =>
      `${c.name} ${c.code}`.toLowerCase().includes(courseSearch.toLowerCase())
    );
    return (
      <div className="space-y-6">
        {/* COURSES SECTION */}
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Course Management</span>
              <h2 className="mt-0.5 text-xl font-semibold text-slate-900">Courses</h2>
            </div>
            <input
              type="text"
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              placeholder="Search by name or code..."
              className="w-64 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((c) => (
              <div key={c.code} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xs font-bold text-emerald-700">
                  {c.code.slice(0, 4)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.code}</p>
                </div>
              </div>
            ))}
            {filteredCourses.length === 0 && (
              <p className="text-sm italic text-slate-400">No courses match your search.</p>
            )}
          </div>
        </div>

        {/* REVIEW PANEL */}
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Instructor Review Panel</h2>
          </div>
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Recommended Projects</h3>
          {recommendedProjects.length === 0 ? (
            <p className="text-sm italic text-slate-400">No public projects yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedProjects.map((project) => (
                <div key={project.id} onClick={() => navigate(`/project/${project.id}`)} className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                  <p className="font-semibold text-slate-900">{project.title}</p>
                  {project.course && <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">{project.course}</span>}
                  <div className="mt-2 flex items-center gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} viewBox="0 0 24 24" className={`h-3 w-3 ${s <= (project.rating||0) ? 'fill-amber-400' : 'fill-slate-200'}`}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <button onClick={e => { e.stopPropagation(); navigate(`/project/${project.id}`); }} className="mt-4 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-emerald-500">
                    View Project
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

 const saveInternship = () => {
  if (!internshipForm.title.trim()) return;

  let updated;

  if (editingInternship) {
    updated = employerInternships.map((i) =>
      i.id === editingInternship.id
        ? { ...editingInternship, ...internshipForm }
        : i
    );
  } else {
    updated = [
      ...employerInternships,
      {
  id: Date.now(),
  ...internshipForm,
  company: user.companyName || user.firstName || '',
  postedDate: new Date().toISOString().split('T')[0],
  status: 'Currently Hiring',
  archived: false,
},
    ];
  }

  setEmployerInternships(updated);

  localStorage.setItem(
    'employerInternships',
    JSON.stringify(updated)
  );

  setShowInternshipModal(false);
  setEditingInternship(null);

  setInternshipForm({
    title: '',
    responsibilities: '',
    skills: '',
    duration: '',
    deadline: '',
    languages: '',
  });
};

const deleteInternship = (id) => {
  const updated = employerInternships.filter(
    (i) => i.id !== id
  );

  setEmployerInternships(updated);

  localStorage.setItem(
    'employerInternships',
    JSON.stringify(updated)
  );
};

const updateApplicantStatus = (internshipId, studentEmail, status) => {
  const key = `${internshipId}_${studentEmail}`;
  const updated = { ...applicantStatuses, [key]: status };
  setApplicantStatuses(updated);
  localStorage.setItem('applicantStatuses', JSON.stringify(updated));
  if (status === 'accepted' || status === 'rejected') {
    const internship = allInternships.find(i => String(i.id) === String(internshipId));
    const msg = status === 'accepted'
      ? `Congratulations! Your application for "${internship?.title || 'an internship'}" has been accepted.`
      : `Your application for "${internship?.title || 'an internship'}" has been rejected.`;
    notifyUser(studentEmail, msg);
  }
};

  const EmployerDashboard = () => {
    const recommendedProjects = allProjects
      .filter(p => !p.flagged && p.isPublic !== false)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);
    const allEmpUsers = JSON.parse(localStorage.getItem('users')) || [];
    const allEmpProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const totalInternshipsOffered = employerInternships.length;
    const totalAccepted = Object.values(applicantStatuses).filter(s => s === 'accepted').length;
    const completedInternshipsCount = (() => {
      let count = 0;
      employerInternships.forEach(i => {
        if (!i.deadline || new Date() <= new Date(i.deadline)) return;
        allEmpUsers.forEach(u => {
          if (applicantStatuses[`${i.id}_${u.email}`] === 'accepted') count++;
        });
      });
      return count;
    })();
    const getApplicantsForInternship = (internshipId) =>
      allEmpUsers.filter(u => {
        const applied = JSON.parse(localStorage.getItem(`appliedInternships_${u.email}`)) || [];
        return applied.includes(internshipId);
      }).map(u => ({
        ...u,
        projectCount: allEmpProjects.filter(p => p.creatorId === u.email || p.creatorId === u.id).length,
        coverLetter: localStorage.getItem(`coverLetter_${u.email}_${internshipId}`) || '',
      }));
    const favoritedEmails = favorites.filter(f => f.type === 'portfolio').map(f => f.email);
    const suggestedApplicants = allEmpUsers
      .filter(u => favoritedEmails.includes(u.email))
      .map(u => ({
        ...u,
        projectCount: allEmpProjects.filter(p => p.creatorId === u.email || p.creatorId === u.id).length,
        hasApplied: employerInternships.some(i => {
          const applied = JSON.parse(localStorage.getItem(`appliedInternships_${u.email}`)) || [];
          return applied.includes(i.id);
        }),
      }))
      .filter(u => u.hasApplied)
      .sort((a, b) => b.projectCount - a.projectCount);
    return (
      <div className="space-y-6">
        {/* EMPLOYER HEADER CARD */}
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700">Employer Hub</span>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Find the best student talent.</h2>
              <p className="mt-1 text-sm text-slate-500">Browse top-rated projects and connect with students.</p>
            </div>
            <button
  onClick={() => {
    setEditingInternship(null);

    setInternshipForm({
      title: '',
      responsibilities: '',
      skills: '',
      duration: '',
      deadline: '',
      languages: '',
    });

    setShowInternshipModal(true);
  }}
  className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
>
  + Add Internship
</button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Company Statistics</h2>
          <div className="flex flex-wrap gap-4">
            <div className="min-w-[140px] flex-1 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
              <p className="text-3xl font-bold text-emerald-600">{totalInternshipsOffered}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">Internships Offered</p>
            </div>
            <div className="min-w-[140px] flex-1 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
              <p className="text-3xl font-bold text-emerald-600">{totalAccepted}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">Students Accepted</p>
            </div>
            <div className="min-w-[140px] flex-1 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
              <p className="text-3xl font-bold text-amber-500">{completedInternshipsCount}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">Completed by Students</p>
            </div>
          </div>
        </div>

<div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
  <div className="mb-6 flex items-center justify-between">
    <h2 className="text-xl font-semibold text-slate-900">
      Manage Internships
    </h2>

    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
      {employerInternships.length} Internship
      {employerInternships.length !== 1 ? 's' : ''}
    </span>
  </div>

  {employerInternships.length === 0 ? (
    <p className="text-sm italic text-slate-400">
      No internships added yet.
    </p>
  ) : (
    <>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          View and manage all internships offered by your company.
        </p>

        <div className="flex gap-2">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Active
          </span>

          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
            Archived
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {employerInternships.map((internship) => (
          <div
            key={internship.id}
            className="rounded-2xl border border-slate-100 bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {internship.title}
                </h3>

                <div className="mt-2 flex flex-wrap gap-2">
  {(() => {
    const expired = internship.deadline && new Date() > new Date(internship.deadline) && internship.status === 'Currently Hiring';
    const label = expired ? 'Internship Expired' : internship.status;
    return (
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${expired ? 'bg-slate-200 text-slate-600' : internship.status === 'Currently Hiring' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
        {label}
      </span>
    );
  })()}
  {internship.archived && (
    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
      Archived
    </span>
  )}
</div>

                <p className="mt-3 text-sm text-slate-500">
                  {internship.responsibilities}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    {internship.duration}
                  </span>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Deadline: {internship.deadline}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  Skills: {internship.skills}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Languages: {internship.languages}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedInternshipForApplicants(
                    selectedInternshipForApplicants?.id === internship.id ? null : internship
                  )}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${selectedInternshipForApplicants?.id === internship.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  View Applicants
                </button>
                <button
                  onClick={() => {
                    const updated = employerInternships.map((i) =>
                      i.id === internship.id
                        ? {
                            ...i,
                            status:
                              i.status === 'Currently Hiring'
                                ? 'Position Filled'
                                : 'Currently Hiring',
                          }
                        : i
                    );

                    setEmployerInternships(updated);

                    localStorage.setItem(
                      'employerInternships',
                      JSON.stringify(updated)
                    );
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    internship.status === 'Currently Hiring'
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {internship.status === 'Currently Hiring'
                    ? 'Set Filled'
                    : 'Set Hiring'}
                </button>

                <button
                  onClick={() => {
                    const today = new Date();
                    const deadline = new Date(internship.deadline);

                    if (!internship.archived && deadline > today) {
                      alert(
                        'Internship can only be archived after the application deadline passes.'
                      );
                      return;
                    }

                    const updated = employerInternships.map((i) =>
                      i.id === internship.id
                        ? {
                            ...i,
                            archived: !i.archived,
                          }
                        : i
                    );

                    setEmployerInternships(updated);

                    localStorage.setItem(
                      'employerInternships',
                      JSON.stringify(updated)
                    );
                  }}
                  className="rounded-full bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-300"
                >
                  {internship.archived
                    ? 'Unarchive'
                    : 'Archive'}
                </button>

                <button
                  onClick={() => {
                    setEditingInternship(internship);

                    setInternshipForm({
                      title: internship.title,
                      responsibilities:
                        internship.responsibilities,
                      skills: internship.skills,
                      duration: internship.duration,
                      deadline: internship.deadline,
                      languages: internship.languages,
                    });

                    setShowInternshipModal(true);
                  }}
                  className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-200"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteInternship(internship.id)
                  }
                  className="rounded-full bg-red-100 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedInternshipForApplicants && (() => {
        const applicants = getApplicantsForInternship(selectedInternshipForApplicants.id);
        const sorted = applicantSortByContributors
          ? [...applicants].sort((a, b) => b.projectCount - a.projectCount)
          : applicants;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setSelectedInternshipForApplicants(null)}>
            <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl" style={{maxHeight: '80vh'}} onClick={(e) => e.stopPropagation()}>
              <div className="flex shrink-0 items-center justify-between bg-emerald-600 px-6 py-4 text-white">
                <div>
                  <h3 className="font-semibold">Applicants</h3>
                  <p className="mt-0.5 text-xs text-emerald-100">{selectedInternshipForApplicants.title} · {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setApplicantSortByContributors(prev => !prev)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition ${applicantSortByContributors ? 'bg-amber-400 text-amber-900 shadow-md shadow-amber-600/30' : 'bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/25'}`}
                  >
                    <svg viewBox="0 0 24 24" fill={applicantSortByContributors ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 shrink-0">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                    </svg>
                    Top Contributors
                  </button>
                  <button onClick={() => setSelectedInternshipForApplicants(null)} className="text-white/70 transition hover:text-white">✕</button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {sorted.length === 0 ? (
                  <p className="py-8 text-center text-sm italic text-slate-400">No applicants yet.</p>
                ) : (
                  <div className="space-y-3">
                    {sorted.map((applicant, idx) => {
                      const statusKey = `${selectedInternshipForApplicants.id}_${applicant.email}`;
                      const currentStatus = applicantStatuses[statusKey] || 'pending';
                      return (
                        <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                                  {applicant.firstName?.[0]}{applicant.lastName?.[0]}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900">{applicant.firstName} {applicant.lastName}</p>
                                  <p className="text-xs text-slate-400">{applicant.email}</p>
                                </div>
                              </div>
                              {applicant.coverLetter && (
                                <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2">
                                  <p className="mb-1 text-xs font-semibold text-slate-400">Cover Letter</p>
                                  <p className="text-sm text-slate-600">{applicant.coverLetter}</p>
                                </div>
                              )}
                              <p className="mt-2 text-xs text-slate-400">{applicant.projectCount} project{applicant.projectCount !== 1 ? 's' : ''} contributed</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              {['nominated', 'accepted', 'rejected'].map(s => (
                                <button
                                  key={s}
                                  onClick={() => updateApplicantStatus(selectedInternshipForApplicants.id, applicant.email, currentStatus === s ? 'pending' : s)}
                                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
                                    currentStatus === s
                                      ? s === 'accepted' ? 'bg-emerald-600 text-white'
                                        : s === 'nominated' ? 'bg-amber-500 text-white'
                                        : 'bg-red-500 text-white'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </>
  )}
</div>

{suggestedApplicants.length > 0 && (
  <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">From Your Saved Portfolios</span>
        <h2 className="mt-0.5 text-xl font-semibold text-slate-900">Suggested Applicants</h2>
      </div>
      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Favorited & Applied</span>
    </div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {suggestedApplicants.map((s, idx) => (
        <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
              {s.firstName?.[0]}{s.lastName?.[0]}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{s.firstName} {s.lastName}</p>
              <p className="truncate text-xs text-slate-400">{s.email}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">{s.projectCount} project{s.projectCount !== 1 ? 's' : ''}</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">Applied</span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}




        {/* RECOMMENDED PROJECTS */}
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
          <h2 className="mb-6 text-xl font-semibold text-slate-900">Recommended Student Projects</h2>
          {recommendedProjects.length === 0 ? (
            <p className="text-sm italic text-slate-400">No public projects yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {recommendedProjects.map((project) => (
                <div key={project.id} onClick={() => navigate(`/project/${project.id}`)} className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{project.title}</p>
                      {project.course && <p className="mt-1 text-sm text-emerald-600">{project.course}</p>}
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} viewBox="0 0 24 24" className={`h-4 w-4 ${s <= (project.rating||0) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">{project.description}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={e => { e.stopPropagation(); navigate(`/project/${project.id}`); }} className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-emerald-500">View Project</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-[#f7f4ee] text-slate-900 antialiased">
      {/* Background blobs — same as Landing */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-amber-200/70 blur-3xl" />
        <div className="absolute right-[-6%] top-20 h-[360px] w-[360px] rounded-full bg-emerald-200/60 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_55%),radial-gradient(circle_at_20%_70%,rgba(251,191,36,0.18),transparent_55%)]" />
      </div>

      {/* MESSAGES FAB */}
      {(() => {
        const unreadMsgs = (() => { try { return JSON.parse(localStorage.getItem('privateMessages') || '[]').filter(m => m.toEmail === user.email && !m.read).length; } catch { return 0; } })();
        return (
          <button
            onClick={() => navigate('/messages')}
            className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 transition hover:-translate-y-0.5 hover:bg-emerald-500"
            title="Messages"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            {unreadMsgs > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadMsgs > 9 ? '9+' : unreadMsgs}
              </span>
            )}
          </button>
        );
      })()}

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* HEADER */}
        <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-600">
              <span className="h-px w-8 bg-emerald-500" />
              Welcome back
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Hello, <span className="text-emerald-600">{user.firstName || user.companyName}</span>
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {allProjects.length} Projects
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                {unreadCount} Unread
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                {favorites.length} Saved
              </span>
            </div>
            <p className="mt-2 text-sm capitalize text-slate-500">Logged in as: {user.role}</p>
          </div>

          <div className="relative flex items-center gap-3">
            {/* CREATE PROJECT — students only */}
            {user.role === 'student' && (
              <button
                onClick={() => navigate('/create')}
                className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-500"
              >
                + Create Project
              </button>
            )}

            {/* PROFILE */}
            <button
              onClick={() => navigate('/profile')}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-lg shadow-sm transition hover:bg-white"
            >
              👤
            </button>

            {/* NOTIFICATIONS + NOTIFICATION PREFERENCES (inside dropdown) */}
            <div className="relative" onMouseEnter={() => setShowNotifications(true)} onMouseLeave={() => { setShowNotifications(false); setShowSettings(false); }}>
            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 shadow-sm transition hover:bg-white"
            >
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
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {myNotifications.length === 0 ? (
                    <p className="p-5 text-center text-sm italic text-slate-400">No notifications yet.</p>
                  ) : myNotifications.map((n) => (
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
                {/* Notification Preferences — tucked at bottom */}
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
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between px-4 py-2.5">
                          <span className="text-xs font-medium text-slate-600">{item.label}</span>
                          <button
                            onClick={() => toggleSetting(item.key)}
                            className={`relative h-5 w-10 rounded-full transition-colors ${settings[item.key] ? 'bg-emerald-500' : 'bg-slate-200'}`}
                          >
                            <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${settings[item.key] ? 'left-5' : 'left-0.5'}`} />
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

            {/* SIGN OUT */}
            <button
              onClick={() => { localStorage.removeItem('user'); navigate('/login'); }}
              className="rounded-full border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* DISCOVER SECTION */}
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white/80 shadow-lg backdrop-blur">
          {/* Header row */}
          <div className="flex flex-col gap-3 px-6 pt-6 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Explore</span>
              <h2 className="mt-0.5 text-lg font-semibold text-slate-900">Discover</h2>
            </div>
            <div className="flex items-center gap-2">
              {/* Projects: Filter + Sort */}
              {discoverTab === 'projects' && (
                <>
                  <div
                    ref={projectFilterBtnRef}
                    onMouseEnter={() => {
                      clearTimeout(filterHideTimeout.current);
                      setShowInternshipFilter(false); setShowInternshipSort(false); setShowProjectSort(false); setShowStudentFilter(false);
                      const rect = projectFilterBtnRef.current?.getBoundingClientRect();
                      if (rect) setFilterBtnPos({ top: rect.bottom + 8, left: rect.left, width: rect.width });
                      setShowProjectFilter(true);
                    }}
                    onMouseLeave={() => {
                      filterHideTimeout.current = setTimeout(() => setShowProjectFilter(false), 150);
                    }}
                  >
                    <button
                      className={`flex items-center gap-1.5 rounded-2xl border px-3 py-2.5 text-xs font-semibold transition ${(projectDateSearch !== '' || projectRatingFilter > 0 || projectCourseFilter !== '' || projectInstructorFilter !== '') ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : showProjectFilter ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                      </svg>
                      Filter
                      {(projectDateSearch !== '' || projectRatingFilter > 0 || projectCourseFilter !== '' || projectInstructorFilter !== '') && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  </div>
                  {/* Sort dropdown */}
                  <div
                    ref={projectSortBtnRef}
                    className="relative"
                    onMouseEnter={() => {
                      clearTimeout(projectSortTimeout.current);
                      setShowInternshipFilter(false); setShowInternshipSort(false); setShowProjectFilter(false); setShowStudentFilter(false);
                      const rect = projectSortBtnRef.current?.getBoundingClientRect();
                      if (rect) setProjectSortPos({ top: rect.bottom + 8, left: rect.left });
                      setShowProjectSort(true);
                    }}
                    onMouseLeave={() => { projectSortTimeout.current = setTimeout(() => setShowProjectSort(false), 150); }}
                  >
                    <button
                      className={`flex items-center gap-1.5 rounded-2xl border px-3 py-2.5 text-xs font-semibold transition ${projectSortBy ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : showProjectSort ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                      </svg>
                      Sort
                    </button>
                  </div>
                </>
              )}

              {/* Students: Filter + Sort */}
              {discoverTab === 'students' && (
                <>
                  <div
                    ref={studentFilterBtnRef}
                    className="relative"
                    onMouseEnter={() => {
                      clearTimeout(studentFilterTimeout.current);
                      setShowInternshipFilter(false); setShowInternshipSort(false); setShowProjectFilter(false); setShowProjectSort(false);
                      const rect = studentFilterBtnRef.current?.getBoundingClientRect();
                      if (rect) setStudentFilterPos({ top: rect.bottom + 8, left: rect.left });
                      setShowStudentFilter(true);
                    }}
                    onMouseLeave={() => { studentFilterTimeout.current = setTimeout(() => setShowStudentFilter(false), 150); }}
                  >
                    <button
                      className={`flex items-center gap-1.5 rounded-2xl border px-3 py-2.5 text-xs font-semibold transition ${(studentMajorFilter || studentSkillsFilter) ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : showStudentFilter ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                      </svg>
                      Filter
                      {(studentMajorFilter || studentSkillsFilter) && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                    </button>
                  </div>
                  <button
                    onClick={() => setStudentSortByProjects(prev => prev === '' ? 'desc' : prev === 'desc' ? 'asc' : '')}
                    className={`flex items-center gap-1.5 rounded-2xl border px-3 py-2.5 text-xs font-semibold transition ${studentSortByProjects ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                    {studentSortByProjects === 'desc' ? 'Projects ↓' : studentSortByProjects === 'asc' ? 'Projects ↑' : 'Sort by Projects'}
                  </button>
                </>
              )}

              <input
                type="text"
                value={discoverTab === 'projects' ? projectSearch : discoverTab === 'instructors' ? instructorSearch : studentSearch}
                onChange={(e) => {
                  if (discoverTab === 'projects') setProjectSearch(e.target.value);
                  else if (discoverTab === 'instructors') setInstructorSearch(e.target.value);
                  else setStudentSearch(e.target.value);
                }}
                placeholder={`Search ${discoverTab}...`}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30 sm:w-64"
              />
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-2 px-6 pb-4">
            {['projects', 'instructors', 'students'].map((tab) => (
              <button
                key={tab}
                onClick={() => setDiscoverTab(tab)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${discoverTab === tab ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="border-t border-slate-100 px-6 py-5">
            {/* PROJECTS TAB */}
            {discoverTab === 'projects' && (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.slice(0, 6).map((p) => (
                    <div key={p.id} onClick={() => navigate(`/project/${p.id}`)} className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-4 text-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
                      <p className="truncate font-semibold text-slate-900">{p.title}</p>
                      <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">{p.course}</span>
                      <div className="mt-2 flex items-center gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <svg key={s} viewBox="0 0 24 24" className={`h-3 w-3 ${s <= (p.rating||0) ? 'fill-amber-400' : 'fill-slate-200'}`}>
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-slate-400">{p.createdAt}</p>
                      <div className="mt-3 flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/project/${p.id}`); }} className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-500">View</button>
                        <button
                          onClick={(e) => { e.stopPropagation(); const alreadyFav = favorites.some(f => f.id === p.id); const updated = alreadyFav ? favorites.filter(f => f.id !== p.id) : [...favorites, p]; setFavorites(updated); localStorage.setItem(`favorites_${user.email}`, JSON.stringify(updated)); }}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${favorites.some(f => f.id === p.id) ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}
                        >
                          {favorites.some(f => f.id === p.id) ? '★ Saved' : '☆ Save'}
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredProjects.length === 0 && <p className="text-sm italic text-slate-400">No projects found.</p>}
                </div>
              </>
            )}

            {/* INSTRUCTORS TAB */}
            {discoverTab === 'instructors' && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredInstructors.slice(0, 6).map((i) => (
                  <div key={i.userId} onClick={() => navigate(`/instructor/${encodeURIComponent(i.email)}`)} className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-4 text-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                        {i.firstName[0]}{i.lastName[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">{i.firstName} {i.lastName}</p>
                        <p className="truncate text-xs text-slate-400">{i.email}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{i.subject}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${i.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{i.status}</span>
                    </div>
                  </div>
                ))}
                {filteredInstructors.length === 0 && <p className="text-sm italic text-slate-400">No instructors found.</p>}
              </div>
            )}

            {/* STUDENTS TAB */}
            {discoverTab === 'students' && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredStudents.slice(0, 6).map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate(`/profile?email=${encodeURIComponent(s.email)}`)}
                    className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-4 text-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
                          {s.firstName[0]}{s.lastName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">{s.firstName} {s.lastName}</p>
                          <p className="truncate text-xs text-slate-400">{s.email}</p>
                          {s.major && <p className="truncate text-xs font-medium text-emerald-600">{s.major}</p>}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); togglePortfolioFavorite(s); }}
                        className="shrink-0 text-lg"
                      >
                        {favorites.some(f => f.email === s.email) ? '⭐' : '☆'}
                      </button>
                    </div>
                    {s.skills && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {s.skills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">{skill}</span>
                        ))}
                        {s.skills.length > 3 && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">+{s.skills.length - 3}</span>}
                      </div>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{s.projectCount} project{s.projectCount !== 1 ? 's' : ''}</span>
                      <span className="text-xs font-medium text-emerald-600">View Profile →</span>
                    </div>
                  </div>
                ))}
                {filteredStudents.length === 0 && <p className="text-sm italic text-slate-400">No students found.</p>}
              </div>
            )}
          </div>
        </div>

        {/* RECOMMENDED PROJECTS — visible to all non-admin roles */}
        {user.role !== 'admin' && (() => {
          const recommended = allProjects
            .filter(p => p.isPublic !== false && !p.flagged)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 3);
          if (recommended.length === 0) return null;
          return (
            <div className="mb-10 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Recommended Projects</h2>
                  <p className="mt-0.5 text-xs text-slate-400">Highest-rated public projects on the platform</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">⭐ Top Rated</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {recommended.map(p => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/project/${p.id}`)}
                    className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-4 text-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                  >
                    <p className="truncate font-semibold text-slate-900">{p.title}</p>
                    <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">{p.course}</span>
                    <div className="mt-2 flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} viewBox="0 0 24 24" className={`h-3 w-3 ${s <= (p.rating||0) ? 'fill-amber-400' : 'fill-slate-200'}`}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-xs text-slate-400">{p.rating || 0}/5</span>
                    </div>
                    {p.description && <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-400">{p.description}</p>}
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/project/${p.id}`); }}
                      className="mt-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-500"
                    >
                      View Project
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ROLE DASHBOARD */}
        <main>
          {user.role === 'student' && StudentDashboard()}
          {user.role === 'instructor' && InstructorDashboard()}
          {user.role === 'employer' && EmployerDashboard()}
        </main>

        {showInternshipModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingInternship ? 'Edit Internship' : 'Add Internship'}
                </h2>
                <button
                  onClick={() => setShowInternshipModal(false)}
                  className="text-2xl text-slate-400 transition hover:text-slate-600"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Internship Title"
                  value={internshipForm.title}
                  onChange={(e) => setInternshipForm({ ...internshipForm, title: e.target.value })}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
                <textarea
                  placeholder="Responsibilities"
                  value={internshipForm.responsibilities}
                  onChange={(e) => setInternshipForm({ ...internshipForm, responsibilities: e.target.value })}
                  rows={4}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
                <input
                  type="text"
                  placeholder="Required Skills"
                  value={internshipForm.skills}
                  onChange={(e) => setInternshipForm({ ...internshipForm, skills: e.target.value })}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={internshipForm.duration}
                  onChange={(e) => setInternshipForm({ ...internshipForm, duration: e.target.value })}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">Application Deadline</label>
                  <input
                    type="date"
                    value={internshipForm.deadline}
                    onChange={(e) => setInternshipForm({ ...internshipForm, deadline: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                  />
                  <p className="mt-1 text-xs text-slate-400">Students cannot apply after this date. Archiving is only allowed once the deadline has passed.</p>
                </div>
                <input
                  type="text"
                  placeholder="Programming Languages"
                  value={internshipForm.languages}
                  onChange={(e) => setInternshipForm({ ...internshipForm, languages: e.target.value })}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setShowInternshipModal(false)}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={saveInternship}
                  className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PROJECT FILTER — fixed so it escapes backdrop-blur stacking context */}
        {showProjectFilter && (
          <div
            style={{ position: 'fixed', top: filterBtnPos.top, left: filterBtnPos.left, zIndex: 9999, width: '18rem', maxHeight: 'min(75vh, 500px)' }}
            className="flex flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl"
            onMouseEnter={() => { clearTimeout(filterHideTimeout.current); setShowProjectFilter(true); }}
            onMouseLeave={() => { filterHideTimeout.current = setTimeout(() => setShowProjectFilter(false), 150); }}
          >
            <div className="flex shrink-0 items-center justify-between rounded-t-3xl bg-emerald-600 px-5 py-3 text-white">
              <h3 className="text-sm font-semibold">Filter Projects</h3>
              <button onClick={() => setShowProjectFilter(false)} className="text-white/70 transition hover:text-white">✕</button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto rounded-b-3xl p-5">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">Course</label>
                <input
                  type="text"
                  value={projectCourseFilter}
                  onChange={(e) => setProjectCourseFilter(e.target.value)}
                  placeholder="e.g. Machine Learning"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">Course Instructor</label>
                <input
                  type="text"
                  value={projectInstructorFilter}
                  onChange={(e) => setProjectInstructorFilter(e.target.value)}
                  placeholder="e.g. Dr. Ali"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">Created On or After</label>
                <input
                  type="date"
                  value={projectDateSearch}
                  onChange={(e) => setProjectDateSearch(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">Min Rating</label>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setProjectRatingFilter(projectRatingFilter === star ? 0 : star)}
                      className="transition hover:scale-110"
                    >
                      <svg viewBox="0 0 24 24" className={`h-7 w-7 transition ${star <= (hoveredRating || projectRatingFilter) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-300'}`}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              {(projectDateSearch !== '' || projectRatingFilter > 0 || projectCourseFilter !== '' || projectInstructorFilter !== '') && (
                <button
                  onClick={() => { setProjectDateSearch(''); setProjectRatingFilter(0); setProjectCourseFilter(''); setProjectInstructorFilter(''); }}
                  className="w-full rounded-full border border-red-200 bg-red-50 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-100"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* INTERNSHIP FILTER — fixed, escapes stacking context */}
        {showInternshipFilter && (
          <div
            style={{ position: 'fixed', top: internshipFilterPos.top, left: internshipFilterPos.left, zIndex: 9999, width: '16rem' }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
            onMouseEnter={() => clearTimeout(internshipFilterTimeout.current)}
            onMouseLeave={() => { internshipFilterTimeout.current = setTimeout(() => setShowInternshipFilter(false), 150); }}
          >
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">Company</p>
            <input
              type="text"
              value={internshipCompanyFilter}
              onChange={(e) => setInternshipCompanyFilter(e.target.value)}
              placeholder="e.g. Google"
              className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            />
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">Duration</p>
            <div className="flex flex-col gap-1">
              {['', '2 Months', '3 Months', '4 Months', '5 Months', '6 Months'].map((d) => (
                <button
                  key={d}
                  onClick={() => setInternshipDurationFilter(d)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-slate-50 ${internshipDurationFilter === d ? 'font-semibold text-emerald-600' : 'text-slate-600'}`}
                >
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${internshipDurationFilter === d ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  {d || 'All Durations'}
                </button>
              ))}
            </div>
            {(internshipCompanyFilter || internshipDurationFilter) && (
              <button
                onClick={() => { setInternshipCompanyFilter(''); setInternshipDurationFilter(''); }}
                className="mt-3 w-full rounded-xl border border-red-100 bg-red-50 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-100"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* INTERNSHIP SORT — fixed */}
        {showInternshipSort && (
          <div
            style={{ position: 'fixed', top: internshipSortPos.top, left: internshipSortPos.left, zIndex: 9999, width: '12rem' }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
            onMouseEnter={() => clearTimeout(internshipSortTimeout.current)}
            onMouseLeave={() => { internshipSortTimeout.current = setTimeout(() => setShowInternshipSort(false), 150); }}
          >
            {[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setInternshipSort(opt.value); setShowInternshipSort(false); }}
                className={`flex w-full items-center gap-2 px-4 py-3 text-sm transition hover:bg-slate-50 ${internshipSort === opt.value ? 'font-semibold text-emerald-600' : 'text-slate-600'}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${internshipSort === opt.value ? 'bg-emerald-500' : 'bg-transparent'}`} />
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* PROJECT SORT — fixed */}
        {showProjectSort && (
          <div
            style={{ position: 'fixed', top: projectSortPos.top, left: projectSortPos.left, zIndex: 9999, width: '12rem' }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
            onMouseEnter={() => clearTimeout(projectSortTimeout.current)}
            onMouseLeave={() => { projectSortTimeout.current = setTimeout(() => setShowProjectSort(false), 150); }}
          >
            {[
              { value: '', label: 'Default' },
              { value: 'date_desc', label: 'Newest First' },
              { value: 'date_asc', label: 'Oldest First' },
              { value: 'rating_desc', label: 'Highest Rated' },
              { value: 'rating_asc', label: 'Lowest Rated' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setProjectSortBy(opt.value); setShowProjectSort(false); }}
                className={`flex w-full items-center gap-2 px-4 py-3 text-xs transition hover:bg-slate-50 ${projectSortBy === opt.value ? 'font-semibold text-emerald-600' : 'text-slate-600'}`}
              >
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${projectSortBy === opt.value ? 'bg-emerald-500' : 'bg-transparent'}`} />
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* STUDENT FILTER — fixed */}
        {showStudentFilter && (
          <div
            style={{ position: 'fixed', top: studentFilterPos.top, left: studentFilterPos.left, zIndex: 9999, width: '16rem' }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
            onMouseEnter={() => clearTimeout(studentFilterTimeout.current)}
            onMouseLeave={() => { studentFilterTimeout.current = setTimeout(() => setShowStudentFilter(false), 150); }}
          >
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">Major</p>
            <input
              type="text"
              value={studentMajorFilter}
              onChange={(e) => setStudentMajorFilter(e.target.value)}
              placeholder="e.g. Computer Science"
              className="mb-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-300 focus:outline-none"
            />
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">Skill</p>
            <input
              type="text"
              value={studentSkillsFilter}
              onChange={(e) => setStudentSkillsFilter(e.target.value)}
              placeholder="e.g. React"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-300 focus:outline-none"
            />
            {(studentMajorFilter || studentSkillsFilter) && (
              <button
                onClick={() => { setStudentMajorFilter(''); setStudentSkillsFilter(''); }}
                className="mt-3 w-full rounded-xl border border-red-100 bg-red-50 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-100"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;
