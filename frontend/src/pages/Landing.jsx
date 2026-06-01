import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle2,
  Code2,
  ExternalLink,
  FileCheck2,
  FolderKanban,
  Github,
  Globe2,
  Linkedin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const features = [
  {
    icon: FolderKanban,
    title: "Project Portfolio",
    desc: "Publish projects with descriptions, technology stacks, GitHub repositories, live links, and supporting files.",
  },
  {
    icon: FileCheck2,
    title: "Verification Workflow",
    desc: "Request verification for achievements, certifications, and projects so every important item can carry proof.",
  },
  {
    icon: Code2,
    title: "Coding Profiles",
    desc: "Connect GitHub, LinkedIn, LeetCode, HackerRank, CodeChef, and a personal website from one public profile.",
  },
  {
    icon: BarChart3,
    title: "Portfolio Analytics",
    desc: "Track views and portfolio activity with a focused dashboard built for students and professionals.",
  },
  {
    icon: Users,
    title: "Endorsements",
    desc: "Let peers and mentors endorse your work so your public profile feels trusted and complete.",
  },
  {
    icon: Globe2,
    title: "Public Profile URL",
    desc: "Share a clean portfolio link that can be opened from any browser on mobile, laptop, or desktop.",
  },
];

const steps = [
  "Create your account and profile",
  "Add projects, certificates, achievements, and work history",
  "Connect GitHub and coding profile links",
  "Request verification and share your public URL",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: "easeOut" },
  }),
};

export default function Landing() {
  const githubUrl = import.meta.env.VITE_GITHUB_URL || "https://github.com";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <ShieldCheck size={22} />
            </span>
            <span>
              <span className="block text-sm font-bold leading-tight">VERIFOLIO</span>
              <span className="block text-xs font-medium text-slate-500">Digital Platform</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 sm:flex"
            >
              <Github size={17} />
              GitHub
            </a>
            <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-blue-700">
              Login
            </Link>
            <Link to="/register" className="app-button-primary px-4 py-2">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                <Sparkles size={16} />
                Professional digital portfolio and verification platform
              </div>
              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
                VERIFOLIO DIGITAL PLATFORM
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Build a public portfolio that shows your projects, certifications, achievements,
                coding profiles, GitHub repositories, and verification status in one polished place.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/register" className="app-button-primary px-6 py-3 text-base">
                  Create Portfolio
                  <ArrowRight size={18} />
                </Link>
                <a href={githubUrl} target="_blank" rel="noreferrer" className="app-button-secondary px-6 py-3 text-base">
                  <Github size={18} />
                  View Project GitHub
                </a>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70"
            >
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                      A
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-950">Aarav Sharma</h2>
                      <p className="text-sm text-slate-500">Full Stack Developer | @aaravdev</p>
                    </div>
                  </div>
                  <span className="app-badge bg-emerald-50 text-emerald-700">
                    <CheckCircle2 size={14} />
                    Verified
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["Projects", "06"],
                    ["Certificates", "04"],
                    ["Endorsements", "11"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="text-2xl font-black text-slate-950">{value}</div>
                      <div className="text-sm text-slate-500">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-bold text-slate-950">Featured Project</h3>
                    <a href={githubUrl} target="_blank" rel="noreferrer" className="text-blue-600">
                      <ExternalLink size={18} />
                    </a>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">
                    Digital portfolio app with authentication, project uploads, verification requests,
                    endorsements, and analytics.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["React", "Node.js", "MongoDB", "Express"].map((skill) => (
                      <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <span className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-3 text-slate-700">
                    <Github size={18} />
                  </span>
                  <span className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-3 text-slate-700">
                    <Linkedin size={18} />
                  </span>
                  <span className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-3 text-slate-700">
                    <Code2 size={18} />
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Platform Features</p>
              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Everything needed for a credible public profile.
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.article
                    key={feature.title}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={index}
                    className="app-card p-6"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-950">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{feature.desc}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">How It Works</p>
              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                From empty profile to public portfolio.
              </h2>
              <p className="mt-4 text-slate-600">
                The flow is simple enough for students, but structured enough for a real production website.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {steps.map((step, index) => (
                <div key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <p className="font-semibold text-slate-800">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto flex max-w-5xl flex-col items-center rounded-[1.5rem] border border-blue-100 bg-blue-600 px-6 py-12 text-center text-white shadow-xl shadow-blue-200 sm:px-12">
            <ShieldCheck size={46} />
            <h2 className="mt-5 text-3xl font-black sm:text-4xl">Start building your public verified portfolio.</h2>
            <p className="mt-4 max-w-2xl text-blue-50">
              Add profile photo, coding links, projects, credentials, work history, and verification requests from one dashboard.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50">
                Create Account
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center rounded-xl border border-blue-300 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-500">
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-blue-600" />
            <span className="font-bold text-slate-950">VERIFOLIO DIGITAL PLATFORM</span>
            <span>{new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/login" className="font-semibold hover:text-blue-700">Login</Link>
            <Link to="/register" className="font-semibold hover:text-blue-700">Register</Link>
            <a href={githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-semibold hover:text-blue-700">
              <Github size={16} />
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
