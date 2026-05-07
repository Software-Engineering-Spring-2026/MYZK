import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
const [projectRatingFilter, setProjectRatingFilter] =
  useState(0);
const [hoveredRating, setHoveredRating] =
  useState(0);
  const [chatInput, setChatInput] = useState('');

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'System',
      message: 'Welcome to ProjectFolio Chat!',
    },
    {
      id: 2,
      sender: 'Ali Mahmoud',
      message: 'Don’t forget tomorrow’s project review.',
    },
    {
      id: 3,
      sender: 'Sara Ahmed',
      message: 'Can you review the database schema?',
    },
  ]);

  const [settings, setSettings] = useState({
    allNotifications: true,
    cookies: true,
    emailNotifications: true,
    pushNotifications: false,
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: 'Instructor Ali commented on your B+ Tree project',
      read: false,
    },
    {
      id: 2,
      text: 'New internship posted: Backend Intern at Telda',
      read: false,
    },
    {
      id: 3,
      text: 'Your portfolio was viewed by 5 employers today',
      read: true,
    },
    {
      id: 4,
      text: 'You got a new private message',
      read: false,
    },
    {
      id: 5,
      text: 'Your teammate uploaded a new thesis draft',
      read: false,
    },
    {
      id: 6,
      text: 'Employer viewed your student portfolio',
      read: true,
    },
  ]);

  // ---------------- AUTH ----------------
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  // ---------------- SEARCH STATES ----------------
  const [instructorSearch, setInstructorSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [projectDateSearch, setProjectDateSearch] =
    useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [internshipSort, setInternshipSort] =
  useState('newest');

  // ---------------- LOCAL STORAGE USERS ----------------
  const users =
    JSON.parse(localStorage.getItem('users')) || [];

  // ---------------- MOCK INSTRUCTORS ----------------
const mockInstructors = [
  {
    userId: 'u4',
    email: 'dr.ali@guc.com',
    firstName: 'Ali',
    lastName: 'Mahmoud',
    subject: 'Data Structures',
    status: 'accepted',
  },
  {
    userId: 'u5',
    email: 'dr.salma@guc.com',
    firstName: 'Salma',
    lastName: 'Hassan',
    subject: 'Operating Systems',
    status: 'accepted',
  },
  {
    userId: 'u6',
    email: 'dr.khaled@guc.com',
    firstName: 'Khaled',
    lastName: 'Mostafa',
    subject: 'Machine Learning',
    status: 'accepted',
  },
  {
    userId: 'u7',
    email: 'dr.nour@guc.com',
    firstName: 'Nour',
    lastName: 'Adel',
    subject: 'Database Systems',
    status: 'pending',
  },
  {
    userId: 'u8',
    email: 'dr.youssef@guc.com',
    firstName: 'Youssef',
    lastName: 'Tarek',
    subject: 'Computer Networks',
    status: 'accepted',
  },
  {
    userId: 'u9',
    email: 'dr.mona@guc.com',
    firstName: 'Mona',
    lastName: 'Fathy',
    subject: 'Artificial Intelligence',
    status: 'accepted',
  },
];

// ---------------- INTERNSHIP SEARCH STATE ----------------
const [internshipSearch, setInternshipSearch] =
  useState('');

// ---------------- MOCK INTERNSHIPS ----------------
const mockInternships = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    company: 'Google',
    location: 'Cairo',
    postedDate: '2026-05-01',
  },
  {
    id: 2,
    title: 'Backend Engineer Intern',
    company: 'Microsoft',
    location: 'Smart Village',
    postedDate: '2026-05-12',
  },
  {
    id: 3,
    title: 'Software Engineering Intern',
    company: 'Amazon',
    location: 'Remote',
    postedDate: '2026-04-22',
  },
  {
    id: 4,
    title: 'AI/ML Intern',
    company: 'OpenAI',
    location: 'Remote',
    postedDate: '2026-05-18',
  },
  {
    id: 5,
    title: 'Full Stack Intern',
    company: 'Vodafone',
    location: 'New Cairo',
    postedDate: '2026-03-30',
  },
  {
    id: 6,
    title: 'Mobile Developer Intern',
    company: 'Instabug',
    location: 'Cairo',
    postedDate: '2026-04-10',
  },
  {
    id: 7,
    title: 'Cyber Security Intern',
    company: 'Orange',
    location: '6th October',
    postedDate: '2026-05-20',
  },
  {
    id: 8,
    title: 'Cloud Engineer Intern',
    company: 'IBM',
    location: 'Smart Village',
    postedDate: '2026-02-15',
  },
];
// ---------------- FILTERED INTERNSHIPS ----------------
const [internshipDateFilter, setInternshipDateFilter] =
  useState('');

