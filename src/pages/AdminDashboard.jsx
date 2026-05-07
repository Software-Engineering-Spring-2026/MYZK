import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const SEEDED_USERS = [
  {
    id: "admin-seeded",
    firstName: "Admin",
    lastName: "User",
    email: "admin@guc.edu.eg",
    password: "123456",
    role: "admin",
    status: "accepted",
    active: true,
  },
  {
    id: "emp-seeded-1",
    companyName: "Nile Systems",
    email: "talent@nilesystems.com",
    password: "123456",
    role: "employer",
    status: "pending",
    active: true,
    taxDocument: "nile-systems-tax-certificate.pdf",
    companyBio: "Software partner focused on campus hiring and student training.",
    address: "New Cairo, Cairo",
    contactInfo: "+20 100 000 0000",
  },
  {
    id: "emp-seeded-2",
    companyName: "Delta Labs",
    email: "careers@deltalabs.io",
    password: "123456",
    role: "employer",
    status: "accepted",
    active: true,
    taxDocument: "delta-labs-tax-card.pdf",
    companyBio: "AI product studio working with research-heavy student teams.",
    address: "Smart Village",
    contactInfo: "hr@deltalabs.io",
  },
  {
    id: "stu-1",
    firstName: "Ahmed",
    lastName: "Hassan",
    email: "ahmed@student.guc.edu.eg",
    password: "123456",
    role: "student",
    status: "accepted",
    active: true,
    major: "Computer Science",
    skills: ["React", "Node.js", "PostgreSQL"],
    linkedin: "linkedin.com/in/ahmed-hassan",
  },
  {
    id: "stu-2",
    firstName: "Sara",
    lastName: "Ahmed",
    email: "sara@student.guc.edu.eg",
    password: "123456",
    role: "student",
    status: "accepted",
    active: true,
    major: "Business Informatics",
    skills: ["UX", "Data Analysis", "Python"],
  },
  {
    id: "ins-1",
    firstName: "Ali",
    lastName: "Mahmoud",
    email: "dr.ali@guc.edu.eg",
    password: "123456",
    role: "instructor",
    status: "accepted",
    active: true,
    biography: "Course instructor for data structures and bachelor projects.",
    courses: ["CSEN 604", "Bachelor Project"],
  },
];

const SEEDED_PROJECTS = [
  {
    id: "project-seeded-1",
    title: "Smart Campus Navigation System",
    description:
      "AR-based campus navigation for students with live building guidance.",
    course: "Bachelor Project",
    courseInstructor: "Ali Mahmoud",
    creatorId: "stu-1",
    creatorName: "Ahmed Hassan",
    createdAt: "2026-04-10",
    rating: 4,
    active: true,
    flagged: false,
    isPublic: true,
    tags: ["React Native", "AR", "Node.js"],
  },
  {
    id: "project-seeded-2",
    title: "AI Resume Analyzer",
    description:
      "Machine learning workflow for reviewing CV strength and keyword gaps.",
    course: "Software Engineering",
    courseInstructor: "Heba Youssef",
    creatorId: "stu-2",
    creatorName: "Sara Ahmed",
    createdAt: "2026-03-22",
    rating: 5,
    active: true,
    flagged: true,
    flagReason: "Possible copied report section",
    appeal: "The repeated section is from the official course template.",
    isPublic: true,
    tags: ["Python", "NLP", "React"],
  },
  {
    id: "project-seeded-3",
    title: "Hospital Queue Management",
    description:
      "Distributed scheduling prototype for handling clinic waiting times.",
    course: "Operating Systems",
    courseInstructor: "Khaled Mostafa",
    creatorId: "stu-1",
    creatorName: "Ahmed Hassan",
    createdAt: "2026-05-01",
    rating: 3,
    active: true,
    flagged: false,
    isPublic: false,
    tags: ["Java", "Concurrency"],
  },
];

const SEEDED_INTERNSHIP_STATS = [
  {
    companyName: "Nile Systems",
    internshipsOffered: 4,
    completedStudents: 11,
    timeline: [
      { period: "Spring 2025", count: 1 },
      { period: "Summer 2025", count: 2 },
      { period: "Spring 2026", count: 1 },
    ],
  },
  {
    companyName: "Delta Labs",
    internshipsOffered: 3,
    completedStudents: 8,
    timeline: [
      { period: "Spring 2025", count: 1 },
      { period: "Winter 2026", count: 1 },
      { period: "Spring 2026", count: 1 },
    ],
  },
  {
    companyName: "Vodafone",
    internshipsOffered: 5,
    completedStudents: 16,
    timeline: [
      { period: "Summer 2025", count: 3 },
      { period: "Winter 2026", count: 1 },
      { period: "Spring 2026", count: 1 },
    ],
  },
];

const SEEDED_COURSES = [
  { id: "course-1", courseName: "Bachelor Project", courseCode: "CSEN 700" },
  { id: "course-2", courseName: "Software Engineering", courseCode: "CSEN 603" },
  { id: "course-3", courseName: "Database Systems", courseCode: "CSEN 604" },
];

const SEEDED_COURSE_REQUESTS = [
  {
    id: "request-1",
    instructorName: "Ali Mahmoud",
    instructorEmail: "dr.ali@guc.edu.eg",
    courseName: "Database Systems",
    courseCode: "CSEN 604",
    type: "link",
    status: "pending",
  },
  {
    id: "request-2",
    instructorName: "Heba Youssef",
    instructorEmail: "dr.heba@guc.edu.eg",
    courseName: "Operating Systems",
    courseCode: "CSEN 602",
    type: "unlink",
    status: "pending",
  },
];

const SEEDED_ALERTS = [
  {
    id: "alert-system-1",
    title: "Employer verification pending",
    message: "Nile Systems uploaded a tax certificate and is waiting for review.",
    read: false,
    createdAt: "2026-05-02T10:30:00.000Z",
    source: "system",
  },
  {
    id: "alert-system-2",
    title: "Project appeal received",
    message: "AI Resume Analyzer has an appeal attached to its flag.",
    read: false,
    createdAt: "2026-05-03T14:15:00.000Z",
    source: "system",
  },
];

