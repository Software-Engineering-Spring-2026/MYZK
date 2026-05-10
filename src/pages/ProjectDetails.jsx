import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const MOCK_USERS = [
  { id: "u2", email: "sara@guc.com", firstName: "Sara", lastName: "Ahmed", role: "student" },
  { id: "u3", email: "karim@guc.com", firstName: "Karim", lastName: "Nasser", role: "student" },
  { id: "u4", email: "dr.ali@guc.com", firstName: "Ali", lastName: "Mahmoud", role: "instructor" },
  { id: "u5", email: "dr.heba@guc.com", firstName: "Heba", lastName: "Youssef", role: "instructor" },
  { id: "u6", email: "nour@guc.com", firstName: "Nour", lastName: "Ibrahim", role: "student" },
];

const MOCK_PROJECT = {
  id: "demo",
  title: "Smart Campus Navigation System",
  description: "A mobile application that helps students navigate the GUC campus using augmented reality and real-time occupancy data.",
  course: "Bachelor Project",
  isPublic: true,
  creatorId: "u1",
  creatorName: "Ahmed Hassan",
  collaborators: [
    { userId: "u2", email: "sara@guc.com", firstName: "Sara", lastName: "Ahmed", status: "accepted" },
    { userId: "u3", email: "karim@guc.com", firstName: "Karim", lastName: "Nasser", status: "pending" },
  ],
  instructors: [
    { userId: "u4", email: "dr.ali@guc.com", firstName: "Ali", lastName: "Mahmoud", status: "accepted" },
  ],
  tasks: [
    { id: "t1", title: "Setup project repository", description: "Initialize Git and project structure", assignedTo: "u1", assigneeName: "Ahmed Hassan", status: "completed", deadline: "2026-04-01", order: 0, instructorComment: "Good start, keep the README updated." },
    { id: "t2", title: "Design database schema", description: "Create ER diagram and define all tables", assignedTo: "u2", assigneeName: "Sara Ahmed", status: "pending", deadline: "2026-05-15", order: 1, instructorComment: "" },
    { id: "t3", title: "Implement AR navigation module", description: "Build core AR rendering using ARCore", assignedTo: "u1", assigneeName: "Ahmed Hassan", status: "postponed", deadline: "2026-05-30", order: 2, instructorComment: "" },
  ],
  thesisDrafts: [
    { id: "d1", name: "Draft 1 - Initial Proposal.pdf", isFinal: false, isPrivate: false, uploadedAt: "2026-03-15", instructorComment: "Good introduction but needs a stronger methodology section." },
    { id: "d2", name: "Draft 2 - Revised Methodology.pdf", isFinal: true, isPrivate: false, uploadedAt: "2026-04-20", instructorComment: "" },
  ],
  githubLink: "https://github.com/ahmed/smart-campus",
  demoVideo: "",
  languages: ["React Native", "Node.js", "PostgreSQL"],
  rating: 4,
  instructorFeedback: "Strong project concept with a clear implementation plan. The AR integration is innovative and well-scoped.",
  flagged: false,
  flagReason: "",
  appeal: "",
  tags: ["AR", "IoT", "Navigation"],
};