// ---------------- FILTERED INTERNSHIPS ----------------
const filteredInternships = [...mockInternships]
  .filter((internship) =>
    `${internship.title} ${internship.company} ${internship.location}`
      .toLowerCase()
      .includes(internshipSearch.toLowerCase())
  )
  .sort((a, b) => {
    if (internshipSort === 'newest') {
      return (
        new Date(b.postedDate) -
        new Date(a.postedDate)
      );
    }

    return (
      new Date(a.postedDate) -
      new Date(b.postedDate)
    );
  });


  // ---------------- MOCK PROJECTS ----------------
  const mockProjects = [
  {
    id: 'p1',
    title: 'Smart Campus Navigation System',
    description:
      'AR-based navigation system for GUC students.',
    course: 'Bachelor Project',
    createdAt: '2026-04-10',
    rating: 5,
  },
  {
    id: 'p2',
    title: 'AI Resume Analyzer',
    description:
      'Machine learning system for evaluating CVs.',
    course: 'Software Engineering',
    createdAt: '2026-03-22',
    rating: 4,
  },
  {
    id: 'p3',
    title: 'Hospital Queue Management',
    description:
      'Distributed system for patient scheduling.',
    course: 'Operating Systems',
    createdAt: '2026-05-01',
    rating: 3,
  },
  {
    id: 'p4',
    title: 'E-Commerce Recommendation Engine',
    description:
      'Recommendation system using collaborative filtering.',
    course: 'Machine Learning',
    createdAt: '2026-02-18',
    rating: 5,
  },
  {
    id: 'p5',
    title: 'Autonomous Delivery Robot',
    description:
      'Embedded systems project for indoor delivery robots.',
    course: 'Embedded Systems',
    createdAt: '2026-01-30',
    rating: 2,
  },
];

  // ---------------- MOCK STUDENTS ----------------
  // ---------------- MOCK STUDENTS ----------------
const mockStudents = [
  {
    firstName: 'Ahmed',
    lastName: 'Karam',
    email: 'ahmed@student.guc.edu.eg',
    role: 'student',
    skills: ['React', 'Node.js', 'MongoDB'],
  },
  {
    firstName: 'Sara',
    lastName: 'Mohamed',
    email: 'sara@student.guc.edu.eg',
    role: 'student',
    skills: ['UI/UX', 'Figma', 'Frontend'],
  },
  {
    firstName: 'Omar',
    lastName: 'Khaled',
    email: 'omar@student.guc.edu.eg',
    role: 'student',
    skills: ['Java', 'Spring Boot', 'SQL'],
  },
  {
    firstName: 'Mariam',
    lastName: 'Tarek',
    email: 'mariam@student.guc.edu.eg',
    role: 'student',
    skills: ['Python', 'Machine Learning', 'TensorFlow'],
  },
  {
    firstName: 'Yassin',
    lastName: 'Hesham',
    email: 'yassin@student.guc.edu.eg',
    role: 'student',
    skills: ['Cyber Security', 'Networking', 'Linux'],
  },
  {
    firstName: 'Lina',
    lastName: 'Adel',
    email: 'lina@student.guc.edu.eg',
    role: 'student',
    skills: ['Flutter', 'Firebase', 'Mobile Development'],
  },
];

  // ---------------- COMBINED STUDENTS ----------------
  const allStudents = [
    ...mockStudents,
    ...users.filter((u) => u.role === 'student'),
  ];

  // ---------------- FILTERING ----------------
  const filteredInstructors = mockInstructors.filter(
  (instructor) =>
    `${instructor.firstName} 
     ${instructor.lastName} 
     ${instructor.email} 
     ${instructor.subject}`
      .toLowerCase()
      .includes(instructorSearch.toLowerCase())
);

 const filteredProjects = mockProjects.filter(
  (project) => {
    const matchesSearch =
      `${project.title} ${project.description} ${project.course}`
        .toLowerCase()
        .includes(projectSearch.toLowerCase());

    const matchesDate =
      projectDateSearch === '' ||
      project.createdAt.includes(projectDateSearch);

    const matchesRating =
      projectRatingFilter === 0 ||
      project.rating >= projectRatingFilter;

    return (
      matchesSearch &&
      matchesDate &&
      matchesRating
    );
  }
);

  const filteredStudents = allStudents.filter(
  (student) =>
    `
      ${student.firstName}
      ${student.lastName}
      ${student.email}
      ${(student.skills || []).join(' ')}
    `
      .toLowerCase()
      .includes(studentSearch.toLowerCase())
);

  // ---------------- HELPERS ----------------
  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: !n.read } : n
      )
    );
  };

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length;

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: user.firstName,
      message: chatInput,
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setChatInput('');
  };

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ---------------- DASHBOARDS ----------------


