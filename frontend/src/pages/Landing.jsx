import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck, FolderKanban, Award, ThumbsUp,
  BarChart3, Globe, Github, ArrowRight, CheckCircle2,
  Zap, Lock, Users
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Credentials",
    desc: "Admin-verified badges on your projects, certifications, and achievements build instant trust.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: FolderKanban,
    title: "Portfolio Showcase",
    desc: "Display your full professional portfolio with GitHub links, live demos, and tech stacks.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: ThumbsUp,
    title: "Skill Endorsements",
    desc: "Receive peer endorsements on your skills from verified professionals in the community.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Track profile views, project engagement, and your verification history with clear charts.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: Globe,
    title: "Public Portfolio URL",
    desc: "Share your verified portfolio at verifolio.app/u/yourname with employers and clients.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Lock,
    title: "Privacy Control",
    desc: "Toggle your profile public or private anytime. You control what the world sees.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
];

const steps = [
  { step: "01", title: "Create Account", desc: "Sign up and build your professional profile in minutes." },
  { step: "02", title: "Add Portfolio", desc: "Upload projects, certifications, and achievements with proof files." },
  { step: "03", title: "Request Verification", desc: "Submit verification requests to get your credentials verified by admins." },
  { step: "04", title: "Share & Grow", desc: "Share your public portfolio URL and let your verified work speak for itself." },
];

const stats = [
  { value: "10K+", label: "Portfolios Created" },
  { value: "50K+", label: "Verified Credentials" },
  { value: "99%", label: "Verification Accuracy" },
  { value: "500+", label: "Organizations Trust Us" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function Landing() {
  const githubUrl = import.meta.env.VITE_GITHUB_URL || "https://github.com";

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={24} className="text-blue-500" />
            <span className="text-xl font-bold">VeriFolio</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm"
            >
              <Github size={18} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <Link
              to="/login"
              className="text-slate-300 hover:text-white transition text-sm px-4 py-2"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-xl text-sm font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 px-4 py-2 rounded-full text-blue-400 text-sm font-medium mb-8"
          >
            <Zap size={14} />
            The Future of Professional Verification
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6"
          >
            Verify Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Achievements
            </span>
            <br />
            Build Real Trust
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            VeriFolio is the professional platform where your projects, certifications,
            and achievements get verified — giving employers and clients 100% confidence
            in your credentials.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              to="/register"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl font-semibold text-lg"
            >
              Start For Free
              <ArrowRight size={20} />
            </Link>
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 transition px-8 py-4 rounded-xl font-semibold text-lg border border-slate-700"
            >
              <Github size={20} />
              View GitHub
            </a>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6 border-y border-slate-800">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.1}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.value}</div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="text-blue-400">Stand Out</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A complete platform for building, verifying, and sharing your professional identity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.08}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-colors"
                >
                  <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon size={24} className={feature.color} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="text-blue-400">Works</span>
            </h2>
            <p className="text-slate-400 text-lg">Get verified in 4 simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="relative"
              >
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full">
                  <div className="text-4xl font-extrabold text-blue-500/30 mb-4">{step.step}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PUBLIC PORTFOLIO PREVIEW */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your Public <span className="text-blue-400">Portfolio</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Every profile gets a shareable URL — professional, verified, and impressive.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Browser chrome */}
            <div className="bg-slate-800 px-5 py-3 flex items-center gap-3 border-b border-slate-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 bg-slate-700 rounded-lg px-4 py-1.5 text-slate-400 text-sm">
                verifolio.app/u/johndoe
              </div>
            </div>
            {/* Profile preview */}
            <div className="p-8">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
                  J
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">John Doe</div>
                  <div className="text-slate-400">Full Stack Developer · @johndoe</div>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 size={14} className="text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Verified Profile</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {["React", "Node.js", "MongoDB", "TypeScript", "AWS"].map((tech) => (
                  <span key={tech} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Projects", value: "12", icon: FolderKanban, color: "text-blue-400" },
                  { label: "Certifications", value: "8", icon: Award, color: "text-green-400" },
                  { label: "Endorsements", value: "34", icon: ThumbsUp, color: "text-purple-400" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-3">
                      <Icon size={20} className={item.color} />
                      <div>
                        <div className="text-lg font-bold text-white">{item.value}</div>
                        <div className="text-slate-500 text-xs">{item.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-3xl p-12"
          >
            <Users size={48} className="mx-auto text-blue-400 mb-6" />
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Join 10,000+ Professionals
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Build your verified portfolio today. Free forever for individuals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl font-semibold text-lg"
              >
                Create Free Account
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 transition px-8 py-4 rounded-xl font-semibold text-lg border border-slate-700"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-blue-500" />
            <span className="font-bold text-white">VeriFolio</span>
            <span className="text-slate-500 text-sm ml-2">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400 text-sm">
            <Link to="/login" className="hover:text-white transition">Login</Link>
            <Link to="/register" className="hover:text-white transition">Register</Link>
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-white transition"
            >
              <Github size={16} />
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