const COURSES = [
  "Bachelor Project","Software Engineering","Operating Systems","Machine Learning",
  "Embedded Systems","Database Systems","Computer Networks","Artificial Intelligence",
  "Mobile Development","Cyber Security","Data Structures","Algorithms",
];

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  })();
  const role = user?.role || "student";
  const currentUser = user || { id: "u1", email: "ahmed@guc.com", firstName: "Ahmed", lastName: "Hassan" };

  const [project, setProject] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("projects") || "[]");
      return stored.find(p => p.id === id) || { ...MOCK_PROJECT, id };
    } catch { return { ...MOCK_PROJECT, id }; }
  });

  const [notifications, setNotifications] = useState(() => {
    try { return JSON.parse(localStorage.getItem("notifications") || "[]"); } catch { return []; }
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", assignedTo: "", assigneeName: "", status: "pending", deadline: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDraftModal, setShowDraftModal] = useState(false);
const [draftFile, setDraftFile] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentTarget, setCommentTarget] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealText, setAppealText] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editLangInput, setEditLangInput] = useState("");
  const [editTagInput, setEditTagInput] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [invitations, setInvitations] = useState(() => {
    try { return JSON.parse(localStorage.getItem("myInvitations") || "[]"); } catch { return []; }
  });

  const isStudent = role === "student";
  const isInstructor = role === "instructor";
  const isCreator = project.creatorId === currentUser.email;
  const isBachelorProject = project.course === "Bachelor Project";
  const isCollaborator = project.collaborators?.some(c => c.userId === currentUser.id && c.status === "accepted");
  const isProjectInstructor = project.instructors?.some(i => i.userId === currentUser.id && i.status === "accepted");
  const canSeeComments = isCreator || isCollaborator || isProjectInstructor || isInstructor;

  const saveProject = (updated) => {
    setProject(updated);
    try {
      const stored = JSON.parse(localStorage.getItem("projects") || "[]");
      const idx = stored.findIndex(p => p.id === updated.id);
      if (idx >= 0) stored[idx] = updated; else stored.push(updated);
      localStorage.setItem("projects", JSON.stringify(stored));
    } catch {}
  };

  const addNotification = (userId, message) => {
    const notif = { id: Date.now().toString(), userId, message, read: false, createdAt: new Date().toISOString() };
    const updated = [...notifications, notif];
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const toggleVisibility = () => saveProject({ ...project, isPublic: !project.isPublic });

  const openCreateTask = () => {
    setEditingTask(null);
    setTaskForm({ title: "", description: "", assignedTo: "", assigneeName: "", status: "pending", deadline: "" });
    setShowTaskModal(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({ ...task });
    setShowTaskModal(true);
  };

  const saveTask = () => {
    if (!taskForm.title.trim()) return;
    let updated;
    if (editingTask) {
      updated = { ...project, tasks: project.tasks.map(t => t.id === editingTask.id ? { ...taskForm, id: editingTask.id, order: editingTask.order, instructorComment: editingTask.instructorComment } : t) };
    } else {
      const newTask = { ...taskForm, id: Date.now().toString(), order: project.tasks.length, instructorComment: "" };
      updated = { ...project, tasks: [...project.tasks, newTask] };
    }
    saveProject(updated);
    setShowTaskModal(false);
  };

  const deleteTask = (taskId) => saveProject({ ...project, tasks: project.tasks.filter(t => t.id !== taskId) });

  const updateTaskStatus = (taskId, status) =>
    saveProject({ ...project, tasks: project.tasks.map(t => t.id === taskId ? { ...t, status } : t) });

  const reorderTask = (index, dir) => {
    const tasks = [...project.tasks].sort((a, b) => a.order - b.order);
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= tasks.length) return;
    [tasks[index], tasks[target]] = [tasks[target], tasks[index]];
    tasks.forEach((t, i) => (t.order = i));
    saveProject({ ...project, tasks });
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    const lower = q.toLowerCase();
    const alreadyAdded = [
      ...(project.collaborators || []).map(c => c.userId),
      ...(project.instructors || []).map(i => i.userId),
    ];
    setSearchResults(
      MOCK_USERS.filter(u =>
        u.id !== currentUser.id &&
        !alreadyAdded.includes(u.id) &&
        (u.email.toLowerCase().includes(lower) ||
          u.firstName.toLowerCase().includes(lower) ||
          u.lastName.toLowerCase().includes(lower))
      )
    );
  };

  const sendInvitation = (user) => {
    const entry = { userId: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, status: "pending" };
    const updated = user.role === "instructor"
      ? { ...project, instructors: [...(project.instructors || []), entry] }
      : { ...project, collaborators: [...(project.collaborators || []), entry] };
    saveProject(updated);
    addNotification(user.id, `You have been invited to join the project "${project.title}"`);
    setSearchResults(prev => prev.filter(r => r.id !== user.id));
  };

  const cancelInvitation = (userId, type) => {
    const updated = type === "instructor"
      ? { ...project, instructors: project.instructors.filter(i => i.userId !== userId) }
      : { ...project, collaborators: project.collaborators.filter(c => c.userId !== userId) };
    saveProject(updated);
  };

const removeCollaborator = (userId) => {
  const updatedProject = {
    ...project,
    collaborators: project.collaborators.filter(
      (c) => c.userId !== userId
    ),
  };

  saveProject(updatedProject);

  addNotification(
    userId,
    `You were removed from the project "${project.title}"`
  );
};

 const uploadDraft = () => {
  if (!draftFile) return;

  const draft = {
    id: Date.now().toString(),
    name: draftFile.name,
    fileUrl: URL.createObjectURL(draftFile),
    isFinal: false,
    isPrivate: false,
    uploadedAt: new Date().toISOString().split("T")[0],
    instructorComment: "",
  };

  saveProject({
    ...project,
    thesisDrafts: [...(project.thesisDrafts || []), draft],
  });

  setDraftFile(null);
  setShowDraftModal(false);
};

  const selectFinalDraft = (draftId) => {
    const updatedDrafts = project.thesisDrafts.map(d => ({
      ...d,
      isFinal: d.id === draftId,
      isPrivate: d.id !== draftId,
    }));
    saveProject({ ...project, thesisDrafts: updatedDrafts });
  };

  const openComment = (type, targetId, existing = "") => {
    setCommentTarget({ type, targetId });
    setCommentText(existing);
    setShowCommentModal(true);
  };

  const saveComment = () => {
    if (!commentTarget) return;
    let updated = { ...project };
    if (commentTarget.type === "task") {
      updated.tasks = project.tasks.map(t => t.id === commentTarget.targetId ? { ...t, instructorComment: commentText } : t);
    } else if (commentTarget.type === "draft") {
      updated.thesisDrafts = project.thesisDrafts.map(d => d.id === commentTarget.targetId ? { ...d, instructorComment: commentText } : d);
    } else {
      updated.instructorFeedback = commentText;
    }
    saveProject(updated);
    addNotification(project.creatorId, `New feedback was added to your project "${project.title}"`);
    setShowCommentModal(false);
  };

  const deleteComment = (type, targetId) => {
    let updated = { ...project };
    if (type === "task") updated.tasks = project.tasks.map(t => t.id === targetId ? { ...t, instructorComment: "" } : t);
    else if (type === "draft") updated.thesisDrafts = project.thesisDrafts.map(d => d.id === targetId ? { ...d, instructorComment: "" } : d);
    else updated.instructorFeedback = "";
    saveProject(updated);
  };

  const submitFlag = () => {
    if (!flagReason.trim()) return;
    saveProject({ ...project, flagged: true, flagReason, appeal: "" });
    addNotification(project.creatorId, `Your project "${project.title}" has been flagged. Reason: ${flagReason}`);
    setShowFlagModal(false);
    setFlagReason("");
  };

  const submitAppeal = () => {
    if (!appealText.trim()) return;
    saveProject({ ...project, appeal: appealText });
    setShowAppealModal(false);
    setAppealText("");
  };

  const openEditProject = () => {
    setEditForm({
      title: project.title,
      Report: project.description,
      course: project.course,
      githubLink: project.githubLink || "",
      demoVideo: project.demoVideo || "",
      languages: [...(project.languages || [])],
      tags: [...(project.tags || [])],
    });
    setEditLangInput("");
    setEditTagInput("");
    setShowEditModal(true);
  };

  const saveEditProject = () => {
    if (!editForm.title.trim() || !editForm.description.trim() || !editForm.course) return;
    saveProject({ ...project, ...editForm });
    setShowEditModal(false);
  };

  const deleteProject = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("projects") || "[]");
      localStorage.setItem("projects", JSON.stringify(stored.filter(p => p.id !== project.id)));
    } catch {}
    navigate("/home");
  };

  const handleInvitationResponse = (invId, response) => {
    const updated = invitations.map(inv => inv.id === invId ? { ...inv, status: response } : inv);
    setInvitations(updated);
    localStorage.setItem("myInvitations", JSON.stringify(updated));
  };

  const sortedTasks = [...(project.tasks || [])].sort((a, b) => a.order - b.order);

  const statusColor = {
    pending: "bg-amber-100 text-amber-700",
    postponed: "bg-slate-100 text-slate-600",
    completed: "bg-emerald-100 text-emerald-700",
  };
  const inviteColor = {
    accepted: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-600",
    pending: "bg-amber-100 text-amber-700",
  };

  const myNotifications = notifications.filter(n => n.userId === currentUser.id);
  const unreadCount = myNotifications.filter(n => !n.read).length;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "tasks", label: "Tasks" },
    { id: "collaborators", label: "Collaborators" },
    ...(isBachelorProject ? [{ id: "thesis", label: "Thesis Drafts" }] : []),
    ...(isStudent || isInstructor ? [{ id: "invitations", label: "Invitations" }] : []),
    ...(isStudent || isInstructor ? [{ id: "notifications", label: unreadCount > 0 ? `Notifications (${unreadCount})` : "Notifications" }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-slate-900 antialiased">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-amber-200/70 blur-3xl" />
        <div className="absolute right-[-6%] top-20 h-[360px] w-[360px] rounded-full bg-emerald-200/60 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link to="/home" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to projects
        </Link>

        {/* ── HEADER CARD ── */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{project.course}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${project.isPublic ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-600"}`}>
                  {project.isPublic ? "Public" : "Private"}
                </span>
                {project.flagged && <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">Flagged</span>}
              </div>
              <h1 className="text-3xl font-semibold leading-tight text-slate-900">{project.title}</h1>
              <p className="mt-2 leading-relaxed text-slate-600">{project.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tags?.map(tag => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{tag}</span>
                ))}
              </div>
              <p className="mt-3 text-sm text-slate-500">
                Created by <span className="font-medium text-slate-700">{project.creatorName}</span>
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3">
              {/* Star rating — visible to all, clickable for instructors */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <svg
                    key={s}
                    viewBox="0 0 24 24"
                    className={`h-5 w-5 transition ${(hoveredStar || project.rating || 0) >= s ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
                    onMouseEnter={() => isInstructor && setHoveredStar(s)}
                    onMouseLeave={() => isInstructor && setHoveredStar(0)}
                    onClick={() => isInstructor && saveProject({ ...project, rating: s })}
                    style={{ cursor: isInstructor ? "pointer" : "default" }}
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-slate-500">{project.rating ? `${project.rating}/5` : "No rating"}</span>
                {isInstructor && <span className="ml-1 text-xs text-slate-400">(click to rate)</span>}
              </div>

              {/* Visibility toggle — creator student only */}
              {isCreator && isStudent && (
                <button
                  onClick={toggleVisibility}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${project.isPublic ? "bg-sky-50 text-sky-700 hover:bg-sky-100" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  <span className={`h-2 w-2 rounded-full ${project.isPublic ? "bg-sky-500" : "bg-slate-400"}`} />
                  {project.isPublic ? "Set Private" : "Set Public"}
                </button>
              )}

              {/* Edit / Delete — creator only */}
              {isCreator && (
                <>
                  <button onClick={openEditProject} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
                    Edit Project
                  </button>
                  <button onClick={() => setShowDeleteConfirm(true)} className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">
                    Delete Project
                  </button>
                </>
              )}

              {/* Flag / unflag — instructor & admin */}
              {(isInstructor || role === "admin") && !project.flagged && (
                <button onClick={() => setShowFlagModal(true)} className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">
                  Flag Project
                </button>
              )}
              {(isInstructor || role === "admin") && project.flagged && (
                <button onClick={() => saveProject({ ...project, flagged: false, flagReason: "", appeal: "" })} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200">
                  Remove Flag
                </button>
              )}

              {/* Appeal — student, flagged, no appeal yet */}
              {isStudent && project.flagged && !project.appeal && (
                <button onClick={() => setShowAppealModal(true)} className="rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100">
                  Send Appeal
                </button>
              )}
              {isStudent && project.flagged && project.appeal && (
                <span className="rounded-full bg-emerald-50 px-4 py-2 text-center text-sm font-medium text-emerald-700">Appeal Sent</span>
              )}
            </div>
          </div>

          {/* Flagged banner */}
          {project.flagged && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">This project has been flagged and deactivated</p>
              <p className="mt-1 text-sm text-red-600">Reason: {project.flagReason}</p>
              {project.appeal && (
                <div className="mt-3 rounded-xl border border-slate-200 bg-white/70 p-3">
                  <p className="text-xs font-semibold text-slate-600">Student's Appeal:</p>
                  <p className="mt-1 text-sm text-slate-700">{project.appeal}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── TABS ── */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white/60 p-1 backdrop-blur">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-white text-slate-900 shadow" : "text-slate-500 hover:text-slate-700"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══ OVERVIEW ══ */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Project Info</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Course", value: project.course },
                  { label: "Created", value: project.createdAt || "—" },
                  { label: "Active Collaborators", value: project.collaborators?.filter(c => c.status === "accepted").length || 0 },
                  { label: "Tasks Completed", value: `${project.tasks?.filter(t => t.status === "completed").length || 0} / ${project.tasks?.length || 0}` },
                ].map(item => (
                  <div key={item.label} className="rounded-2xl border border-slate-100 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{item.label}</p>
                    <p className="mt-1 font-medium text-slate-800">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Languages */}
              {(project.languages?.length > 0) && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Programming Languages / Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {project.languages.map(lang => (
                      <span key={lang} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">{lang}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* GitHub & Demo Video links */}
              {(project.githubLink || project.demoVideo) && (
                <div className="mt-5 flex flex-wrap gap-3">
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-slate-500">
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      GitHub Repository
                    </a>
                  )}
                  {project.demoVideo && (
                    <a href={project.demoVideo} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-slate-500">
                        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                      Demo Video
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Instructor feedback — visible to project members */}
            {(canSeeComments || isInstructor) && (
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Instructor Feedback</h2>
                  {isInstructor && (
                    <div className="flex gap-2">
                      <button onClick={() => openComment("project", "general", project.instructorFeedback)} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100">
                        {project.instructorFeedback ? "Edit" : "Add Feedback"}
                      </button>
                      {project.instructorFeedback && (
                        <button onClick={() => deleteComment("project", "general")} className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-500 transition hover:bg-red-100">
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {project.instructorFeedback
                  ? <p className="leading-relaxed text-slate-700">{project.instructorFeedback}</p>
                  : <p className="text-sm italic text-slate-400">No feedback yet.</p>}
              </div>
            )}
          </div>
        )}

        {/* ══ TASKS ══ */}
        {activeTab === "tasks" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Task List</h2>
              {isCreator && (
                <button onClick={openCreateTask} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-500">
                  + New Task
                </button>
              )}
            </div>

            {sortedTasks.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-12 text-center">
                <p className="text-slate-400">{isCreator ? "No tasks yet — add your first one." : "No tasks yet."}</p>
              </div>
            ) : sortedTasks.map((task, index) => (
              <div key={task.id} className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:shadow-md">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor[task.status]}`}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                      {task.deadline && <span className="text-xs text-slate-400">Due: {task.deadline}</span>}
                      <span className="text-xs text-slate-400">#{index + 1}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900">{task.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Assigned to: <span className="text-slate-600">{task.assigneeName || "Unassigned"}</span>
                    </p>
                    {task.instructorComment && canSeeComments && (
                      <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                        <p className="text-xs font-semibold text-emerald-700">Instructor Comment:</p>
                        <p className="mt-1 text-sm text-slate-700">{task.instructorComment}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {isCreator && (
                      <div className="flex gap-1">
                        <button onClick={() => reorderTask(index, "up")} disabled={index === 0} title="Move up" className="rounded-lg bg-slate-100 p-1.5 text-slate-500 transition hover:bg-slate-200 disabled:opacity-30">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5"><path d="M18 15l-6-6-6 6" /></svg>
                        </button>
                        <button onClick={() => reorderTask(index, "down")} disabled={index === sortedTasks.length - 1} title="Move down" className="rounded-lg bg-slate-100 p-1.5 text-slate-500 transition hover:bg-slate-200 disabled:opacity-30">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5"><path d="M6 9l6 6 6-6" /></svg>
                        </button>
                      </div>
                    )}

                    {(isCreator || (isCollaborator && task.assignedTo === currentUser.id)) && (
                      <select value={task.status} onChange={e => updateTaskStatus(task.id, e.target.value)} className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/40">
                        <option value="pending">Pending</option>
                        <option value="postponed">Postponed</option>
                        <option value="completed">Completed</option>
                      </select>
                    )}

                    {isCreator && (
                      <>
                        <button onClick={() => openEditTask(task)} className="rounded-xl bg-slate-100 px-3 py-1 text-xs text-slate-600 transition hover:bg-slate-200">Edit</button>
                        <button onClick={() => deleteTask(task.id)} className="rounded-xl bg-red-50 px-3 py-1 text-xs text-red-500 transition hover:bg-red-100">Delete</button>
                      </>
                    )}

                    {isInstructor && (
                      <div className="flex gap-1">
                        <button onClick={() => openComment("task", task.id, task.instructorComment)} className="rounded-xl bg-emerald-50 px-3 py-1 text-xs text-emerald-700 transition hover:bg-emerald-100">
                          {task.instructorComment ? "Edit Comment" : "Comment"}
                        </button>
                        {task.instructorComment && (
                          <button onClick={() => deleteComment("task", task.id)} className="rounded-xl bg-red-50 px-3 py-1 text-xs text-red-500 transition hover:bg-red-100">Remove</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ COLLABORATORS ══ */}
        {activeTab === "collaborators" && (
          <div className="space-y-6">
            {!isBachelorProject && (
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Collaborators</h2>
                {(project.collaborators?.length || 0) === 0
                  ? <p className="text-sm italic text-slate-400">No collaborators yet.</p>
                  : (
                    <div className="space-y-3">
                      {project.collaborators.map(c => (
                        <div key={c.userId} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4">
                          <div>
                            <p className="font-medium text-slate-900">{c.firstName} {c.lastName}</p>
                            <p className="text-xs text-slate-400">{c.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${inviteColor[c.status]}`}>
                              {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                            </span>
                            {isCreator && c.status === "accepted" && (
                              <button onClick={() => removeCollaborator(c.userId)} className="rounded-full bg-red-50 px-3 py-1 text-xs text-red-500 transition hover:bg-red-100">Remove</button>
                            )}
                            {isCreator && c.status === "pending" && (
                              <button onClick={() => cancelInvitation(c.userId, "collaborator")} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 transition hover:bg-slate-200">Cancel</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}

            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Course Instructors</h2>
              {(project.instructors?.length || 0) === 0
                ? <p className="text-sm italic text-slate-400">No instructors added yet.</p>
                : (
                  <div className="space-y-3">
                    {project.instructors.map(i => (
                      <div key={i.userId} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4">
                        <div>
                          <p className="font-medium text-slate-900">{i.firstName} {i.lastName}</p>
                          <p className="text-xs text-slate-400">{i.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${inviteColor[i.status]}`}>
                            {i.status.charAt(0).toUpperCase() + i.status.slice(1)}
                          </span>
                          {isCreator && (
                            <button onClick={() => cancelInvitation(i.userId, "instructor")} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 transition hover:bg-slate-200">Remove</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {isCreator && (
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                <h2 className="mb-1 text-lg font-semibold text-slate-900">
                  {isBachelorProject ? "Invite Course Instructor" : "Invite Collaborators / Instructors"}
                </h2>
                {isBachelorProject && (
                  <p className="mb-4 text-sm text-slate-500">Bachelor projects have no collaborators — only course instructors can be invited.</p>
                )}
                <input
                  type="text"
                  placeholder="Search by email, first name, or last name..."
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-inner transition focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
                {searchResults.filter(u => !isBachelorProject || u.role === "instructor").length > 0 && (
                  <div className="mt-3 space-y-2">
                    {searchResults.filter(u => !isBachelorProject || u.role === "instructor").map(u => (
                      <div key={u.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4">
                        <div>
                          <p className="font-medium text-slate-900">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-slate-400">{u.email} · <span className="capitalize">{u.role}</span></p>
                        </div>
                        <button onClick={() => sendInvitation(u)} className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500">
                          Invite
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {searchQuery.trim() && searchResults.filter(u => !isBachelorProject || u.role === "instructor").length === 0 && (
                  <p className="mt-3 text-sm italic text-slate-400">No users found.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══ THESIS DRAFTS ══ */}
        {activeTab === "thesis" && isBachelorProject && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Thesis Drafts</h2>
              {isCreator && (
                <button onClick={() => setShowDraftModal(true)} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-500">
                  + Upload Draft
                </button>
              )}
            </div>

            {(project.thesisDrafts?.length || 0) === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-12 text-center">
                <p className="text-slate-400">No thesis drafts uploaded yet.</p>
              </div>
            ) : project.thesisDrafts.filter(d => !d.isPrivate || isCreator || isProjectInstructor || isInstructor).map(draft => (
              <div key={draft.id} className={`rounded-2xl border p-5 backdrop-blur transition hover:shadow-md ${draft.isFinal ? "border-emerald-300 bg-emerald-50/80" : "border-slate-200 bg-white/80"}`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      {draft.isFinal && <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">Final Draft</span>}
                      {draft.isPrivate && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-500">Private</span>}
                      <span className="text-xs text-slate-400">{draft.uploadedAt}</span>
                    </div>
                    <a
  href={draft.fileUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="font-medium text-emerald-600 transition hover:underline"
>
  {draft.name}
</a>
                    {draft.instructorComment && canSeeComments && (
                      <div className="mt-3 rounded-xl border border-slate-100 bg-white p-3">
                        <p className="text-xs font-semibold text-emerald-700">Instructor Comment:</p>
                        <p className="mt-1 text-sm text-slate-700">{draft.instructorComment}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {isCreator && !draft.isFinal && (
                      <button onClick={() => selectFinalDraft(draft.id)} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100">
                        Set as Final
                      </button>
                    )}
                    {isInstructor && (
                      <>
                        <button onClick={() => openComment("draft", draft.id, draft.instructorComment)} className="rounded-xl bg-emerald-50 px-3 py-1 text-xs text-emerald-700 transition hover:bg-emerald-100">
                          {draft.instructorComment ? "Edit Comment" : "Comment"}
                        </button>
                        {draft.instructorComment && (
                          <button onClick={() => deleteComment("draft", draft.id)} className="rounded-xl bg-red-50 px-3 py-1 text-xs text-red-500 transition hover:bg-red-100">Remove</button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ INVITATIONS ══ */}
        {activeTab === "invitations" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Project Invitations</h2>
            {invitations.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-12 text-center">
                <p className="text-slate-400">No invitations yet.</p>
              </div>
            ) : invitations.map(inv => (
              <div key={inv.id} className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">
                      Invitation to join <span className="text-emerald-700">"{inv.projectTitle || "a project"}"</span>
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">From: {inv.fromName || "Project creator"}</p>
                    {inv.createdAt && <p className="mt-0.5 text-xs text-slate-400">{inv.createdAt}</p>}
                  </div>
                  <div className="flex gap-2">
                    {inv.status === "pending" ? (
                      <>
                        <button onClick={() => handleInvitationResponse(inv.id, "accepted")} className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500">Accept</button>
                        <button onClick={() => handleInvitationResponse(inv.id, "rejected")} className="rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100">Reject</button>
                      </>
                    ) : (
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${inviteColor[inv.status]}`}>
                        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ NOTIFICATIONS ══ */}
        {activeTab === "notifications" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
            {myNotifications.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-12 text-center">
                <p className="text-slate-400">No notifications yet.</p>
              </div>
            ) : myNotifications.map(n => (
              <div key={n.id} className={`rounded-2xl border p-4 ${n.read ? "border-slate-100 bg-white/60" : "border-emerald-200 bg-emerald-50/80"}`}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-slate-700">{n.message}</p>
                  {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />}
                </div>
                <p className="mt-2 text-xs text-slate-400">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══════ MODALS ══════ */}

      {/* Task modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="mb-5 text-lg font-semibold text-slate-900">{editingTask ? "Edit Task" : "New Task"}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-600">Title</label>
                <input value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Task title" className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30" />
              </div>
              <div>
                <label className="text-sm text-slate-600">Description</label>
                <input value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="One-line description" className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30" />
              </div>
              {!isBachelorProject && (
                <div>
                  <label className="text-sm text-slate-600">Assign To</label>
                  <select
                    value={taskForm.assignedTo}
                    onChange={e => {
                      const pool = [
                        { id: currentUser.id, firstName: currentUser.firstName, lastName: currentUser.lastName },
                        ...(project.collaborators?.filter(c => c.status === "accepted") || []).map(c => ({ id: c.userId, firstName: c.firstName, lastName: c.lastName })),
                      ];
                      const u = pool.find(x => x.id === e.target.value);
                      setTaskForm({ ...taskForm, assignedTo: e.target.value, assigneeName: u ? `${u.firstName} ${u.lastName}` : "" });
                    }}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                  >
                    <option value="">Select person</option>
                    <option value={currentUser.id}>{currentUser.firstName} {currentUser.lastName} (you)</option>
                    {project.collaborators?.filter(c => c.status === "accepted").map(c => (
                      <option key={c.userId} value={c.userId}>{c.firstName} {c.lastName}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-600">Status</label>
                  <select value={taskForm.status} onChange={e => setTaskForm({ ...taskForm, status: e.target.value })} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30">
                    <option value="pending">Pending</option>
                    <option value="postponed">Postponed</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Deadline</label>
                  <input type="date" value={taskForm.deadline} onChange={e => setTaskForm({ ...taskForm, deadline: e.target.value })} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowTaskModal(false)} className="rounded-full px-4 py-2 text-sm text-slate-500 transition hover:bg-slate-100">Cancel</button>
              <button onClick={saveTask} className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500">Save Task</button>
            </div>
          </div>
        </div>
      )}

      {/* Comment modal */}
      {showCommentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              {commentTarget?.type === "project" ? "Project Feedback" : commentTarget?.type === "draft" ? "Draft Comment" : "Task Comment"}
            </h3>
            <p className="mb-4 text-sm text-slate-500">Visible to the project creator, collaborators, and assigned instructors.</p>
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Write your comment or feedback..."
              rows={4}
              className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowCommentModal(false)} className="rounded-full px-4 py-2 text-sm text-slate-500 transition hover:bg-slate-100">Cancel</button>
              <button onClick={saveComment} className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Draft upload modal */}
      {showDraftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Upload Thesis Draft</h3>
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 h-10 w-10 text-slate-300">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17,8 12,3 7,8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="mb-3 text-xs text-slate-400">Enter the draft file name</p>
              <p className="mb-3 text-xs text-slate-400">
  Upload your thesis draft file
</p>

<input
  type="file"
  accept=".pdf,.doc,.docx"
  onChange={(e) => setDraftFile(e.target.files[0])}
  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
/>

{draftFile && (
  <p className="mt-3 text-sm text-emerald-600">
    Selected: {draftFile.name}
  </p>
)}
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowDraftModal(false)} className="rounded-full px-4 py-2 text-sm text-slate-500 transition hover:bg-slate-100">Cancel</button>
              <button onClick={uploadDraft} className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500">Upload</button>
            </div>
          </div>
        </div>
      )}

      {/* Flag modal */}
      {showFlagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">Flag Project</h3>
            <p className="mb-4 text-sm text-slate-500">The project will be deactivated. The student will be notified and may submit an appeal.</p>
            <textarea
              value={flagReason}
              onChange={e => setFlagReason(e.target.value)}
              placeholder="Reason for flagging (e.g. plagiarism, policy violation)..."
              rows={3}
              className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-400/30"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowFlagModal(false)} className="rounded-full px-4 py-2 text-sm text-slate-500 transition hover:bg-slate-100">Cancel</button>
              <button onClick={submitFlag} className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600">Flag Project</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project modal */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="mb-5 text-lg font-semibold text-slate-900">Edit Project</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Title <span className="text-red-500">*</span></label>
                <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Report <span className="text-red-500">*</span></label>
                <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows={3} className="mt-1 w-full resize-none rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Course <span className="text-red-500">*</span></label>
                <select value={editForm.course} onChange={e => setEditForm({ ...editForm, course: e.target.value })} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30">
                  {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">GitHub Repository</label>
                <input value={editForm.githubLink} onChange={e => setEditForm({ ...editForm, githubLink: e.target.value })} placeholder="https://github.com/..." className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Demo Video URL</label>
                <input value={editForm.demoVideo} onChange={e => setEditForm({ ...editForm, demoVideo: e.target.value })} placeholder="https://youtube.com/..." className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Programming Languages / Tech Stack</label>
                <div className="mt-1 flex gap-2">
                  <input value={editLangInput} onChange={e => setEditLangInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); const v = editLangInput.trim(); if (v && !editForm.languages.includes(v)) { setEditForm({ ...editForm, languages: [...editForm.languages, v] }); setEditLangInput(""); } } }}
                    placeholder="e.g. Python" className="flex-1 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30" />
                  <button type="button" onClick={() => { const v = editLangInput.trim(); if (v && !editForm.languages.includes(v)) { setEditForm({ ...editForm, languages: [...editForm.languages, v] }); setEditLangInput(""); } }} className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200">Add</button>
                </div>
                {editForm.languages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {editForm.languages.map(lang => (
                      <span key={lang} className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        {lang}
                        <button type="button" onClick={() => setEditForm({ ...editForm, languages: editForm.languages.filter(l => l !== lang) })} className="ml-0.5 text-blue-400 hover:text-blue-800">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Tags</label>
                <div className="mt-1 flex gap-2">
                  <input value={editTagInput} onChange={e => setEditTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); const v = editTagInput.trim(); if (v && !editForm.tags.includes(v)) { setEditForm({ ...editForm, tags: [...editForm.tags, v] }); setEditTagInput(""); } } }}
                    placeholder="e.g. AR" className="flex-1 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30" />
                  <button type="button" onClick={() => { const v = editTagInput.trim(); if (v && !editForm.tags.includes(v)) { setEditForm({ ...editForm, tags: [...editForm.tags, v] }); setEditTagInput(""); } }} className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200">Add</button>
                </div>
                {editForm.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {editForm.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                        {tag}
                        <button type="button" onClick={() => setEditForm({ ...editForm, tags: editForm.tags.filter(t => t !== tag) })} className="ml-0.5 text-emerald-500 hover:text-emerald-800">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="rounded-full px-4 py-2 text-sm text-slate-500 transition hover:bg-slate-100">Cancel</button>
              <button onClick={saveEditProject} className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">Delete Project?</h3>
            <p className="mb-6 text-sm text-slate-500">This will permanently delete <span className="font-semibold text-slate-700">"{project.title}"</span> and all its data. This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="rounded-full px-4 py-2 text-sm text-slate-500 transition hover:bg-slate-100">Cancel</button>
              <button onClick={deleteProject} className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Appeal modal */}
      {showAppealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">Send Appeal</h3>
            <p className="mb-4 text-sm text-slate-500">Explain your point of view. Keep it concise and factual.</p>
            <textarea
              value={appealText}
              onChange={e => setAppealText(e.target.value)}
              placeholder="Your appeal message..."
              rows={3}
              className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowAppealModal(false)} className="rounded-full px-4 py-2 text-sm text-slate-500 transition hover:bg-slate-100">Cancel</button>
              <button onClick={submitAppeal} className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-600">Submit Appeal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;
