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

  // 🧠 HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const getRolePreview = (email) => {
    if (!email) return null;
    if (email.endsWith("@student.guc.edu.eg")) return "Student";
    if (email.endsWith("@guc.edu.eg")) return "Instructor";
    return "Employer";
  };

  // 🧠 HANDLE REGISTER
  const handleSubmit = (e) => {
    e.preventDefault();

    const { firstName, lastName, email, password, confirmPassword } = formData;

    // ❌ Validation
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // 🧠 GET USERS (fake DB)
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // ✅ Prevent duplicate users
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      alert("User already exists. Please login.");
      return;
    }

    // 🧠 ROLE DETECTION
    let role = "employer";

    if (email.endsWith("@student.guc.edu.eg")) {
      role = "student";
    } else if (email.endsWith("@guc.edu.eg")) {
      role = "instructor";
    }

    // 🧠 CREATE USER
    const newUser = {
      firstName,
      lastName,
      email,
      password,
      role
    };

    // 🧠 SAVE USER
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // 🧠 AUTO LOGIN
    localStorage.setItem("user", JSON.stringify(newUser));

    // 🧠 REDIRECT
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ee] flex items-center justify-center p-4 sm:p-8">

      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">

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

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* FIRST + LAST */}
            <div className="flex flex-col sm:flex-row gap-5">

              <div className="space-y-2 flex-1">
                <label className="text-sm font-semibold text-slate-700">
                  First Name
                </label>

                <input
                  id="firstName"
                  type="text"
                  placeholder="Jane"
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="space-y-2 flex-1">
                <label className="text-sm font-semibold text-slate-700">
                  Last Name
                </label>

                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="jane@example.com"
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />

              <div className="text-xs text-slate-500 mt-1">
                <p>Use your GUC email:</p>
                <ul className="list-disc pl-4 mt-1 mb-2 space-y-0.5 text-slate-400">
                  <li>@student.guc.edu.eg → Student</li>
                  <li>@guc.edu.eg → Instructor</li>
                  <li>Non-GUC email → Employer</li>
                </ul>
                {formData.email && (
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

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {/* CONFIRM */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
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