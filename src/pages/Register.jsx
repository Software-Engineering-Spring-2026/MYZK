import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  // 🧠 STATE
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [role, setRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [taxDoc, setTaxDoc] = useState("");
  const [errors, setErrors] = useState({});

  // 🧠 ROLE DETECTION (email domain based)
  const detectRole = (email) => {
    const atIndex = email.indexOf("@");
    if (atIndex === -1) return ""; // Wait until email is meaningful

    const domain = email.slice(atIndex + 1).toLowerCase();
    if (!domain) return "";

    if (domain === "student.guc.edu.eg") return "student";
    if (domain === "guc.edu.eg") return "instructor";

    if ("student.guc.edu.eg".startsWith(domain) || "guc.edu.eg".startsWith(domain)) {
      return "";
    }

    if (!domain.includes(".")) return "";
    return "employer";
  };

  // 🧠 HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "email") {
      setErrors((prev) => ({
        ...prev,
        email: "",
        firstName: "",
        lastName: "",
        companyName: "",
        taxDoc: ""
      }));
      const nextRole = detectRole(value);

      setFormData((prev) => ({ ...prev, email: value }));
      setRole(nextRole);

      if (!nextRole) {
        setCompanyName("");
        setTaxDoc("");
        return;
      }

      if (nextRole === "employer") {
        setFormData((prev) => ({ ...prev, firstName: "", lastName: "" }));
      } else {
        // Employer-only fields are irrelevant for students/instructors
        setCompanyName("");
        setTaxDoc("");
      }
      return;
    }

    setErrors((prev) => ({ ...prev, [id]: "" }));
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // 🧠 FILE UPLOAD HANDLING (store file name only)
  const handleTaxDocChange = (e) => {
    const file = e.target.files?.[0];
    setTaxDoc(file ? file.name : "");
    setErrors((prev) => ({ ...prev, taxDoc: "" }));
  };

  const getRolePreview = (email) => {
    if (!email) return null;
    const detected = detectRole(email);
    if (!detected) return null;
    if (detected === "student") return "Student";
    if (detected === "instructor") return "Instructor";
    return "Employer";
  };

  // 🧠 HANDLE REGISTER
  const handleSubmit = (e) => {
    e.preventDefault();

    const { firstName, lastName, email, password, confirmPassword } = formData;

    // 🧠 ROLE DETECTION
    const currentRole = detectRole(email);

    if (!currentRole) {
      setErrors({ email: "Please enter a valid email" });
      return;
    }

    // ❌ Validation
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!currentRole) {
      nextErrors.email = "Enter a valid email domain";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      nextErrors.password = "Passwords do not match";
      nextErrors.confirmPassword = "Passwords do not match";
    }

    if (currentRole === "employer") {
      if (!companyName.trim()) {
        nextErrors.companyName = "Company name is required";
      }
      if (!taxDoc) {
        nextErrors.taxDoc = "Please upload tax document";
      }
    } else if (currentRole) {
      if (!firstName.trim()) {
        nextErrors.firstName = "First name is required";
      }
      if (!lastName.trim()) {
        nextErrors.lastName = "Last name is required";
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    // 🧠 GET USERS (fake DB)
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // ✅ Prevent duplicate users
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      setErrors({ email: "User already exists. Please login." });
      return;
    }

    // 🧠 CREATE USER (include required id for project system)
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      role: currentRole
    };

    if (currentRole === "employer") {
      // Employer-specific fields
      newUser.companyName = companyName;
      newUser.taxDocument = taxDoc;
    } else {
      newUser.firstName = firstName;
      newUser.lastName = lastName;
    }

    // 🧠 SAVE USER
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // 🧠 AUTO LOGIN
    localStorage.setItem("user", JSON.stringify(newUser));

    // 🧠 REDIRECT
    if (currentRole === "admin") {
      navigate("/admin");
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f4ee] text-slate-900 antialiased flex items-center justify-center p-4 sm:p-8">
      {/* Background Blurs from Landing Page */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-amber-200/70 blur-3xl"></div>
        <div className="absolute right-[-6%] top-20 h-[360px] w-[360px] rounded-full bg-emerald-200/60 blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.22),transparent_55%),radial-gradient(circle_at_20%_70%,rgba(251,191,36,0.25),transparent_55%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(15,23,42,0.08)_0%,transparent_45%,rgba(15,23,42,0.06)_70%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 max-w-5xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/40">

        {/* LEFT SIDE */}
        <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-emerald-50 to-slate-50 border-b md:border-b-0 md:border-r border-slate-100">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Create your account
          </h1>

          <p className="text-lg text-slate-600 mb-8">
            Join our platform to build your professional portfolio, showcase your best work, and connect with outstanding opportunities.
          </p>

          <div className="hidden md:block mt-auto text-sm text-slate-500">
            Already a member?{" "}
            <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
              Log in here
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">

          <form className="space-y-5 min-h-[500px]" onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                {role === "employer" ? "Company Email" : "Email Address"}
                <span className="text-red-500"> *</span>
              </label>

              <input
                id="email"
                type="email"
                required
                value={formData.email}
                placeholder="jane@example.com"
                onChange={handleChange}
                onBlur={() => {
                  if (!formData.email) return;
                  const users = JSON.parse(localStorage.getItem("users") || "[]");
                  if (users.some(u => u.email === formData.email)) {
                    setErrors(prev => ({ ...prev, email: "This email is already registered." }));
                  }
                }}
                className={`w-full border rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.email ? "border-red-400 focus:ring-red-300/40" : "border-slate-200 focus:ring-emerald-500/50"
                }`}
              />

              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email}
                </p>
              )}

              <div className="text-xs text-slate-600 mt-1">
                <p className="font-semibold">Email determines your role:</p>
                <ul className="list-disc pl-4 mt-1 mb-2 space-y-0.5 text-slate-500">
                  <li>@student.guc.edu.eg → Student</li>
                  <li>@guc.edu.eg → Instructor</li>
                  <li>Any non-GUC email → Employer</li>
                </ul>
                {role && (
                  <p className="text-sm text-slate-600 mt-2 border-t border-slate-100 pt-2">
                    You will register as:{" "}
                    <span className={`font-semibold ${
                      getRolePreview(formData.email) === 'Student' ? 'text-blue-600' : 
                      getRolePreview(formData.email) === 'Instructor' ? 'text-purple-600' : 'text-emerald-600'
                    }`}>
                      {getRolePreview(formData.email)}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {role && (
              <>
                {/* FIRST + LAST */}
                {role !== "employer" && (
                  <div className="flex flex-col sm:flex-row gap-5">

                    <div className="space-y-2 flex-1">
                      <label className="text-sm font-semibold text-slate-700">
                        First Name
                        <span className="text-red-500"> *</span>
                      </label>

                      <input
                        id="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        placeholder="Jane"
                        onChange={handleChange}
                        className={`w-full border rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 ${
                          errors.firstName ? "border-red-400 focus:ring-red-300/40" : "border-slate-200 focus:ring-emerald-500/50"
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 flex-1">
                      <label className="text-sm font-semibold text-slate-700">
                        Last Name
                        <span className="text-red-500"> *</span>
                      </label>

                      <input
                        id="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        placeholder="Doe"
                        onChange={handleChange}
                        className={`w-full border rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 ${
                          errors.lastName ? "border-red-400 focus:ring-red-300/40" : "border-slate-200 focus:ring-emerald-500/50"
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {role === "employer" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Company Name
                        <span className="text-red-500"> *</span>
                      </label>

                      <input
                        id="companyName"
                        type="text"
                        required
                        value={companyName}
                        placeholder="Acme Corp"
                        onChange={(e) => setCompanyName(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 ${
                          errors.companyName ? "border-red-400 focus:ring-red-300/40" : "border-slate-200 focus:ring-emerald-500/50"
                        }`}
                      />
                      {errors.companyName && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.companyName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Upload Tax Document
                        <span className="text-red-500"> *</span>
                      </label>

                      <div className={`rounded-2xl border-2 border-dashed bg-slate-50 p-6 text-center ${
                        errors.taxDoc ? "border-red-300" : "border-slate-200"
                      }`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 h-10 w-10 text-slate-300">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17,8 12,3 7,8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <p className="mb-3 text-xs text-slate-400">PDF only (tax document)</p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleTaxDocChange}
                          className={`w-full rounded-2xl border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                            errors.taxDoc ? "border-red-400 focus:ring-red-300/40" : "border-slate-200 focus:ring-emerald-400/30"
                          }`}
                        />
                        {errors.taxDoc && (
                          <p className="text-xs text-red-500 mt-2">
                            {errors.taxDoc}
                          </p>
                        )}
                        {taxDoc && (
                          <p className="text-xs text-slate-500 mt-2">
                            Uploaded: {taxDoc}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Password
                <span className="text-red-500"> *</span>
              </label>

              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                onChange={handleChange}
                className={`w-full border rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.password ? "border-red-400 focus:ring-red-300/40" : "border-slate-200 focus:ring-emerald-500/50"
                }`}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* CONFIRM */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Confirm Password
                <span className="text-red-500"> *</span>
              </label>

              <input
                id="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                onChange={handleChange}
                className={`w-full border rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.confirmPassword ? "border-red-400 focus:ring-red-300/40" : "border-slate-200 focus:ring-emerald-500/50"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl shadow transition"
            >
              Create account
            </button>

            {/* MOBILE LOGIN LINK */}
            <div className="md:hidden text-center text-sm text-slate-500">
              Already a member?{" "}
              <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
                Log in here
              </Link>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Register;