const ADMIN_READ_PREFIX = "admin-read:";

const TABS = [
  "overview",
  "employers",
  "users",
  "courses",
  "moderation",
  "projects",
  "portfolios",
  "notifications",
];

const safeRead = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const safeWrite = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const mergeRecords = (seededItems, storedItems, getKey) => {
  const map = new Map();
  seededItems.forEach((item, index) => {
    map.set(getKey(item, index), item);
  });
  storedItems.forEach((item, index) => {
    const key = getKey(item, index + seededItems.length);
    map.set(key, { ...(map.get(key) || {}), ...item });
  });
  return Array.from(map.values());
};

const userKey = (user, index = 0) => user?.id || user?.email || `user-${index}`;
const projectKey = (project, index = 0) => project?.id || `project-${index}`;
const courseKey = (course, index = 0) =>
  course?.id || course?.courseCode || `course-${index}`;
const requestKey = (request, index = 0) => request?.id || `request-${index}`;

const getUserName = (user) => {
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  return fullName || user?.companyName || "Unknown";
};

const getStatus = (item) => item?.status ?? "pending";
const isActive = (item) => item?.active ?? true;
const getRating = (project) => project?.rating ?? 0;
const getCreatedAt = (project) => project?.createdAt ?? "Not recorded";

const getAdminReadState = (notifications) =>
  notifications.reduce((state, notification) => {
    if (notification?.adminReadTarget) {
      state[notification.adminReadTarget] = notification.read ?? false;
    }
    return state;
  }, {});

const statusClass = (status) => {
  if (status === "accepted" || status === "approved") {
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }
  if (status === "rejected") {
    return "bg-red-100 text-red-600 border-red-200";
  }
  if (status === "pending") {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }
  return "bg-slate-100 text-slate-600 border-slate-200";
};

const activeClass = (active) =>
  active
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-slate-100 text-slate-500 border-slate-200";

const roleClass = (role) => {
  if (role === "admin") return "bg-slate-900 text-white border-slate-900";
  if (role === "employer") return "bg-sky-100 text-sky-700 border-sky-200";
  if (role === "instructor") return "bg-violet-100 text-violet-700 border-violet-200";
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
};

