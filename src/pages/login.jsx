import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const studentFaceRef = useRef(null);
  const employerFaceRef = useRef(null);
  const [studentPupilOffset, setStudentPupilOffset] = useState({ x: 0, y: 0 });
  const [employerPupilOffset, setEmployerPupilOffset] = useState({ x: 0, y: 0 });
  const [eyesClosed, setEyesClosed] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // 🧠 GET FORM VALUES (from inputs)
    const email = e.target[0].value;
    const password = e.target[1].value;

    // 🧠 GET USERS FROM localStorage (fake database)
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // 🧠 FIND MATCHING USER
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    // ❌ IF USER NOT FOUND
    if (!foundUser) {
      alert("Invalid email or password");
      return;
    }

    // ✅ SAVE LOGGED-IN USER
    localStorage.setItem("user", JSON.stringify(foundUser));

    // 🧠 REDIRECT BASED ON ROLE
    if (foundUser.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/home");
    }
  };



  useEffect(() => {
    const handleMouseMove = (event) => {
      if (eyesClosed) {
        return;
      }
      const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
      const updateOffset = (ref, setOffset) => {
        if (!ref.current) {
          return;
        }

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = event.clientX - centerX;
        const dy = event.clientY - centerY;
        const offsetX = clamp(dx / 18, -7, 7);
        const offsetY = clamp(dy / 18, -6, 6);

        setOffset({ x: offsetX, y: offsetY });
      };

      updateOffset(studentFaceRef, setStudentPupilOffset);
      updateOffset(employerFaceRef, setEmployerPupilOffset);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [eyesClosed]);

  const studentPupilStyle = {
    transform: `translate(calc(-50% + ${studentPupilOffset.x}px), calc(-50% + ${studentPupilOffset.y}px))`,
  };
  const employerPupilStyle = {
    transform: `translate(calc(-50% + ${employerPupilOffset.x}px), calc(-50% + ${employerPupilOffset.y}px))`,
  };

  const handleFocus = () => setEyesClosed(true);
  const handleBlur = () => setEyesClosed(false);

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-slate-900 antialiased">
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-amber-200/70 blur-3xl"></div>
          <div className="absolute right-[-8%] top-20 h-[340px] w-[340px] rounded-full bg-emerald-200/60 blur-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.2),transparent_55%),radial-gradient(circle_at_20%_70%,rgba(251,191,36,0.22),transparent_55%)]"></div>
        </div>

        <div className="relative z-10 grid w-full gap-10 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl backdrop-blur transition hover:shadow-3xl lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 shadow-sm">
              Welcome back
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
              Sign in to keep your portfolio in motion.
            </h1>
            <p className="text-slate-600">
              Track feedback, publish new case studies, and stay visible to the
              people who matter.
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1">Fast</span>
              <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1">Secure</span>
              <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1">Private</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
                <div
                  ref={studentFaceRef}
                  className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200 shadow-xl"
                  aria-hidden="true"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                    <div className="relative h-9 w-24">
                      <div className="absolute left-1/2 top-0 h-8 w-12 -translate-x-1/2 rotate-45 rounded-[8px] bg-slate-900 shadow-md"></div>
                      <div className="absolute left-1/2 top-5 h-2 w-24 -translate-x-1/2 rounded-full bg-slate-900/95"></div>
                      <div className="absolute right-1 top-3 h-7 w-[2px] bg-slate-900/70"></div>
                      <div className="absolute right-0 top-10 h-2 w-2 rounded-full bg-emerald-300"></div>
                    </div>
                  </div>
                  <div className="absolute top-12 left-1/2 flex -translate-x-1/2 gap-4">
                    <div className="relative h-5 w-10 rounded-full bg-white shadow-inner">
                      <span
                        className={`absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-slate-900 transition-opacity duration-200 ${
                          eyesClosed ? "opacity-0" : "opacity-100"
                        }`}
                        style={studentPupilStyle}
                      ></span>
                      <span
                        className={`absolute left-1/2 top-1/2 h-1 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 transition-opacity duration-200 ${
                          eyesClosed ? "opacity-100" : "opacity-0"
                        }`}
                      ></span>
                    </div>
                    <div className="relative h-5 w-10 rounded-full bg-white shadow-inner">
                      <span
                        className={`absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-slate-900 transition-opacity duration-200 ${
                          eyesClosed ? "opacity-0" : "opacity-100"
                        }`}
                        style={studentPupilStyle}
                      ></span>
                      <span
                        className={`absolute left-1/2 top-1/2 h-1 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 transition-opacity duration-200 ${
                          eyesClosed ? "opacity-100" : "opacity-0"
                        }`}
                      ></span>
                    </div>
                  </div>
                  <div className="absolute bottom-10 left-1/2 h-3 w-12 -translate-x-1/2 rounded-full border-b-2 border-slate-900/50"></div>
                  <div className="absolute bottom-4 left-1/2 h-5 w-16 -translate-x-1/2 rounded-full bg-white/70"></div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-slate-900">Student</p>
                  <p className="text-xs text-slate-500">Graduation-ready</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
                <div
                  ref={employerFaceRef}
                  className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200 shadow-xl"
                  aria-hidden="true"
                >
                  <div className="absolute -top-2 left-1/2 h-12 w-20 -translate-x-1/2 rounded-b-full bg-slate-700"></div>
                  <div className="absolute top-11 left-1/2 flex -translate-x-1/2 gap-4">
                    <div className="relative h-5 w-10 rounded-full bg-white shadow-inner">
                      <span
                        className={`absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-slate-900 transition-opacity duration-200 ${
                          eyesClosed ? "opacity-0" : "opacity-100"
                        }`}
                        style={employerPupilStyle}
                      ></span>
                      <span
                        className={`absolute left-1/2 top-1/2 h-1 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 transition-opacity duration-200 ${
                          eyesClosed ? "opacity-100" : "opacity-0"
                        }`}
                      ></span>
                    </div>
                    <div className="relative h-5 w-10 rounded-full bg-white shadow-inner">
                      <span
                        className={`absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-slate-900 transition-opacity duration-200 ${
                          eyesClosed ? "opacity-0" : "opacity-100"
                        }`}
                        style={employerPupilStyle}
                      ></span>
                      <span
                        className={`absolute left-1/2 top-1/2 h-1 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 transition-opacity duration-200 ${
                          eyesClosed ? "opacity-100" : "opacity-0"
                        }`}
                      ></span>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute top-10 left-1/2 flex -translate-x-1/2 items-center gap-2">
                    <div className="h-6 w-12 rounded-full border-2 border-slate-900 bg-slate-900 shadow-inner"></div>
                    <div className="h-6 w-12 rounded-full border-2 border-slate-900 bg-slate-900 shadow-inner"></div>
                    <div className="absolute left-1/2 top-1/2 h-1 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900"></div>
                  </div>
                  <div className="absolute bottom-10 left-1/2 h-3 w-12 -translate-x-1/2 rounded-full border-b-2 border-slate-700/60"></div>
                  <div className="absolute bottom-4 left-1/2 h-5 w-16 -translate-x-1/2 rounded-full bg-white/80"></div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-slate-900">Employer</p>
                  <p className="text-xs text-slate-500">Sunglasses on</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-slate-600">Email</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  required
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  autoComplete="email"
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-inner transition focus:border-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-600">Password</label>
                <input
                  type="password"
                  placeholder="Your password"
                  required
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-inner transition focus:border-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>

              <div className="flex items-center justify-between text-sm text-slate-500">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 bg-white" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm text-emerald-600">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-500"
              >
                Login
              </button>
            </form>

            <p className="text-center text-sm text-slate-500">
              New to ProjectFolio?{" "}
              <Link to="/register" className="font-semibold text-emerald-700 transition hover:text-emerald-600">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
