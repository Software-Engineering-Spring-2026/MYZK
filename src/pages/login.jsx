import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Eye({ closed, dx = 0, dy = 0, size = 14 }) {
  const len = Math.hypot(dx, dy) || 1;
  const max = size * 0.18;
  const x = (dx / len) * Math.min(max, len);
  const y = (dy / len) * Math.min(max, len);

  return (
    <div
      className="relative rounded-full border border-neutral-300 bg-white"
      style={{ width: size, height: size }}
    >
      {closed ? (
        <span className="absolute left-1/2 top-1/2 h-[2px] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-700"></span>
      ) : (
        <span
          className="absolute left-1/2 top-1/2 h-[45%] w-[45%] rounded-full bg-neutral-900 transition-transform duration-75"
          style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
        ></span>
      )}
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const studentFaceRef = useRef(null);
  const [studentPupilOffset, setStudentPupilOffset] = useState({ x: 0, y: 0 });
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
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [eyesClosed]);

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
                  className="relative mx-auto h-40 w-32 select-none"
                  aria-hidden="true"
                >
                  <div className="absolute bottom-0 left-1/2 h-16 w-28 -translate-x-1/2 rounded-t-2xl bg-neutral-900"></div>
                  <div
                    className="absolute bottom-12 left-1/2 h-4 w-10 -translate-x-1/2 bg-neutral-100"
                    style={{ clipPath: "polygon(0 0, 100% 0, 70% 100%, 30% 100%)" }}
                  ></div>
                  <div className="absolute bottom-[34px] left-[38%] h-14 w-2 -translate-x-1/2 rounded-b-md bg-amber-400"></div>
                  <div className="absolute bottom-[34px] left-[62%] h-14 w-2 -translate-x-1/2 rounded-b-md bg-amber-400"></div>
                  <div className="absolute bottom-16 left-1/2 h-3 w-6 -translate-x-1/2 rounded-sm bg-amber-200"></div>
                  <div className="absolute bottom-[72px] left-1/2 h-20 w-20 -translate-x-1/2 rounded-full border border-amber-300 bg-amber-200">
                    <div className="absolute left-1/2 top-[42%] flex -translate-x-1/2 items-center justify-center gap-3">
                      <Eye closed={eyesClosed} dx={studentPupilOffset.x} dy={studentPupilOffset.y} />
                      <Eye closed={eyesClosed} dx={studentPupilOffset.x} dy={studentPupilOffset.y} />
                    </div>
                    <div className="absolute bottom-3 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-neutral-700"></div>
                  </div>
                  <div className="absolute bottom-[132px] left-1/2 h-4 w-16 -translate-x-1/2 rounded-t-md bg-neutral-900"></div>
                  <div className="absolute bottom-[142px] left-1/2 h-3 w-28 -translate-x-1/2 rotate-[-4deg] rounded-sm bg-neutral-900 shadow-md"></div>
                  <div className="absolute bottom-[144px] left-1/2 h-[2px] w-28 -translate-x-1/2 rotate-[-4deg] bg-neutral-700"></div>
                  <div className="absolute bottom-[146px] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-500"></div>
                  <div className="absolute bottom-[128px] right-[8%] h-6 w-[2px] rotate-[6deg] bg-amber-500"></div>
                  <div className="absolute bottom-[122px] right-[6%] h-3 w-2.5 rounded-b-full bg-amber-500"></div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-slate-900">Student</p>
                  <p className="text-xs text-slate-500">Graduation-ready</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
                <div
                  className="relative mx-auto h-40 w-32 select-none"
                  aria-hidden="true"
                >
                  <div className="absolute bottom-0 left-1/2 h-16 w-28 -translate-x-1/2 rounded-t-2xl bg-[#1e3a8a]"></div>
                  <div
                    className="absolute bottom-12 left-1/2 h-4 w-10 -translate-x-1/2 bg-white"
                    style={{ clipPath: "polygon(0 0, 100% 0, 70% 100%, 30% 100%)" }}
                  ></div>
                  <div className="absolute bottom-12 left-1/2 h-2 w-3 -translate-x-1/2 bg-red-800"></div>
                  <div
                    className="absolute bottom-2 left-1/2 h-10 w-3 -translate-x-1/2 bg-red-700"
                    style={{ clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0 100%)" }}
                  ></div>
                  <div className="absolute bottom-16 left-1/2 h-3 w-6 -translate-x-1/2 rounded-sm bg-amber-200"></div>
                  <div className="absolute bottom-[72px] left-1/2 h-20 w-20 -translate-x-1/2 overflow-hidden rounded-full border border-amber-300 bg-amber-200">
                    <svg
                      viewBox="0 0 100 100"
                      className="pointer-events-none absolute inset-0 h-full w-full"
                      preserveAspectRatio="none"
                    >
                      <path d="M -5 -5 L 105 -5 L 105 38 C 92 30, 80 28, 70 26 C 58 24, 48 28, 40 33 C 33 37, 28 38, 22 35 C 16 32, 10 28, -5 30 Z" fill="#facc15" />
                      <path d="M 32 28 C 50 30, 70 30, 86 24 C 78 36, 60 42, 42 40 C 36 39, 32 34, 32 28 Z" fill="#eab308" />
                      <path d="M 38 30 C 55 32, 72 30, 84 26" stroke="#ca8a04" strokeWidth="0.8" fill="none" opacity="0.8" />
                      <path d="M 30 14 L 34 28" stroke="#a16207" strokeWidth="0.6" />
                    </svg>
                    <div className="absolute left-1/2 top-[48%] flex -translate-x-1/2 items-center justify-center gap-3">
                      <Eye closed={eyesClosed} dx={-10} dy={0} />
                      <Eye closed={eyesClosed} dx={-10} dy={0} />
                    </div>
                    <div className="absolute bottom-3 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-neutral-700"></div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-slate-900">Employer</p>
                  <p className="text-xs text-slate-500">Talent scout</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-8">
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
