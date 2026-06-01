import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  Briefcase,
  ExternalLink,
  FolderKanban,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  Share2,
  ShieldCheck,
  Tag,
  ThumbsUp,
  Trophy,
} from "lucide-react";
import { getPublicProfile } from "../api/profileApi";
import Loader from "../components/Loader";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: delay * 0.05 },
  }),
};

const Section = ({ icon: Icon, title, children }) => (
  <section className="app-card p-6">
    <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-950">
      <Icon size={20} className="text-blue-600" />
      {title}
    </h2>
    {children}
  </section>
);

const profileLinks = [
  { key: "github", label: "GitHub", icon: Github },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin },
  { key: "leetcode", label: "LeetCode", badge: "LC" },
  { key: "hackerrank", label: "HackerRank", badge: "HR" },
  { key: "codechef", label: "CodeChef", badge: "CC" },
  { key: "portfolio", label: "Portfolio", icon: Globe },
];

export default function PublicProfile() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPublicProfile(username)
      .then(setData)
      .catch((err) => setError(err.response?.data?.message || "Profile not found"))
      .finally(() => setLoading(false));
  }, [username]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Profile link copied.");
    } catch {
      alert(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <ShieldCheck size={56} className="mb-4 text-slate-300" />
        <h1 className="mb-2 text-3xl font-bold text-slate-950">Profile not available</h1>
        <p className="mb-6 text-slate-600">{error}</p>
        <Link to="/" className="app-button-primary">
          Go Home
        </Link>
      </div>
    );
  }

  const { user, profile, projects, certifications, achievements, endorsements, analytics } = data;
  const imageUrl = profile?.profileImage ? `${API_ORIGIN}${profile.profileImage}` : "";
  const activeLinks = profileLinks.filter(({ key }) => profile?.socialLinks?.[key]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2 font-bold text-slate-950">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <ShieldCheck size={19} />
            </span>
            <span className="hidden sm:inline">VERIFOLIO DIGITAL PLATFORM</span>
            <span className="sm:hidden">VERIFOLIO</span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={handleShare} className="app-button-secondary px-4 py-2">
              <Share2 size={15} /> Share
            </button>
            <Link to="/login" className="app-button-primary px-4 py-2">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <aside className="lg:col-span-1">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="app-card sticky top-24 p-6"
            >
              <div className="mb-5 flex flex-col items-center text-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={user.name}
                    className="mb-4 h-28 w-28 rounded-full border-4 border-white object-cover shadow-md ring-1 ring-slate-200"
                  />
                ) : (
                  <div className="mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-700 ring-1 ring-blue-200">
                    {user.name?.[0] || "U"}
                  </div>
                )}
                <h1 className="text-2xl font-bold text-slate-950">{user.name}</h1>
                <p className="text-sm text-slate-500">@{user.username}</p>
                {profile?.headline && <p className="mt-2 text-sm font-medium text-slate-700">{profile.headline}</p>}
                {profile?.bio && <p className="mt-3 text-sm leading-relaxed text-slate-600">{profile.bio}</p>}
              </div>

              <div className="mb-5 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Projects", value: projects.length },
                  { label: "Certs", value: certifications.length },
                  { label: "Views", value: analytics?.profileViews || 0 },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-slate-50 py-3">
                    <div className="text-lg font-bold text-slate-950">{item.value}</div>
                    <div className="text-xs text-slate-500">{item.label}</div>
                  </div>
                ))}
              </div>

              {activeLinks.length > 0 && (
                <div className="space-y-2">
                  {activeLinks.map(({ key, label, icon: Icon, badge }) => (
                    <a
                      key={key}
                      href={profile.socialLinks[key]}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {Icon ? <Icon size={15} /> : <span className="text-xs font-bold">{badge}</span>}
                      {label}
                      <ExternalLink size={13} className="ml-auto" />
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          </aside>

          <div className="space-y-6 lg:col-span-2">
            {profile?.skills?.length > 0 && (
              <Section icon={Tag} title="Skills">
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {projects.length > 0 && (
              <Section icon={FolderKanban} title="Projects">
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project._id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-950">{project.title}</h3>
                        {project.verified && (
                          <span className="app-badge border-green-200 bg-green-50 text-green-700">
                            <BadgeCheck size={11} /> Verified
                          </span>
                        )}
                      </div>
                      <p className="mb-3 text-sm leading-relaxed text-slate-600">{project.description}</p>
                      {project.technologies?.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span key={tech} className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" rel="noreferrer" className="app-button-secondary px-3 py-2">
                            <Github size={14} /> GitHub
                          </a>
                        )}
                        {project.liveLink && (
                          <a href={project.liveLink} target="_blank" rel="noreferrer" className="app-button-primary px-3 py-2">
                            <ExternalLink size={14} /> Live
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {certifications.length > 0 && (
              <Section icon={Award} title="Certifications">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {certifications.map((certification) => (
                    <div key={certification._id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-950">{certification.title}</span>
                        {certification.verified && (
                          <span className="app-badge border-green-200 bg-green-50 text-green-700">
                            <BadgeCheck size={10} /> Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{certification.issuer}</p>
                      {certification.credentialUrl && (
                        <a href={certification.credentialUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                          <ExternalLink size={13} /> Verify credential
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {achievements.length > 0 && (
              <Section icon={Trophy} title="Achievements">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {achievements.map((achievement) => (
                    <div key={achievement._id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-950">{achievement.title}</span>
                        {achievement.verified && (
                          <span className="app-badge border-green-200 bg-green-50 text-green-700">
                            <BadgeCheck size={10} /> Verified
                          </span>
                        )}
                      </div>
                      {achievement.category && <p className="text-xs font-medium text-slate-500">{achievement.category}</p>}
                      <p className="mt-1 text-sm text-slate-600">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {profile?.workExperience?.length > 0 && (
              <Section icon={Briefcase} title="Work Experience">
                <div className="space-y-4">
                  {profile.workExperience.map((work, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-4">
                      <p className="font-semibold text-slate-950">{work.position}</p>
                      <p className="text-sm text-slate-600">{work.company}</p>
                      {(work.startDate || work.endDate) && (
                        <p className="mt-0.5 text-xs text-slate-500">{work.startDate} - {work.endDate || "Present"}</p>
                      )}
                      {work.description && <p className="mt-1 text-sm text-slate-600">{work.description}</p>}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {profile?.education?.length > 0 && (
              <Section icon={GraduationCap} title="Education">
                <div className="space-y-4">
                  {profile.education.map((education, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-4">
                      <p className="font-semibold text-slate-950">{education.degree} {education.fieldOfStudy ? `in ${education.fieldOfStudy}` : ""}</p>
                      <p className="text-sm text-slate-600">{education.college}</p>
                      {(education.startYear || education.endYear) && (
                        <p className="mt-0.5 text-xs text-slate-500">{education.startYear} - {education.endYear}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {endorsements.length > 0 && (
              <Section icon={ThumbsUp} title="Endorsements">
                <div className="flex flex-wrap gap-2">
                  {endorsements.map((endorsement) => (
                    <div key={endorsement._id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                      <span className="font-semibold text-slate-950">{endorsement.skill}</span>
                      <span className="text-slate-500"> by {endorsement.fromUser?.name}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white px-5 py-6 text-center text-sm text-slate-500">
        Powered by <Link to="/" className="font-semibold text-blue-600 hover:text-blue-700">VERIFOLIO DIGITAL PLATFORM</Link>
      </footer>
    </div>
  );
}
