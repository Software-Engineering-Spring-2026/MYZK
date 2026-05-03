import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f4ee] text-slate-900 antialiased">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-amber-200/70 blur-3xl"></div>
        <div className="absolute right-[-6%] top-20 h-[360px] w-[360px] rounded-full bg-emerald-200/60 blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.22),transparent_55%),radial-gradient(circle_at_20%_70%,rgba(251,191,36,0.25),transparent_55%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(15,23,42,0.08)_0%,transparent_45%,rgba(15,23,42,0.06)_70%,transparent_100%)]"></div>
      </div>

      <header className="relative z-10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-400 to-sky-500 p-[1px] shadow-lg">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-white">
                <span className="text-sm font-semibold text-slate-900">PF</span>
              </div>
            </div>
            <span className="text-xl font-semibold tracking-tight">ProjectFolio</span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <a
              className="relative transition hover:text-slate-900 after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-slate-900/40 after:transition-transform hover:after:scale-x-100"
              href="#features"
            >
              Features
            </a>
            <a
              className="relative transition hover:text-slate-900 after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-slate-900/40 after:transition-transform hover:after:scale-x-100"
              href="#flow"
            >
              How it works
            </a>
            <a
              className="relative transition hover:text-slate-900 after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-slate-900/40 after:transition-transform hover:after:scale-x-100"
              href="#audience"
            >
              Who it's for
            </a>
          </div>

          <div className="flex items-center gap-2 text-sm sm:gap-3">
            <Link
              to="/login"
              className="rounded-full px-3 py-2 text-slate-600 transition hover:bg-slate-900/5 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-slate-900 px-4 py-2 text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 shadow-sm">
              Portfolio studio
            </span>
            <h1 className="text-5xl font-semibold leading-tight text-slate-900 md:text-6xl">
              Make your work feel inevitable.
              <span className="mt-3 block text-emerald-700">Build a portfolio that gets replies.</span>
            </h1>
            <p className="text-lg text-slate-600">
              A curated workspace for students, instructors, and employers to
              build, review, and discover standout projects in one elegant feed.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
              >
                Get started
              </Link>
              <Link
                to="/home"
                className="rounded-full border border-slate-300 bg-white/40 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white/70 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30"
              >
                Explore projects
              </Link>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <div className="flex -space-x-2">
                  <span className="h-7 w-7 rounded-full border border-white bg-emerald-200"></span>
                  <span className="h-7 w-7 rounded-full border border-white bg-amber-200"></span>
                  <span className="h-7 w-7 rounded-full border border-white bg-sky-200"></span>
                </div>
                <span>Trusted by 480+ instructors</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-5 top-10 hidden h-20 w-20 rounded-2xl border border-white/80 bg-white/80 shadow-lg backdrop-blur sm:block"></div>
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                <span>Studio feed</span>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">New</span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white/80 to-transparent p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>UI system</span>
                    <span>7 min ago</span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">Aster Studio Library</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Reusable components, accessibility baked in, zero guesswork.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-700">
                    <span className="rounded-full bg-slate-100 px-2 py-1">React</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">Figma</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">Storybook</span>
                  </div>
                </div>
                <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Capstone</span>
                    <span>Yesterday</span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">PulseCare Remote Clinic</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Patient intake, triage, and follow-ups in one intuitive flow.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                  <p className="text-xs text-slate-500">Responses</p>
                  <p className="text-lg font-semibold text-slate-900">94%</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                  <p className="text-xs text-slate-500">Reviews</p>
                  <p className="text-lg font-semibold text-slate-900">1.8k</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                  <p className="text-xs text-slate-500">Matches</p>
                  <p className="text-lg font-semibold text-slate-900">312</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur transition hover:shadow-xl md:grid-cols-4">
            <div>
              <p className="text-sm text-slate-500">Projects published</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">12k+</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Feedback threads</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">48k</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Hiring partners</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">95+</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Average response</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">3 days</p>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Features</p>
            <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">Everything you need to launch with polish.</h2>
            <p className="mx-auto max-w-2xl text-slate-600">
              Every project gets a narrative, every review is trackable, and every
              portfolio reads like a hiring story.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="group rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:scale-105">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 7h10v10H7z" />
                  <path d="M3 3h6v6H3z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">Portfolio layouts that read like stories</h3>
              <p className="mt-2 text-slate-600">Build case studies with timelines, outcomes, and reflections that stand out.</p>
            </div>
            <div className="group rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 transition group-hover:scale-105">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 5h16v10H7l-3 3V5z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">Structured feedback loops</h3>
              <p className="mt-2 text-slate-600">Annotate work, capture decisions, and keep revisions aligned with reviewers.</p>
            </div>
            <div className="group rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 transition group-hover:scale-105">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3v18" />
                  <path d="M3 12h18" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">Discovery feed with smart filters</h3>
              <p className="mt-2 text-slate-600">Employers filter by role, stack, and project depth to find perfect matches.</p>
            </div>
            <div className="group rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:scale-105">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 11h10" />
                  <path d="M7 7h10" />
                  <path d="M7 15h6" />
                  <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">Versioned project history</h3>
              <p className="mt-2 text-slate-600">Track iterations over time and show growth beyond a single snapshot.</p>
            </div>
          </div>
        </section>

        <section id="flow" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">How it works</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900 md:text-4xl">From idea to interview-ready in three moves.</h2>
              <p className="mt-4 text-slate-600">
                Add context, map feedback, and publish a portfolio that highlights your intent, process, and impact.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-lg">
                <p className="text-sm font-semibold text-emerald-700">01</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Collect the story</h3>
                <p className="mt-2 text-slate-600">Bundle research, sketches, and outcomes into one narrative.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-lg">
                <p className="text-sm font-semibold text-emerald-700">02</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Invite feedback</h3>
                <p className="mt-2 text-slate-600">Route reviews to instructors and mentors with clear prompts.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-lg">
                <p className="text-sm font-semibold text-emerald-700">03</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Publish and match</h3>
                <p className="mt-2 text-slate-600">Share a single link and let recruiters discover the right fit.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="audience" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-10 shadow-lg">
            <div className="flex flex-col gap-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Who it's for</p>
              <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">Designed for every side of the review loop.</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
                <h3 className="text-xl font-semibold text-slate-900">Students</h3>
                <p className="mt-2 text-slate-600">Build a portfolio with context, outcomes, and clear next steps.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
                <h3 className="text-xl font-semibold text-slate-900">Instructors</h3>
                <p className="mt-2 text-slate-600">Give feedback faster with structured prompts and version history.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
                <h3 className="text-xl font-semibold text-slate-900">Employers</h3>
                <p className="mt-2 text-slate-600">Discover talent by skill, focus area, and project depth.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="rounded-3xl bg-slate-900 px-8 py-12 text-white shadow-xl shadow-slate-900/20 transition hover:shadow-2xl md:px-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Ready to launch</p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Turn your portfolio into a hiring magnet.</h2>
                <p className="mt-3 text-slate-300">Create your first project in minutes and share it anywhere.</p>
              </div>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
              >
                Start free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/60 bg-white/70 px-4 py-6 text-center text-sm text-slate-500 sm:px-6">
        (c) 2026 ProjectFolio — GUC Software Engineering Project
      </footer>
    </div>
  );
}

export default Landing;