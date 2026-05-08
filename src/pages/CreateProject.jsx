import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const COURSES = [
  "Bachelor Project",
  "Software Engineering",
  "Operating Systems",
  "Machine Learning",
  "Embedded Systems",
  "Database Systems",
  "Computer Networks",
  "Artificial Intelligence",
  "Mobile Development",
  "Cyber Security",
  "Data Structures",
  "Algorithms",
];

function CreateProject() {
  const navigate = useNavigate();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  })();

  const [form, setForm] = useState({
    title: "",
    description: "",
    course: "",
    isPublic: true,
    tagInput: "",
    tags: [],
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const addTag = () => {
    const tag = form.tagInput.trim();
    if (!tag || form.tags.includes(tag)) return;
    setForm((prev) => ({ ...prev, tags: [...prev.tags, tag], tagInput: "" }));
  };

  const removeTag = (tag) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); addTag(); }
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (!form.description.trim()) next.description = "Description is required";
    if (!form.course) next.course = "Please select a course";
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) { setErrors(next); return; }

    const newProject = {
      id: Date.now().toString(),
      title: form.title.trim(),
      description: form.description.trim(),
      course: form.course,
      isPublic: form.isPublic,
      tags: form.tags,
      creatorId: user?.id || "",
      creatorName: user ? `${user.firstName} ${user.lastName}` : "Unknown",
      createdAt: new Date().toISOString().split("T")[0],
      collaborators: [],
      instructors: [],
      tasks: [],
      thesisDrafts: [],
      rating: null,
      instructorFeedback: "",
      flagged: false,
      flagReason: "",
      appeal: "",
    };

    const stored = JSON.parse(localStorage.getItem("projects") || "[]");
    stored.push(newProject);
    localStorage.setItem("projects", JSON.stringify(stored));

    navigate(`/project/${newProject.id}`);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-slate-900 antialiased">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-amber-200/70 blur-3xl" />
        <div className="absolute right-[-6%] top-20 h-[360px] w-[360px] rounded-full bg-emerald-200/60 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-12 sm:px-6">
        {/* Back */}
        <Link to="/home" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to home
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur">
          {/* Header */}
          <div className="mb-8">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700">
              New Project
            </span>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Create a project</h1>
            <p className="mt-1 text-sm text-slate-500">
              Fill in the details below. You can add collaborators, tasks, and thesis drafts from the project page.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Smart Campus Navigation System"
                className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30 ${errors.title ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-emerald-300"}`}
              />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="What is this project about? What problem does it solve?"
                rows={4}
                className={`w-full resize-none rounded-2xl border px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30 ${errors.description ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-emerald-300"}`}
              />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
            </div>

            {/* Course */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                name="course"
                value={form.course}
                onChange={handleChange}
                className={`w-full rounded-2xl border px-4 py-3 text-sm bg-slate-50 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30 ${form.course ? "text-slate-900" : "text-slate-400"} ${errors.course ? "border-red-300 focus:border-red-400" : "border-slate-200 focus:border-emerald-300"}`}
              >
                <option value="">Select a course...</option>
                {COURSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.course && <p className="mt-1 text-xs text-red-500">{errors.course}</p>}
              {form.course === "Bachelor Project" && (
                <p className="mt-1.5 text-xs text-emerald-700 font-medium">
                  Thesis draft uploads will be available on the project page.
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Tags</label>
              <div className="flex gap-2">
                <input
                  name="tagInput"
                  value={form.tagInput}
                  onChange={handleChange}
                  onKeyDown={handleTagKeyDown}
                  placeholder="e.g. React, Node.js, AR"
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 transition focus:bg-white focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
                >
                  Add
                </button>
              </div>
              {form.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-0.5 text-emerald-500 hover:text-emerald-800">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Visibility */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Visibility</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, isPublic: true }))}
                  className={`flex flex-1 items-center gap-3 rounded-2xl border p-4 text-sm transition ${form.isPublic ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${form.isPublic ? "bg-emerald-500" : "bg-slate-300"}`} />
                  <div className="text-left">
                    <p className="font-semibold">Public</p>
                    <p className="text-xs opacity-70">Visible to everyone on the platform</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, isPublic: false }))}
                  className={`flex flex-1 items-center gap-3 rounded-2xl border p-4 text-sm transition ${!form.isPublic ? "border-slate-400 bg-slate-100 text-slate-800" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${!form.isPublic ? "bg-slate-500" : "bg-slate-300"}`} />
                  <div className="text-left">
                    <p className="font-semibold">Private</p>
                    <p className="text-xs opacity-70">Only visible to you and collaborators</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <Link
                to="/home"
                className="flex-1 rounded-full border border-slate-200 bg-white py-3 text-center text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="flex-1 rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-500"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProject;