function Pill({ children, className }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${className}`}
    >
      {children}
    </span>
  );
}

function ActionButton({ children, onClick, variant = "primary", type = "button" }) {
  const styles = {
    primary:
      "bg-emerald-600 text-white shadow-emerald-600/20 hover:-translate-y-0.5 hover:bg-emerald-500",
    secondary:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900",
    danger:
      "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
    dark: "bg-slate-900 text-white hover:bg-slate-800",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-semibold shadow-sm transition ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-800">{value || "Not recorded"}</p>
    </div>
  );
}

function EmptyState({ children }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-sm text-slate-400">
      {children}
    </div>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [currentAdmin] = useState(() => safeRead("user", null));
  const [activeTab, setActiveTab] = useState("overview");

  const [users, setUsers] = useState(() =>
    mergeRecords(SEEDED_USERS, safeRead("users", []), userKey)
  );
  const [projects, setProjects] = useState(() =>
    mergeRecords(SEEDED_PROJECTS, safeRead("projects", []), projectKey)
  );
  const [courses, setCourses] = useState(() =>
    mergeRecords(SEEDED_COURSES, safeRead("courses", []), courseKey)
  );
  const [courseRequests, setCourseRequests] = useState(() =>
    mergeRecords(SEEDED_COURSE_REQUESTS, safeRead("courseLinkRequests", []), requestKey)
  );
  const [storedNotifications, setStoredNotifications] = useState(() =>
    safeRead("notifications", [])
  );
  const [seededAlerts, setSeededAlerts] = useState(SEEDED_ALERTS);
  const [derivedReadState, setDerivedReadState] = useState({});

  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [userStatusFilter, setUserStatusFilter] = useState("all");
  const [projectSearch, setProjectSearch] = useState("");
  const [projectCourseFilter, setProjectCourseFilter] = useState("all");
  const [projectInstructorFilter, setProjectInstructorFilter] = useState("all");
  const [projectDateFilter, setProjectDateFilter] = useState("");
  const [projectStateFilter, setProjectStateFilter] = useState("all");
  const [projectSort, setProjectSort] = useState("newest");
  const [portfolioSearch, setPortfolioSearch] = useState("");
  const [portfolioSkillFilter, setPortfolioSkillFilter] = useState("");
  const [portfolioSort, setPortfolioSort] = useState("most");

  const [adminForm, setAdminForm] = useState({
    lastName: "",
    email: "",
    password: "",
  });
  const [courseForm, setCourseForm] = useState({
    courseName: "",
    courseCode: "",
  });
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (!currentAdmin || currentAdmin.role !== "admin") {
      navigate("/login");
    }
  }, [currentAdmin, navigate]);

  const saveUsers = (nextUsers) => {
    setUsers(nextUsers);
    safeWrite("users", nextUsers);
  };

  const saveProjects = (nextProjects) => {
    setProjects(nextProjects);
    safeWrite("projects", nextProjects);
  };

  const saveCourses = (nextCourses) => {
    setCourses(nextCourses);
    safeWrite("courses", nextCourses);
  };

  const saveCourseRequests = (nextRequests) => {
    setCourseRequests(nextRequests);
    safeWrite("courseLinkRequests", nextRequests);
  };

  const saveNotifications = (nextNotifications) => {
    setStoredNotifications(nextNotifications);
    safeWrite("notifications", nextNotifications);
  };

  const updateUser = (targetUser, changes) => {
    const targetKey = userKey(targetUser);
    saveUsers(
      users.map((user) =>
        userKey(user) === targetKey ? { ...user, ...changes } : user
      )
    );
  };

  const updateProject = (targetProject, changes) => {
    const targetKey = projectKey(targetProject);
    saveProjects(
      projects.map((project) =>
        projectKey(project) === targetKey ? { ...project, ...changes } : project
      )
    );
  };

  const employers = useMemo(
    () => users.filter((user) => user.role === "employer"),
    [users]
  );

  const pendingEmployers = useMemo(
    () => employers.filter((user) => getStatus(user) === "pending"),
    [employers]
  );

  const flaggedProjects = useMemo(
    () => projects.filter((project) => project.flagged),
    [projects]
  );

  const pendingRequests = useMemo(
    () => courseRequests.filter((request) => getStatus(request) === "pending"),
    [courseRequests]
  );

  const persistedReadState = useMemo(
    () => getAdminReadState(storedNotifications),
    [storedNotifications]
  );

  const derivedAlerts = useMemo(() => {
    const alerts = [
      ...pendingEmployers.map((employer) => ({
        id: `derived-employer-${userKey(employer)}`,
        title: "Employer application",
        message: `${employer.companyName || getUserName(employer)} is waiting for admin approval.`,
        read:
          persistedReadState[`derived-employer-${userKey(employer)}`] ??
          derivedReadState[`derived-employer-${userKey(employer)}`] ??
          false,
        createdAt: new Date().toISOString(),
        source: "derived",
      })),
      ...flaggedProjects.map((project) => ({
        id: `derived-project-${projectKey(project)}`,
        title: project.appeal ? "Flag appeal pending" : "Flagged project",
        message: `${project.title || "Untitled project"} needs moderation review.`,
        read:
          persistedReadState[`derived-project-${projectKey(project)}`] ??
          derivedReadState[`derived-project-${projectKey(project)}`] ??
          false,
        createdAt: new Date().toISOString(),
        source: "derived",
      })),
      ...pendingRequests.map((request) => ({
        id: `derived-request-${requestKey(request)}`,
        title: "Course link request",
        message: `${request.instructorName || "Instructor"} requested to ${request.type || "link"} ${request.courseName || "a course"}.`,
        read:
          persistedReadState[`derived-request-${requestKey(request)}`] ??
          derivedReadState[`derived-request-${requestKey(request)}`] ??
          false,
        createdAt: new Date().toISOString(),
        source: "derived",
      })),
    ];
    return alerts;
  }, [derivedReadState, flaggedProjects, pendingEmployers, pendingRequests, persistedReadState]);

  const adminNotifications = useMemo(() => {
    const normalizedStored = storedNotifications
      .filter((notification) => !notification?.adminReadTarget)
      .map((notification, index) => ({
        id: notification.id || `stored-${index}`,
        title: notification.title || "Platform notification",
        message: notification.message || notification.text || "No message provided.",
        read: notification.read ?? false,
        createdAt: notification.createdAt || notification.date || new Date().toISOString(),
        source: "stored",
        original: notification,
      }));
    const normalizedSeeded = seededAlerts.map((alert) => ({
      ...alert,
      read: persistedReadState[alert.id] ?? alert.read,
    }));
    return [...derivedAlerts, ...normalizedSeeded, ...normalizedStored].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [seededAlerts, derivedAlerts, persistedReadState, storedNotifications]);

  const unreadCount = adminNotifications.filter((alert) => !alert.read).length;

  const stats = useMemo(
    () => [
      { label: "Users", value: users.length, note: "All roles" },
      { label: "Pending Employers", value: pendingEmployers.length, note: "Need review" },
      { label: "Projects", value: projects.length, note: "Project catalog" },
      { label: "Flagged", value: flaggedProjects.length, note: "Moderation" },
      { label: "Courses", value: courses.length, note: "Catalog" },
      { label: "Alerts", value: unreadCount, note: "Unread" },
    ],
    [courses.length, flaggedProjects.length, pendingEmployers.length, projects.length, unreadCount, users.length]
  );

  const platformUsage = useMemo(() => {
    const students = users.filter((user) => user.role === "student").length;
    const employersCount = users.filter((user) => user.role === "employer").length;
    const instructors = users.filter((user) => user.role === "instructor").length;
    const admins = users.filter((user) => user.role === "admin").length;

    return [
      { label: "Students", value: students },
      { label: "Employers", value: employersCount },
      { label: "Course Instructors", value: instructors },
      { label: "Admins", value: admins },
      { label: "Projects", value: projects.length },
      { label: "Courses", value: courses.length },
    ];
  }, [courses.length, projects.length, users]);

  const internshipStats = useMemo(() => {
    const employerNames = new Set(
      users
        .filter((user) => user.role === "employer")
        .map((user) => user.companyName || getUserName(user))
    );
    const mergedCompanies = SEEDED_INTERNSHIP_STATS.map((company) => ({
      ...company,
      isRegistered: employerNames.has(company.companyName),
    }));

    return {
      companies: mergedCompanies,
      totalOffered: mergedCompanies.reduce(
        (sum, company) => sum + company.internshipsOffered,
        0
      ),
      totalCompletedStudents: mergedCompanies.reduce(
        (sum, company) => sum + company.completedStudents,
        0
      ),
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const search = userSearch.toLowerCase();
    return users.filter((user) => {
      const searchableCourses = Array.isArray(user.courses)
        ? user.courses.join(" ")
        : user.courses || "";
      const matchesSearch = `${getUserName(user)} ${user.email || ""} ${user.companyName || ""} ${user.subject || ""} ${searchableCourses}`
        .toLowerCase()
        .includes(search);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        userStatusFilter === "all" || getStatus(user) === userStatusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [roleFilter, userSearch, userStatusFilter, users]);

  const projectCourses = useMemo(
    () => Array.from(new Set(projects.map((project) => project.course).filter(Boolean))),
    [projects]
  );

  const projectInstructors = useMemo(
    () =>
      Array.from(
        new Set(projects.map((project) => project.courseInstructor).filter(Boolean))
      ),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    const search = projectSearch.toLowerCase();
    return [...projects]
      .filter((project) => {
        const matchesSearch = `${project.title || ""} ${project.course || ""} ${project.courseInstructor || ""}`
          .toLowerCase()
          .includes(search);
        const matchesCourse =
          projectCourseFilter === "all" || project.course === projectCourseFilter;
        const matchesInstructor =
          projectInstructorFilter === "all" ||
          project.courseInstructor === projectInstructorFilter;
        const matchesDate =
          !projectDateFilter || getCreatedAt(project).includes(projectDateFilter);
        const matchesState =
          projectStateFilter === "all" ||
          (projectStateFilter === "flagged" && project.flagged) ||
          (projectStateFilter === "active" && isActive(project)) ||
          (projectStateFilter === "inactive" && !isActive(project));
        return matchesSearch && matchesCourse && matchesInstructor && matchesDate && matchesState;
      })
      .sort((a, b) => {
        if (projectSort === "rating") return getRating(b) - getRating(a);
        if (projectSort === "oldest") {
          return new Date(getCreatedAt(a)) - new Date(getCreatedAt(b));
        }
        return new Date(getCreatedAt(b)) - new Date(getCreatedAt(a));
      });
  }, [
    projectCourseFilter,
    projectDateFilter,
    projectInstructorFilter,
    projectSearch,
    projectSort,
    projectStateFilter,
    projects,
  ]);

  const portfolios = useMemo(() => {
    return users
      .filter((user) => user.role === "student")
      .map((student) => {
        const name = getUserName(student);
        const ownedProjects = projects.filter(
          (project) =>
            project.creatorId === student.id ||
            project.creatorEmail === student.email ||
            project.ownerEmail === student.email ||
            (project.creatorName || "").toLowerCase() === name.toLowerCase()
        );
        const skills = Array.isArray(student.skills)
          ? student.skills
          : typeof student.skills === "string"
            ? student.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
            : [];
        return {
          student,
          name,
          email: student.email || "No email",
          major: student.major || "Not recorded",
          skills,
          projects: ownedProjects,
        };
      });
  }, [projects, users]);

  const filteredPortfolios = useMemo(() => {
    const search = portfolioSearch.toLowerCase();
    const skillSearch = portfolioSkillFilter.toLowerCase();
    return [...portfolios]
      .filter((portfolio) => {
        const matchesSearch = `${portfolio.name} ${portfolio.email}`
          .toLowerCase()
          .includes(search);
        const matchesSkill =
          !skillSearch ||
          portfolio.major.toLowerCase().includes(skillSearch) ||
          portfolio.skills.join(" ").toLowerCase().includes(skillSearch);
        return matchesSearch && matchesSkill;
      })
      .sort((a, b) =>
        portfolioSort === "fewest"
          ? a.projects.length - b.projects.length
          : b.projects.length - a.projects.length
      );
  }, [portfolioSearch, portfolioSkillFilter, portfolioSort, portfolios]);

  const openCourseModal = (course = null) => {
    setEditingCourseId(course ? courseKey(course) : null);
    setCourseForm({
      courseName: course?.courseName || "",
      courseCode: course?.courseCode || "",
    });
    setModal({ type: "course" });
  };

  const saveCourse = (event) => {
    event.preventDefault();
    if (!courseForm.courseName.trim() || !courseForm.courseCode.trim()) return;

    if (editingCourseId) {
      saveCourses(
        courses.map((course) =>
          courseKey(course) === editingCourseId
            ? { ...course, ...courseForm }
            : course
        )
      );
    } else {
      saveCourses([
        ...courses,
        { id: Date.now().toString(), ...courseForm },
      ]);
    }

    setModal(null);
    setEditingCourseId(null);
    setCourseForm({ courseName: "", courseCode: "" });
  };

  const deleteCourse = (course) => {
    saveCourses(courses.filter((item) => courseKey(item) !== courseKey(course)));
  };

  const createAdmin = (event) => {
    event.preventDefault();
    if (!adminForm.email.trim() || !adminForm.password.trim()) return;
    const newAdmin = {
      id: Date.now().toString(),
      firstName: "Admin",
      lastName: adminForm.lastName || "User",
      email: adminForm.email,
      password: adminForm.password,
      role: "admin",
      status: "accepted",
      active: true,
    };
    saveUsers([...users, newAdmin]);
    setAdminForm({ lastName: "", email: "", password: "" });
    setModal(null);
  };

  const decideCourseRequest = (request, status) => {
    saveCourseRequests(
      courseRequests.map((item) =>
        requestKey(item) === requestKey(request) ? { ...item, status } : item
      )
    );
  };

  const decideEmployer = (employer, status) => {
    updateUser(employer, { status });
  };

  const saveAdminNotificationReadState = (alertId, read) => {
    const markerId = `${ADMIN_READ_PREFIX}${alertId}`;
    const existingMarker = storedNotifications.some(
      (notification) => notification.id === markerId
    );
    const nextNotifications = existingMarker
      ? storedNotifications.map((notification) =>
          notification.id === markerId
            ? { ...notification, read, updatedAt: new Date().toISOString() }
            : notification
        )
      : [
          ...storedNotifications,
          {
            id: markerId,
            adminReadTarget: alertId,
            read,
            createdAt: new Date().toISOString(),
          },
        ];

    saveNotifications(nextNotifications);
  };

  const toggleNotificationRead = (alert) => {
    if (alert.source === "stored") {
      saveNotifications(
        storedNotifications.map((notification, index) => {
          const id = notification.id || `stored-${index}`;
          return id === alert.id ? { ...notification, read: !alert.read } : notification;
        })
      );
      return;
    }

    if (alert.source === "system") {
      saveAdminNotificationReadState(alert.id, !alert.read);
      setSeededAlerts(
        seededAlerts.map((item) =>
          item.id === alert.id ? { ...item, read: !alert.read } : item
        )
      );
      return;
    }

    saveAdminNotificationReadState(alert.id, !alert.read);
    setDerivedReadState((prev) => ({ ...prev, [alert.id]: !alert.read }));
  };

  const downloadDocumentPlaceholder = (employer) => {
    const filename = employer.taxDocument || "tax-document.pdf";
    const content = [
      "ProjectFolio document archive summary",
      `Company: ${employer.companyName || getUserName(employer)}`,
      `Email: ${employer.email || "Not recorded"}`,
      `Stored file name: ${filename}`,
      "Document contents are managed outside this browser-based archive.",
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename.replace(/\.[^/.]+$/, "")}-document-summary.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const signOut = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="min-h-[118px] rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              {stat.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-500">{stat.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
                Review Queue
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">
                Needs admin attention
              </h2>
            </div>
            <Pill className={statusClass("pending")}>
              {pendingEmployers.length + flaggedProjects.length + pendingRequests.length} open
            </Pill>
          </div>

          <div className="space-y-3">
            {[...pendingEmployers, ...flaggedProjects, ...pendingRequests].slice(0, 6).map((item, index) => (
              <div
                key={`${item.id || item.email || item.title}-${index}`}
                className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {item.companyName || item.title || item.courseName || "Review item"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.email || item.flagReason || item.instructorEmail || "Moderation task"}
                  </p>
                </div>
              <ActionButton
                variant="secondary"
                onClick={() => {
                  if (item.role === "employer") setActiveTab("employers");
                  else if (item.courseCode) setActiveTab("courses");
                  else setActiveTab("moderation");
                }}
              >
                  Open
                </ActionButton>
              </div>
            ))}
            {pendingEmployers.length + flaggedProjects.length + pendingRequests.length === 0 && (
              <EmptyState>No pending admin tasks right now.</EmptyState>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
            Activity
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Latest alerts</h2>
          <div className="mt-5 space-y-3">
            {adminNotifications.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`rounded-2xl border p-4 ${
                  alert.read
                    ? "border-slate-100 bg-white/70"
                    : "border-emerald-200 bg-emerald-50/80"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{alert.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{alert.message}</p>
                  </div>
                  {!alert.read && <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
            Platform Usage
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            Users, projects, and courses
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {platformUsage.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-100 bg-white/80 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
                Internship Statistics
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">
                Offered internships over time
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Pill className="border-sky-200 bg-sky-100 text-sky-700">
                {internshipStats.totalOffered} offered
              </Pill>
              <Pill className="border-emerald-200 bg-emerald-100 text-emerald-700">
                {internshipStats.totalCompletedStudents} students
              </Pill>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {internshipStats.companies.map((company) => (
              <div
                key={company.companyName}
                className="rounded-2xl border border-slate-100 bg-white/80 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{company.companyName}</p>
                    <p className="text-sm text-slate-500">
                      {company.completedStudents} students completed internships
                    </p>
                  </div>
                  <Pill
                    className={
                      company.isRegistered
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-100 text-slate-600"
                    }
                  >
                    {company.isRegistered ? "registered" : "partner"}
                  </Pill>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {company.timeline.map((point) => (
                    <span
                      key={`${company.companyName}-${point.period}`}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
                    >
                      {point.period}: {point.count}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmployers = () => (
    <div className="space-y-5">
      {employers.map((employer) => (
        <div
          key={userKey(employer)}
          className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap gap-2">
                <Pill className={statusClass(getStatus(employer))}>{getStatus(employer)}</Pill>
                <Pill className={activeClass(isActive(employer))}>
                  {isActive(employer) ? "active" : "inactive"}
                </Pill>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                {employer.companyName || getUserName(employer)}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{employer.email || "No email"}</p>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
                {employer.companyBio || "No company biography has been added yet."}
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <Field label="Address" value={employer.address} />
                <Field label="Contact" value={employer.contactInfo} />
                <Field label="Tax Document" value={employer.taxDocument || "No document"} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <ActionButton onClick={() => decideEmployer(employer, "accepted")}>
                Accept
              </ActionButton>
              <ActionButton variant="danger" onClick={() => decideEmployer(employer, "rejected")}>
                Reject
              </ActionButton>
              <ActionButton
                variant="secondary"
                onClick={() => updateUser(employer, { active: !isActive(employer) })}
              >
                {isActive(employer) ? "Deactivate" : "Activate"}
              </ActionButton>
              <ActionButton
                variant="secondary"
                onClick={() => setModal({ type: "document", data: employer })}
              >
                View Document
              </ActionButton>
              <ActionButton
                variant="secondary"
                onClick={() => downloadDocumentPlaceholder(employer)}
              >
                Download
              </ActionButton>
            </div>
          </div>
        </div>
      ))}
      {employers.length === 0 && <EmptyState>No employer applications yet.</EmptyState>}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid flex-1 gap-3 md:grid-cols-3">
            <input
              value={userSearch}
              onChange={(event) => setUserSearch(event.target.value)}
              placeholder="Search name, company, or email..."
              className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/30"
            />
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/30"
            >
              <option value="all">All roles</option>
              <option value="admin">Admins</option>
              <option value="student">Students</option>
              <option value="instructor">Instructors</option>
              <option value="employer">Employers</option>
            </select>
            <select
              value={userStatusFilter}
              onChange={(event) => setUserStatusFilter(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/30"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <ActionButton onClick={() => setModal({ type: "admin" })}>
            Create Admin
          </ActionButton>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/80 shadow-lg backdrop-blur">
        <div className="hidden grid-cols-[1.2fr_1.3fr_0.7fr_0.7fr_1fr] gap-4 border-b border-slate-100 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 lg:grid">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        <div className="divide-y divide-slate-100">
          {filteredUsers.map((user) => (
            <div
              key={userKey(user)}
              className="grid gap-3 p-5 lg:grid-cols-[1.2fr_1.3fr_0.7fr_0.7fr_1fr] lg:items-center"
            >
              <div>
                <p className="font-semibold text-slate-900">{getUserName(user)}</p>
                <p className="text-xs text-slate-400">{isActive(user) ? "Active" : "Inactive"}</p>
              </div>
              <p className="text-sm text-slate-600">{user.email || "No email"}</p>
              <Pill className={roleClass(user.role)}>{user.role || "user"}</Pill>
              <Pill className={statusClass(getStatus(user))}>{getStatus(user)}</Pill>
              <div className="flex flex-wrap gap-2">
                <ActionButton
                  variant="secondary"
                  onClick={() => setModal({ type: "user", data: user })}
                >
                  Details
                </ActionButton>
                <ActionButton
                  variant="secondary"
                  onClick={() => updateUser(user, { active: !isActive(user) })}
                >
                  {isActive(user) ? "Deactivate" : "Activate"}
                </ActionButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
              Catalog
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Courses</h2>
          </div>
          <ActionButton onClick={() => openCourseModal()}>Add Course</ActionButton>
        </div>
        <div className="space-y-3">
          {courses.map((course) => (
            <div
              key={courseKey(course)}
              className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  {course.courseName || "Untitled course"}
                </p>
                <p className="text-sm text-slate-500">{course.courseCode || "No code"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ActionButton variant="secondary" onClick={() => openCourseModal(course)}>
                  Edit
                </ActionButton>
                <ActionButton variant="danger" onClick={() => deleteCourse(course)}>
                  Delete
                </ActionButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
          Instructor Requests
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">Link and unlink review</h2>
        <div className="mt-5 space-y-3">
          {courseRequests.map((request) => (
            <div
              key={requestKey(request)}
              className="rounded-2xl border border-slate-100 bg-white/80 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Pill className={statusClass(getStatus(request))}>{getStatus(request)}</Pill>
                    <Pill className="border-slate-200 bg-slate-100 text-slate-600">
                      {request.type || "link"}
                    </Pill>
                  </div>
                  <p className="font-semibold text-slate-900">
                    {request.instructorName || "Instructor"}
                  </p>
                  <p className="text-sm text-slate-500">{request.instructorEmail || "No email"}</p>
                  <p className="mt-2 text-sm text-slate-700">
                    {request.courseName || "Course"} ({request.courseCode || "No code"})
                  </p>
                </div>
                {getStatus(request) === "pending" && (
                  <div className="flex flex-wrap gap-2">
                    <ActionButton onClick={() => decideCourseRequest(request, "accepted")}>
                      Accept
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      onClick={() => decideCourseRequest(request, "rejected")}
                    >
                      Reject
                    </ActionButton>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur">
        <div className="grid gap-3 lg:grid-cols-3 xl:grid-cols-6">
          <input
            value={projectSearch}
            onChange={(event) => setProjectSearch(event.target.value)}
            placeholder="Search project title..."
            className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/30"
          />
          <select
            value={projectCourseFilter}
            onChange={(event) => setProjectCourseFilter(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/30"
          >
            <option value="all">All courses</option>
            {projectCourses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
          <select
            value={projectInstructorFilter}
            onChange={(event) => setProjectInstructorFilter(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/30"
          >
            <option value="all">All instructors</option>
            {projectInstructors.map((instructor) => (
              <option key={instructor} value={instructor}>
                {instructor}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={projectDateFilter}
            onChange={(event) => setProjectDateFilter(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-500 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/30"
          />
          <select
            value={projectStateFilter}
            onChange={(event) => setProjectStateFilter(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/30"
          >
            <option value="all">All states</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="flagged">Flagged</option>
          </select>
          <select
            value={projectSort}
            onChange={(event) => setProjectSort(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/30"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            Showing {filteredProjects.length} project titles from search and filters.
          </span>
          {projectDateFilter && (
            <button
              onClick={() => setProjectDateFilter("")}
              className="rounded-full bg-white px-3 py-1 font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
            >
              Clear date
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredProjects.map((project) => (
          <div
            key={projectKey(project)}
            className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex flex-wrap gap-2">
                  <Pill className={activeClass(isActive(project))}>
                    {isActive(project) ? "active" : "inactive"}
                  </Pill>
                  {project.flagged && <Pill className={statusClass("rejected")}>flagged</Pill>}
                  <Pill className="border-sky-200 bg-sky-100 text-sky-700">
                    {getRating(project)}/5
                  </Pill>
                </div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {project.title || "Untitled project"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {project.course || "No course"} | {getCreatedAt(project)}
                </p>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
                  {project.description || "No description was added."}
                </p>
                {project.appeal && (
                  <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                    Appeal pending: {project.appeal}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <ActionButton
                  variant="secondary"
                  onClick={() => setModal({ type: "project", data: project })}
                >
                  Details
                </ActionButton>
                <ActionButton
                  variant={project.flagged ? "secondary" : "danger"}
                  onClick={() =>
                    updateProject(
                      project,
                      project.flagged
                        ? { flagged: false, flagReason: "", appeal: "", active: true }
                        : {
                            flagged: true,
                            flagReason: "Flagged by administrator",
                            active: false,
                          }
                    )
                  }
                >
                  {project.flagged ? "Unflag" : "Flag"}
                </ActionButton>
                <ActionButton
                  variant="secondary"
                  onClick={() => updateProject(project, { active: !isActive(project) })}
                >
                  {isActive(project) ? "Deactivate" : "Activate"}
                </ActionButton>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredProjects.length === 0 && <EmptyState>No projects match the filters.</EmptyState>}
    </div>
  );

  const renderModeration = () => {
    const appeals = projects.filter((project) => project.appeal);

    return (
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
                Flagged Projects
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">
                University rules review
              </h2>
            </div>
            <Pill className={flaggedProjects.length ? statusClass("rejected") : statusClass("accepted")}>
              {flaggedProjects.length} flagged
            </Pill>
          </div>

          <div className="space-y-3">
            {flaggedProjects.map((project) => (
              <div
                key={projectKey(project)}
                className="rounded-2xl border border-red-100 bg-red-50/70 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {project.title || "Untitled project"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {project.creatorName || "Unknown creator"} | {project.course || "No course"}
                    </p>
                    <p className="mt-2 text-sm text-red-700">
                      Reason: {project.flagReason || "No reason provided."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <ActionButton
                      variant="secondary"
                      onClick={() => setModal({ type: "project", data: project })}
                    >
                      View
                    </ActionButton>
                    <ActionButton
                      onClick={() =>
                        updateProject(project, {
                          flagged: false,
                          flagReason: "",
                          appeal: "",
                          active: true,
                        })
                      }
                    >
                      Unflag
                    </ActionButton>
                  </div>
                </div>
              </div>
            ))}
            {flaggedProjects.length === 0 && (
              <EmptyState>No flagged projects right now.</EmptyState>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
                Student Appeals
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">
                Requests to unflag projects
              </h2>
            </div>
            <Pill className={appeals.length ? statusClass("pending") : statusClass("accepted")}>
              {appeals.length} appeals
            </Pill>
          </div>

          <div className="space-y-3">
            {appeals.map((project) => (
              <div
                key={`appeal-${projectKey(project)}`}
                className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {project.title || "Untitled project"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Sent by {project.creatorName || "Unknown student"}
                    </p>
                    <p className="mt-2 text-sm text-amber-800">{project.appeal}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <ActionButton
                      onClick={() =>
                        updateProject(project, {
                          flagged: false,
                          flagReason: "",
                          appeal: "",
                          active: true,
                        })
                      }
                    >
                      Accept
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      onClick={() =>
                        updateProject(project, {
                          appeal: "",
                          appealStatus: "rejected",
                        })
                      }
                    >
                      Reject
                    </ActionButton>
                    <ActionButton
                      variant="secondary"
                      onClick={() => setModal({ type: "project", data: project })}
                    >
                      View
                    </ActionButton>
                  </div>
                </div>
              </div>
            ))}
            {appeals.length === 0 && (
              <EmptyState>No student appeals have been sent.</EmptyState>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPortfolios = () => (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            value={portfolioSearch}
            onChange={(event) => setPortfolioSearch(event.target.value)}
            placeholder="Search student name or email..."
            className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/30"
          />
          <input
            value={portfolioSkillFilter}
            onChange={(event) => setPortfolioSkillFilter(event.target.value)}
            placeholder="Filter by major or skill..."
            className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/30"
          />
          <select
            value={portfolioSort}
            onChange={(event) => setPortfolioSort(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/30"
          >
            <option value="most">Most projects first</option>
            <option value="fewest">Fewest projects first</option>
          </select>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Showing {filteredPortfolios.length} portfolios sorted by number of projects.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredPortfolios.map((portfolio) => (
          <div
            key={userKey(portfolio.student)}
            className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{portfolio.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{portfolio.email}</p>
                <p className="mt-2 text-sm text-slate-700">Major: {portfolio.major}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(portfolio.skills.length ? portfolio.skills : ["No skills recorded"]).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <Pill className="border-emerald-200 bg-emerald-100 text-emerald-700">
                  {portfolio.projects.length} projects
                </Pill>
                <ActionButton
                  variant="secondary"
                  onClick={() => setModal({ type: "portfolio", data: portfolio })}
                >
                  View Portfolio
                </ActionButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-4">
      {adminNotifications.map((alert) => (
        <div
          key={alert.id}
          className={`rounded-3xl border p-5 shadow-lg backdrop-blur ${
            alert.read
              ? "border-slate-200 bg-white/75"
              : "border-emerald-200 bg-emerald-50/85"
          }`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                <Pill className="border-slate-200 bg-white text-slate-600">{alert.source}</Pill>
                {!alert.read && <Pill className={statusClass("pending")}>unread</Pill>}
              </div>
              <h2 className="text-lg font-semibold text-slate-900">{alert.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{alert.message}</p>
              <p className="mt-2 text-xs text-slate-400">
                {new Date(alert.createdAt).toLocaleString()}
              </p>
            </div>
            <ActionButton variant="secondary" onClick={() => toggleNotificationRead(alert)}>
              Mark {alert.read ? "Unread" : "Read"}
            </ActionButton>
          </div>
        </div>
      ))}
    </div>
  );

  const renderActiveTab = () => {
    if (activeTab === "overview") return renderOverview();
    if (activeTab === "employers") return renderEmployers();
    if (activeTab === "users") return renderUsers();
    if (activeTab === "courses") return renderCourses();
    if (activeTab === "moderation") return renderModeration();
    if (activeTab === "projects") return renderProjects();
    if (activeTab === "portfolios") return renderPortfolios();
    return renderNotifications();
  };

  const renderModal = () => {
    if (!modal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
          {modal.type === "document" && (
            <>
              <h2 className="text-xl font-semibold text-slate-900">Document Metadata</h2>
              <p className="mt-2 text-sm text-slate-500">
                The company record includes the uploaded document reference.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Field label="Company" value={modal.data.companyName || getUserName(modal.data)} />
                <Field label="Email" value={modal.data.email} />
                <Field label="Document" value={modal.data.taxDocument || "No document"} />
                <Field label="Status" value={getStatus(modal.data)} />
              </div>
            </>
          )}

          {modal.type === "admin" && (
            <form onSubmit={createAdmin} className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">Create Admin Account</h2>
              <input
                value={adminForm.lastName}
                onChange={(event) =>
                  setAdminForm((prev) => ({ ...prev, lastName: event.target.value }))
                }
                placeholder="Admin last name"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/30"
              />
              <input
                type="email"
                value={adminForm.email}
                onChange={(event) =>
                  setAdminForm((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="admin2@guc.edu.eg"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/30"
              />
              <input
                type="password"
                value={adminForm.password}
                onChange={(event) =>
                  setAdminForm((prev) => ({ ...prev, password: event.target.value }))
                }
                placeholder="Password"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/30"
              />
              <div className="flex justify-end gap-2">
                <ActionButton variant="secondary" onClick={() => setModal(null)}>
                  Cancel
                </ActionButton>
                <ActionButton type="submit">Create</ActionButton>
              </div>
            </form>
          )}

          {modal.type === "course" && (
            <form onSubmit={saveCourse} className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingCourseId ? "Edit Course" : "Add Course"}
              </h2>
              <input
                value={courseForm.courseName}
                onChange={(event) =>
                  setCourseForm((prev) => ({ ...prev, courseName: event.target.value }))
                }
                placeholder="Course name"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/30"
              />
              <input
                value={courseForm.courseCode}
                onChange={(event) =>
                  setCourseForm((prev) => ({ ...prev, courseCode: event.target.value }))
                }
                placeholder="Course code"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/30"
              />
              <div className="flex justify-end gap-2">
                <ActionButton variant="secondary" onClick={() => setModal(null)}>
                  Cancel
                </ActionButton>
                <ActionButton type="submit">Save</ActionButton>
              </div>
            </form>
          )}

          {modal.type === "user" && (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {getUserName(modal.data)}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {modal.data.email || "No email"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pill className={roleClass(modal.data.role)}>
                    {modal.data.role || "user"}
                  </Pill>
                  <Pill className={activeClass(isActive(modal.data))}>
                    {isActive(modal.data) ? "active" : "inactive"}
                  </Pill>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Field label="Full Name / Company" value={getUserName(modal.data)} />
                <Field label="Status" value={getStatus(modal.data)} />
                <Field label="Major" value={modal.data.major} />
                <Field label="Skills" value={Array.isArray(modal.data.skills) ? modal.data.skills.join(", ") : modal.data.skills} />
                <Field label="Biography" value={modal.data.biography || modal.data.companyBio} />
                <Field label="Linked Courses" value={Array.isArray(modal.data.courses) ? modal.data.courses.join(", ") : modal.data.courses} />
                <Field label="Address" value={modal.data.address} />
                <Field label="Contact" value={modal.data.contactInfo} />
              </div>
            </>
          )}

          {modal.type === "project" && (
            <>
              <h2 className="text-xl font-semibold text-slate-900">
                {modal.data.title || "Untitled project"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {modal.data.description || "No description was added."}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Field label="Course" value={modal.data.course} />
                <Field label="Instructor" value={modal.data.courseInstructor} />
                <Field label="Creator" value={modal.data.creatorName} />
                <Field label="Created" value={getCreatedAt(modal.data)} />
                <Field label="Rating" value={`${getRating(modal.data)}/5`} />
                <Field label="Visibility" value={modal.data.isPublic ? "Public" : "Private"} />
              </div>
              {modal.data.flagged && (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  Flag reason: {modal.data.flagReason || "No reason provided."}
                </div>
              )}
              {modal.data.appeal && (
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-800">Student Appeal</p>
                  <p className="mt-1 text-sm text-amber-700">{modal.data.appeal}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ActionButton
                      onClick={() => {
                        updateProject(modal.data, {
                          flagged: false,
                          flagReason: "",
                          appeal: "",
                          active: true,
                        });
                        setModal(null);
                      }}
                    >
                      Accept Appeal
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      onClick={() => {
                        updateProject(modal.data, { appeal: "", appealStatus: "rejected" });
                        setModal(null);
                      }}
                    >
                      Reject Appeal
                    </ActionButton>
                  </div>
                </div>
              )}
            </>
          )}

          {modal.type === "portfolio" && (
            <>
              <h2 className="text-xl font-semibold text-slate-900">{modal.data.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{modal.data.email}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Field label="Major" value={modal.data.major} />
                <Field label="Projects" value={modal.data.projects.length} />
                <Field
                  label="Skills"
                  value={modal.data.skills.length ? modal.data.skills.join(", ") : "Not recorded"}
                />
                <Field label="LinkedIn" value={modal.data.student.linkedin} />
              </div>
              <div className="mt-5 space-y-3">
                {modal.data.projects.map((project) => (
                  <div key={projectKey(project)} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{project.title || "Untitled project"}</p>
                    <p className="mt-1 text-sm text-slate-500">{project.course || "No course"}</p>
                  </div>
                ))}
                {modal.data.projects.length === 0 && <EmptyState>No projects on this portfolio.</EmptyState>}
              </div>
            </>
          )}

          {modal.type !== "admin" && modal.type !== "course" && (
            <div className="mt-6 flex justify-end">
              <ActionButton variant="secondary" onClick={() => setModal(null)}>
                Close
              </ActionButton>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!currentAdmin) return null;

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-slate-900 antialiased">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-amber-200/70 blur-3xl" />
        <div className="absolute right-[-6%] top-20 h-[360px] w-[360px] rounded-full bg-emerald-200/60 blur-3xl" />
        <div className="absolute bottom-[6%] left-[-8%] h-[340px] w-[340px] rounded-full bg-sky-100/70 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.22),transparent_55%),radial-gradient(circle_at_20%_70%,rgba(251,191,36,0.25),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700 shadow-sm">
                Admin Console
              </div>
              <h1 className="text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
                ProjectFolio control room
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
                Review employers, manage users and courses, moderate projects, and keep platform operations connected.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-sm">
                <p className="font-semibold text-slate-900">{getUserName(currentAdmin)}</p>
                <p className="text-xs text-slate-500">{currentAdmin.email}</p>
              </div>
              <Pill className={unreadCount ? statusClass("pending") : statusClass("accepted")}>
                {unreadCount} unread
              </Pill>
              <ActionButton variant="dark" onClick={signOut}>
                Sign Out
              </ActionButton>
            </div>
          </div>
        </header>

        <nav className="mb-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white/70 p-1 shadow-sm backdrop-blur">
          <div className="flex min-w-max gap-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition ${
                  activeTab === tab
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-500 hover:bg-white hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </nav>

        <main>{renderActiveTab()}</main>
      </div>

      {renderModal()}
    </div>
  );
}

export default AdminDashboard;
