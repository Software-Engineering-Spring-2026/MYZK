import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const faceRef = useRef(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [eyesClosed, setEyesClosed] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault(); // prevents page refresh
    navigate("/home");  // go to home after login
  };


const handleSubmit = (e) => {
  e.preventDefault();
  
  if (formData.email === VALID_EMAIL && formData.password === VALID_PASSWORD) {
    console.log('Login successful');
    navigate('/home');
  } else {
    alert('Invalid email or password');
  }
};


  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!faceRef.current || eyesClosed) {
        return;
      }

      const rect = faceRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
      const offsetX = clamp(dx / 18, -7, 7);
      const offsetY = clamp(dy / 18, -6, 6);

      setPupilOffset({ x: offsetX, y: offsetY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [eyesClosed]);

  const pupilStyle = {
    transform: `translate(calc(-50% + ${pupilOffset.x}px), calc(-50% + ${pupilOffset.y}px))`,
  };

  const handleFocus = () => setEyesClosed(true);
  const handleBlur = () => setEyesClosed(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl"></div>
          <div className="absolute right-[-8%] top-20 h-[320px] w-[320px] rounded-full bg-cyan-400/20 blur-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_60%)]"></div>
        </div>

        <div className="relative z-10 grid w-full gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
              Welcome back
            </div>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Sign in to keep your portfolio in motion.
            </h1>
            <p className="text-slate-300">
              Track feedback, publish new case studies, and stay visible to the
              people who matter.
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Fast</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Secure</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Private</span>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div
              ref={faceRef}
              className="relative mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200 shadow-2xl"
              aria-hidden="true"
            >
              <div className="absolute -top-2 left-1/2 h-16 w-28 -translate-x-1/2 rounded-b-[2.5rem] bg-slate-900"></div>
              <div className="absolute top-16 left-1/2 flex -translate-x-1/2 gap-5">
                <div className="relative h-6 w-12 rounded-full bg-white shadow-inner">
                  <span
                    className={`absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-slate-900 transition-opacity duration-200 ${
                      eyesClosed ? "opacity-0" : "opacity-100"
                    }`}
                    style={pupilStyle}
                  ></span>
                  <span
                    className={`absolute left-1/2 top-1/2 h-1 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 transition-opacity duration-200 ${
                      eyesClosed ? "opacity-100" : "opacity-0"
                    }`}
                  ></span>
                </div>
                <div className="relative h-6 w-12 rounded-full bg-white shadow-inner">
                  <span
                    className={`absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-slate-900 transition-opacity duration-200 ${
                      eyesClosed ? "opacity-0" : "opacity-100"
                    }`}
                    style={pupilStyle}
                  ></span>
                  <span
                    className={`absolute left-1/2 top-1/2 h-1 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 transition-opacity duration-200 ${
                      eyesClosed ? "opacity-100" : "opacity-0"
                    }`}
                  ></span>
                </div>
              </div>
              <div className="absolute bottom-10 left-1/2 h-3 w-12 -translate-x-1/2 rounded-full border-b-2 border-slate-900/50"></div>
              <div className="absolute bottom-4 left-1/2 h-5 w-16 -translate-x-1/2 rounded-full bg-white/70"></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Email</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  required
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  autoComplete="email"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 shadow-inner transition focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Password</label>
                <input
                  type="password"
                  placeholder="Your password"
                  required
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 shadow-inner transition focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                />
              </div>

              <div className="flex items-center justify-between text-sm text-slate-400">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-slate-900" />
                  Remember me
                </label>
                <button type="button" className="transition hover:text-white">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Login
              </button>
            </form>

            <p className="text-center text-sm text-slate-400">
              New to ProjectFolio?{" "}
              <Link to="/register" className="font-semibold text-white transition hover:text-cyan-200">
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