const StudentDashboard = () => (
  <div className="space-y-8">
    {/* FIND INTERNSHIPS */}
    <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#064e3b]">
          Find Internships
        </h2>

        <span className="bg-[#ecfdf5] text-[#059669] px-4 py-1 rounded-full text-sm font-medium">
          New Opportunities
        </span>
      </div>

      {/* SEARCH + SORT */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* SEARCH */}
        <input
          type="text"
          value={internshipSearch}
          onChange={(e) =>
            setInternshipSearch(e.target.value)
          }
          placeholder="Search by title or company name..."
          className="flex-1 bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#10b981]"
        />

        {/* SORT BY DATE */}
        <select
          value={internshipSort}
          onChange={(e) =>
            setInternshipSort(e.target.value)
          }
          className="bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#10b981] text-gray-600 min-w-[220px]"
        >
          <option value="newest">
            Newest First
          </option>

          <option value="oldest">
            Oldest First
          </option>
        </select>

        {/* SEARCH BUTTON */}
        <button className="bg-[#059669] text-white font-bold py-3 px-10 rounded-xl shadow-md hover:bg-[#047857]">
          Search
        </button>
      </div>

      {/* INTERNSHIP RESULTS */}
<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
  {filteredInternships.length > 0 ? (
    filteredInternships.map((internship) => (
      <div
        key={internship.id}
        className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[#111827] font-bold text-lg">
              {internship.title}
            </p>

            <p className="text-[#059669] font-semibold mt-1">
              {internship.company}
            </p>

            <p className="text-gray-400 text-sm mt-2">
              {internship.location}
            </p>

            <p className="text-xs text-[#059669] mt-2 font-medium">
              Posted: {internship.postedDate}
            </p>
          </div>

          {/* SELECT BUTTON */}
          <button className="bg-[#059669] hover:bg-[#047857] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all">
            Select
          </button>
        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-400 text-sm">
      No internships found
    </p>
  )}
</div>
      
    </section>

    {/* LOWER CARDS */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* RECOMMENDED PROJECTS */}
      <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <h3 className="text-[#059669] font-bold mb-2 uppercase text-xs tracking-widest">
          Recommended Projects
        </h3>

        <p className="text-[#111827] text-lg font-semibold italic">
          University HR Management System
        </p>

        <div className="mt-4 bg-[#f9fafb] border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-2">
            Project Details
          </p>

          <p className="text-[#111827] font-medium">
            Full-stack HR platform for managing employee
            records, recruitment workflows, payroll systems,
            and analytics.
          </p>
        </div>
      </div>

      {/* ACTIVE APPLICATIONS */}
      <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <h3 className="text-gray-400 font-bold mb-2 uppercase text-xs tracking-widest">
          Active Applications
        </h3>

        <p className="text-[#111827] text-lg font-semibold">
          PulseCare Remote Clinic - Pending
        </p>

        <div className="mt-4 bg-[#f9fafb] border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-2">
            Application Status
          </p>

          <p className="text-[#111827] font-medium">
            Your internship application is currently under
            review by the company recruitment team.
          </p>
        </div>
      </div>
    </div>
  </div>
);



  const InstructorDashboard = () => {
  const recommendedProjects = [
    {
      id: 1,
      title: 'AI Resume Analyzer',
      field: 'Machine Learning',
      students: 3,
    },
    {
      id: 2,
      title: 'Smart Hospital System',
      field: 'Software Engineering',
      students: 5,
    },
    {
      id: 3,
      title: 'Campus Navigation App',
      field: 'Mobile Development',
      students: 2,
    },
    {
      id: 4,
      title: 'Cyber Security Threat Detector',
      field: 'Cyber Security',
      students: 4,
    },
  ];

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <h2 className="text-2xl font-bold text-[#064e3b] mb-6">
        Instructor Review Panel
      </h2>

      <button className="p-6 bg-[#f0fdf4] border border-[#d1fae5] rounded-2xl text-[#065f46] font-bold hover:bg-[#d1fae5] transition">
        Review Student Portfolios
      </button>

      {/* RECOMMENDED PROJECTS */}
      <div className="mt-10">
        <h3 className="text-lg font-bold text-[#111827] mb-4">
          Recommended Projects
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all"
            >
              <p className="text-[#111827] font-bold text-lg">
                {project.title}
              </p>

              <p className="text-[#059669] text-sm font-medium mt-1">
                {project.field}
              </p>

              <p className="text-gray-400 text-sm mt-3">
                Interested Students: {project.students}
              </p>

              <button className="mt-4 bg-[#059669] hover:bg-[#047857] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all">
                View Project
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
 const EmployerDashboard = () => {
  const recommendedProjects = [
    {
      id: 1,
      title: 'AI Resume Analyzer',
      field: 'Machine Learning',
      companyFit: 'Great for AI recruitment systems',
      rating: 5,
    },
    {
      id: 2,
      title: 'Smart Hospital System',
      field: 'Software Engineering',
      companyFit: 'Useful for healthcare platforms',
      rating: 4,
    },
    {
      id: 3,
      title: 'Campus Navigation App',
      field: 'Mobile Development',
      companyFit: 'Strong mobile UI/UX implementation',
      rating: 4,
    },
    {
      id: 4,
      title: 'Cyber Security Threat Detector',
      field: 'Cyber Security',
      companyFit: 'Relevant for enterprise security',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-8">
      {/* EMPLOYER HEADER */}
      <div className="bg-gradient-to-r from-[#059669] to-[#10b981] rounded-3xl p-8 flex justify-between items-center text-white">
        <div>
          <h3 className="font-bold text-2xl mb-2 text-white">
            Employer Hub
          </h3>

          <p className="opacity-90 italic text-white">
            Find the best student projects and talent.
          </p>
        </div>

        <button className="bg-white text-[#059669] font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-gray-50">
          Post Internship
        </button>
      </div>

      {/* RECOMMENDED PROJECTS */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold text-[#064e3b] mb-6">
          Recommended Student Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recommendedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#111827] font-bold text-lg">
                    {project.title}
                  </p>

                  <p className="text-[#059669] text-sm font-medium mt-1">
                    {project.field}
                  </p>
                </div>

                <p className="text-yellow-500 text-sm">
                  {'⭐'.repeat(project.rating)}
                </p>
              </div>

              <p className="text-gray-500 text-sm mt-4">
                {project.companyFit}
              </p>

              <div className="mt-5 flex gap-3">
                <button className="bg-[#059669] hover:bg-[#047857] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all">
                  View Project
                </button>

                <button className="border border-[#059669] text-[#059669] hover:bg-[#ecfdf5] text-sm font-semibold px-4 py-2 rounded-xl transition-all">
                  Contact Student
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
  return (
    <div className="min-h-screen bg-[#fcfaf7] font-sans text-gray-900 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-[#d1fae5] blur-[120px] rounded-full opacity-60"></div>

        <div className="absolute bottom-[5%] left-[-5%] w-[40%] h-[40%] bg-[#fef3c7] blur-[100px] rounded-full opacity-40"></div>
      </div>

      {/* CHAT BUTTON */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-8 right-8 z-50 bg-[#059669] hover:bg-[#047857] text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all"
      >
        💬
      </button>

      {/* CHAT MODAL */}
      {showChat && (
        <div className="fixed bottom-28 right-8 w-[90%] md:w-[380px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden">
          <div className="bg-[#059669] text-white px-5 py-4 flex items-center justify-between">
            <h3 className="font-bold text-lg">
              ProjectFolio Chat
            </h3>

            <button
              onClick={() => setShowChat(false)}
              className="text-xl"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f9fafb]">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.sender === user.firstName
                    ? 'ml-auto bg-[#059669] text-white'
                    : 'bg-white border border-gray-100'
                }`}
              >
                <p className="text-xs font-bold mb-1">
                  {msg.sender}
                </p>

                <p className="text-sm">{msg.message}</p>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) =>
                setChatInput(e.target.value)
              }
              placeholder="Type a message..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#10b981]"
            />

            <button
              onClick={sendMessage}
              className="bg-[#059669] hover:bg-[#047857] text-white px-5 rounded-xl font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#059669] font-bold tracking-widest text-xs uppercase">
              <span className="w-8 h-[2px] bg-[#059669]"></span>
              WELCOME BACK
            </div>

            <h1 className="text-5xl font-extrabold text-[#111827] tracking-tight italic">
              Hello,{' '}
              <span className="text-[#059669]">
                {user.firstName}
              </span>
            </h1>

            <p className="mt-3 text-gray-500 text-sm capitalize">
              Logged in as: {user.role}
            </p>
          </div>

          <div className="flex gap-3 relative">
            {/* NOTIFICATIONS */}
            <button
              onClick={() =>
                setShowNotifications(!showNotifications)
              }
              className="bg-white border border-gray-200 p-3 rounded-xl hover:bg-gray-50 transition shadow-sm relative z-20"
            >
              🔔

              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {/* NOTIFICATION DROPDOWN */}
            {showNotifications && (
              <div className="absolute top-full right-20 mt-2 w-96 bg-white border border-gray-100 rounded-3xl shadow-2xl z-50 overflow-hidden">
                <div className="bg-[#059669] px-5 py-4 text-white flex items-center justify-between">
                  <h3 className="font-bold text-lg">
                    Notifications
                  </h3>

                  <span className="bg-white text-[#059669] text-xs px-3 py-1 rounded-full font-bold">
                    {unreadCount} New
                  </span>
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-4 border-b border-gray-100 hover:bg-[#f9fafb] transition flex gap-3"
                    >
                      <div
                        className={`w-3 h-3 mt-2 rounded-full ${
                          n.read
                            ? 'bg-gray-300'
                            : 'bg-[#059669]'
                        }`}
                      ></div>

                      <div className="flex-1">
                        <p
                          className={`text-sm ${
                            n.read
                              ? 'text-gray-400'
                              : 'text-gray-700 font-medium'
                          }`}
                        >
                          {n.text}
                        </p>

                        <button
                          onClick={() => toggleRead(n.id)}
                          className="mt-2 text-xs text-[#059669] font-semibold hover:underline"
                        >
                          {n.read
                            ? 'Mark as unread'
                            : 'Mark as read'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SIGN OUT */}
            <button
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="bg-[#111827] hover:bg-black text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* SEARCH SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* INSTRUCTOR SEARCH */}
          <div className="bg-white/60 backdrop-blur-sm border border-white p-5 rounded-2xl shadow-sm">
            <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 block">
              Instructor Directory
            </label>

            <input
              type="text"
              value={instructorSearch}
              onChange={(e) =>
                setInstructorSearch(e.target.value)
              }
              placeholder="Search instructors..."
              className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm focus:border-[#10b981] outline-none"
            />

   {instructorSearch.trim() !== '' && (
  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
    {filteredInstructors.length > 0 ? (
      filteredInstructors.map((instructor) => (
        <div
          key={instructor.userId}
          className="bg-[#f9fafb] rounded-xl p-3 text-sm border border-gray-100"
        >
          <p className="font-semibold text-[#111827]">
            {instructor.firstName}{' '}
            {instructor.lastName}
          </p>

          <p className="text-gray-500">
            {instructor.email}
          </p>

          <p className="text-[#059669] text-xs mt-1 font-medium">
            Subject: {instructor.subject}
          </p>
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-400 px-2">
        No instructors found
      </p>
    )}
  </div>
)}

</div>

{/* PROJECT SEARCH */}

        {/* PROJECT SEARCH */}
<div className="bg-white/60 backdrop-blur-sm border border-white p-5 rounded-2xl shadow-sm">
  <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 block">
    Project Library
  </label>

  <div className="space-y-3">
    {/* SEARCH INPUT */}
    <input
      type="text"
      value={projectSearch}
      onChange={(e) =>
        setProjectSearch(e.target.value)
      }
      placeholder="Search projects..."
      className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm focus:border-[#10b981] outline-none"
    />

    {/* DATE FILTER */}
    <input
      type="date"
      value={projectDateSearch}
      onChange={(e) =>
        setProjectDateSearch(e.target.value)
      }
      className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm focus:border-[#10b981] outline-none text-gray-500"
    />

    {/* RATING FILTER */}
    <div className="flex items-center gap-1 mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() =>
            setHoveredRating(star)
          }
          onMouseLeave={() =>
            setHoveredRating(0)
          }
          onClick={() =>
            setProjectRatingFilter(star)
          }
          className="text-2xl transition-all"
        >
          {star <=
          (hoveredRating ||
            projectRatingFilter)
            ? '⭐'
            : '☆'}
        </button>
      ))}

      {projectRatingFilter > 0 && (
        <button
          onClick={() =>
            setProjectRatingFilter(0)
          }
          className="ml-3 text-xs text-red-500 hover:underline"
        >
          Clear
        </button>
      )}
    </div>
  </div>

  {(projectSearch.trim() !== '' ||
    projectDateSearch !== '' ||
    projectRatingFilter > 0) && (
    <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
      {filteredProjects.length > 0 ? (
        filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-[#f9fafb] rounded-xl p-3 text-sm border border-gray-100"
          >
            <p className="font-semibold text-[#111827]">
              {project.title}
            </p>

            <p className="text-gray-500 text-xs">
              {project.course}
            </p>

            {/* PROJECT RATING */}
            <p className="text-yellow-500 text-sm mt-1">
              {'⭐'.repeat(project.rating)}
            </p>

            <p className="text-[#059669] text-xs mt-1">
              Created: {project.createdAt}
            </p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-400 px-2">
          No projects found
        </p>
      )}
    </div>
            )}
          </div>

          {/* STUDENT SEARCH */}
          <div className="bg-white/60 backdrop-blur-sm border border-white p-5 rounded-2xl shadow-sm">
            <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 block">
              Student Portfolios
            </label>

            <input
              type="text"
              value={studentSearch}
              onChange={(e) =>
                setStudentSearch(e.target.value)
              }
              placeholder="Search name or email..."
              className="w-full bg-white border border-gray-100 rounded-xl p-3 text-sm focus:border-[#10b981] outline-none"
            />

           {studentSearch.trim() !== '' && (
  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
    {filteredStudents.length > 0 ? (
      filteredStudents.map((student, index) => (
        <div
          key={index}
          className="bg-[#f9fafb] rounded-xl p-3 text-sm border border-gray-100"
        >
          <p className="font-semibold text-[#111827]">
            {student.firstName} {student.lastName}
          </p>

          <p className="text-gray-500">
            {student.email}
          </p>

          {/* SKILLS */}
          {student.skills && (
            <div className="flex flex-wrap gap-2 mt-2">
              {student.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-[#d1fae5] text-[#065f46] text-xs px-2 py-1 rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-400 px-2">
        No students found
      </p>
    )}
  </div>
)}
          </div>
        </div>

        {/* DASHBOARD */}
        <main>
          {user.role === 'student' && <StudentDashboard />}
          {user.role === 'instructor' && (
            <InstructorDashboard />
          )}
          {user.role === 'employer' && (
            <EmployerDashboard />
          )}
        </main>

        {/* SETTINGS */}
        <div className="mt-16">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-400 text-sm font-semibold hover:text-[#059669] transition-all duration-200"
          >
            Notification Settings
          </button>

          {showSettings && (
            <div className="mt-6 bg-white border border-gray-100 rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-[#111827] mb-6">
                Notification Preferences
              </h3>

              <div className="space-y-6">
                {[
                  {
                    key: 'allNotifications',
                    label: 'Turn All Notifications',
                  },
                  {
                    key: 'cookies',
                    label: 'Save Cookies',
                  },
                  {
                    key: 'emailNotifications',
                    label: 'Email Notifications',
                  },
                  {
                    key: 'pushNotifications',
                    label: 'Push Notifications',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between bg-[#f9fafb] p-5 rounded-2xl"
                  >
                    <span className="font-semibold text-gray-700">
                      {item.label}
                    </span>

                    <button
                      onClick={() =>
                        toggleSetting(item.key)
                      }
                      className={`w-14 h-7 rounded-full transition-all relative ${
                        settings[item.key]
                          ? 'bg-[#059669]'
                          : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                          settings[item.key]
                            ? 'left-8'
                            : 'left-1'
                        }`}
                      ></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;