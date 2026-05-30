import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck, Github, Globe, Linkedin, Twitter,
  FolderKanban, Award, Trophy, ThumbsUp, ExternalLink,
  BadgeCheck, Tag, Share2, Eye, GraduationCap, Briefcase,
} from "lucide-react";
import { getPublicProfile } from "../api/profileApi";
import Loader from "../components/Loader";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07 } }),
};

const Section = ({ icon: Icon, title, color, children }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-5">
    <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
      <Icon size={20} className={color} />
      {title}
    </h2>
    {children}
  </div>
);

export default function PublicProfile() {
  const { username } = useParams();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    getPublicProfile(username)
      .then(setData)
      .catch((e) => setError(e.response?.data?.message || "Profile not found"))
      .finally(() => setLoading(false));
  }, [username]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Profile URL copied to clipboard!");
    } catch { /* fallback */ }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-6">
      <ShieldCheck size={56} className="text-slate-600 mb-4" />
      <h1 className="text-3xl font-bold text-white mb-2">Profile Not Found</h1>
      <p className="text-slate-400 mb-6">{error}</p>
      <Link to="/" className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl text-white font-semibold">
        Go Home
      </Link>
    </div>
  );

  const { user, profile, projects, certifications, achievements, endorsements, analytics } = data;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-white">
            <ShieldCheck size={20} className="text-blue-500" /> VeriFolio
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={handleShare}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 transition px-4 py-2 rounded-xl text-slate-300 text-sm">
              <Share2 size={15} /> Share
            </button>
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-xl text-white text-sm font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-5 sticky top-24">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center mb-5">
                {profile?.profileImage ? (
                  <img src={`${(import.meta.env.VITE_API_URL||"http://localhost:5000/api").replace("/api","")}${profile.profileImage}`}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-slate-700 mb-3" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white border-4 border-slate-700 mb-3">
                    {user.name[0]}
                  </div>
                )}
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-slate-400 text-sm">@{user.username}</p>
                {profile?.headline && (
                  <p className="text-slate-300 text-sm mt-1">{profile.headline}</p>
                )}
                {profile?.bio && (
                  <p className="text-slate-400 text-sm mt-3 leading-relaxed">{profile.bio}</p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-5 text-center">
                {[
                  { label: "Projects",  value: projects.length },
                  { label: "Certs",     value: certifications.length },
                  { label: "Views",     value: analytics?.profileViews || 0 },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-800 rounded-xl py-2">
                    <div className="text-lg font-bold text-white">{s.value}</div>
                    <div className="text-slate-500 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex flex-col gap-2">
                {profile?.socialLinks?.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm bg-slate-800 px-3 py-2 rounded-xl">
                    <Github size={15} /> GitHub
                  </a>
                )}
                {profile?.socialLinks?.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm bg-slate-800 px-3 py-2 rounded-xl">
                    <Linkedin size={15} /> LinkedIn
                  </a>
                )}
                {profile?.socialLinks?.portfolio && (
                  <a href={profile.socialLinks.portfolio} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm bg-slate-800 px-3 py-2 rounded-xl">
                    <Globe size={15} /> Portfolio
                  </a>
                )}
                {profile?.socialLinks?.twitter && (
                  <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm bg-slate-800 px-3 py-2 rounded-xl">
                    <Twitter size={15} /> Twitter
                  </a>
                )}
              </div>
            </motion.div>

            {/* Skills */}
            {profile?.skills?.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h2 className="text-lg font-bold text-white mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span key={skill} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Projects */}
            {projects.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
                <Section icon={FolderKanban} title="Projects" color="text-blue-400">
                  <div className="space-y-4">
                    {projects.map((p) => (
                      <div key={p._id} className="bg-slate-800 rounded-xl p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-white">{p.title}</h3>
                            {p.verified && (
                              <span className="flex items-center gap-1 text-xs bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                                <BadgeCheck size={10} /> Verified
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{p.description}</p>
                        {p.technologies?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {p.technologies.map((t) => (
                              <span key={t} className="flex items-center gap-1 bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md text-xs">
                                <Tag size={9} />{t}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          {p.githubLink && (
                            <a href={p.githubLink} target="_blank" rel="noreferrer"
                              className="flex items-center gap-1 text-slate-400 hover:text-white text-xs bg-slate-700 px-3 py-1.5 rounded-lg transition">
                              <Github size={12} /> GitHub
                            </a>
                          )}
                          {p.liveLink && (
                            <a href={p.liveLink} target="_blank" rel="noreferrer"
                              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs bg-blue-500/10 px-3 py-1.5 rounded-lg transition">
                              <ExternalLink size={12} /> Live
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              </motion.div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2}>
                <Section icon={Award} title="Certifications" color="text-green-400">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {certifications.map((c) => (
                      <div key={c._id} className="bg-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-white text-sm">{c.title}</span>
                          {c.verified && (
                            <span className="flex items-center gap-1 text-xs bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                              <BadgeCheck size={9} /> Verified
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs">{c.issuer}</p>
                        {c.credentialUrl && (
                          <a href={c.credentialUrl} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 text-blue-400 text-xs mt-2 hover:text-blue-300 transition">
                            <ExternalLink size={11} /> Verify
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </Section>
              </motion.div>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.3}>
                <Section icon={Trophy} title="Achievements" color="text-yellow-400">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {achievements.map((a) => (
                      <div key={a._id} className="bg-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-white text-sm">{a.title}</span>
                          {a.verified && (
                            <span className="flex items-center gap-1 text-xs bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                              <BadgeCheck size={9} /> Verified
                            </span>
                          )}
                        </div>
                        {a.category && <p className="text-slate-500 text-xs">{a.category}</p>}
                        <p className="text-slate-400 text-xs mt-1">{a.description}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              </motion.div>
            )}

            {/* Work Experience */}
            {profile?.workExperience?.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.4}>
                <Section icon={Briefcase} title="Work Experience" color="text-purple-400">
                  <div className="space-y-4">
                    {profile.workExperience.map((w, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-white">{w.position}</p>
                          <p className="text-slate-400 text-sm">{w.company}</p>
                          {(w.startDate || w.endDate) && (
                            <p className="text-slate-500 text-xs mt-0.5">{w.startDate} – {w.endDate || "Present"}</p>
                          )}
                          {w.description && <p className="text-slate-400 text-sm mt-1">{w.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              </motion.div>
            )}

            {/* Education */}
            {profile?.education?.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.5}>
                <Section icon={GraduationCap} title="Education" color="text-cyan-400">
                  <div className="space-y-4">
                    {profile.education.map((e, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-white">{e.degree} in {e.fieldOfStudy}</p>
                          <p className="text-slate-400 text-sm">{e.college}</p>
                          {(e.startYear || e.endYear) && (
                            <p className="text-slate-500 text-xs mt-0.5">{e.startYear} – {e.endYear}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              </motion.div>
            )}

            {/* Endorsements */}
            {endorsements.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.6}>
                <Section icon={ThumbsUp} title="Endorsements" color="text-rose-400">
                  <div className="flex flex-wrap gap-2">
                    {endorsements.map((e) => (
                      <div key={e._id} className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                          {e.fromUser?.name?.[0] || "?"}
                        </div>
                        <span className="text-slate-300 text-sm font-medium">{e.skill}</span>
                        <span className="text-slate-500 text-xs">by {e.fromUser?.name}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 px-6 text-center">
        <p className="text-slate-500 text-sm">
          Powered by{" "}
          <Link to="/" className="text-blue-400 hover:text-blue-300 transition font-medium">VeriFolio</Link>
          {" · "}Build your verified portfolio today.
        </p>
      </footer>
    </div>
  );
}
