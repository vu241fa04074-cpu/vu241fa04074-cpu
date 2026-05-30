import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  User, Globe, Github, Linkedin, Twitter, Plus, Trash2,
  Save, Loader2, Eye, EyeOff, ExternalLink,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getMyProfile, updateProfile } from "../api/profileApi";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition text-sm";
const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    headline: "",
    bio: "",
    skills: [],
    education: [],
    workExperience: [],
    socialLinks: { linkedin: "", github: "", portfolio: "", twitter: "" },
    isPublic: true,
  });

  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile();
      setProfile(data);
      setForm({
        headline: data.headline || "",
        bio: data.bio || "",
        skills: data.skills || [],
        education: data.education?.length ? data.education : [],
        workExperience: data.workExperience?.length ? data.workExperience : [],
        socialLinks: {
          linkedin: data.socialLinks?.linkedin || "",
          github: data.socialLinks?.github || "",
          portfolio: data.socialLinks?.portfolio || "",
          twitter: data.socialLinks?.twitter || "",
        },
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
      });
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("headline", form.headline);
      formData.append("bio", form.bio);
      formData.append("skills", JSON.stringify(form.skills));
      formData.append("education", JSON.stringify(form.education));
      formData.append("workExperience", JSON.stringify(form.workExperience));
      formData.append("socialLinks", JSON.stringify(form.socialLinks));
      formData.append("isPublic", form.isPublic);

      await updateProfile(formData);
      toast.success("Profile saved successfully!");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setSkillInput("");
    }
  };

  const removeSkill = (s) =>
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((sk) => sk !== s) }));

  const addEducation = () =>
    setForm((prev) => ({
      ...prev,
      education: [...prev.education, { college: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" }],
    }));

  const updateEducation = (i, field, value) => {
    const updated = [...form.education];
    updated[i] = { ...updated[i], [field]: value };
    setForm((prev) => ({ ...prev, education: updated }));
  };

  const removeEducation = (i) =>
    setForm((prev) => ({ ...prev, education: prev.education.filter((_, idx) => idx !== i) }));

  const addWork = () =>
    setForm((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, { company: "", position: "", startDate: "", endDate: "", description: "" }],
    }));

  const updateWork = (i, field, value) => {
    const updated = [...form.workExperience];
    updated[i] = { ...updated[i], [field]: value };
    setForm((prev) => ({ ...prev, workExperience: updated }));
  };

  const removeWork = (i) =>
    setForm((prev) => ({ ...prev, workExperience: prev.workExperience.filter((_, idx) => idx !== i) }));

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64"><Loader /></div>
      </DashboardLayout>
    );
  }

  const publicUrl = `${window.location.origin}/u/${user?.username}`;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
            <p className="text-slate-400 mt-1">Manage your professional portfolio information.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setForm((prev) => ({ ...prev, isPublic: !prev.isPublic }));
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition border ${
                form.isPublic
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
            >
              {form.isPublic ? <Eye size={16} /> : <EyeOff size={16} />}
              {form.isPublic ? "Public" : "Private"}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>

        {/* Public URL */}
        {form.isPublic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6 flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-slate-300 text-sm">Your public portfolio URL:</p>
              <a href={publicUrl} target="_blank" rel="noreferrer" className="text-blue-400 text-sm font-medium hover:underline">
                {publicUrl}
              </a>
            </div>
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300 transition"
            >
              <ExternalLink size={16} />
              View
            </a>
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <User size={18} className="text-blue-400" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input type="text" value={user?.name || ""} readOnly
                  className={`${inputClass} opacity-60 cursor-not-allowed`} />
              </div>
              <div>
                <label className={labelClass}>Username</label>
                <input type="text" value={`@${user?.username || ""}`} readOnly
                  className={`${inputClass} opacity-60 cursor-not-allowed`} />
              </div>
            </div>
            <div className="mb-4">
              <label className={labelClass}>Professional Headline</label>
              <input
                type="text"
                value={form.headline}
                onChange={(e) => setForm((p) => ({ ...p, headline: e.target.value }))}
                placeholder="e.g. Full Stack Developer at Google"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Bio</label>
              <textarea
                rows={4}
                value={form.bio}
                onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Tell the world about yourself..."
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {/* Skills */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Skills</h2>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="Add a skill (press Enter)"
                className={`${inputClass} flex-1`}
              />
              <button onClick={addSkill} className="bg-blue-600 hover:bg-blue-700 transition px-4 py-3 rounded-xl text-white">
                <Plus size={18} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skills.map((skill) => (
                <span key={skill} className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="text-slate-500 hover:text-red-400 transition">
                    <Trash2 size={14} />
                  </button>
                </span>
              ))}
              {form.skills.length === 0 && (
                <p className="text-slate-500 text-sm">No skills added yet. Add your first skill above.</p>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Education</h2>
              <button onClick={addEducation} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium transition">
                <Plus size={16} /> Add
              </button>
            </div>
            {form.education.length === 0 && (
              <p className="text-slate-500 text-sm">No education added. Click &quot;Add&quot; to add your education.</p>
            )}
            {form.education.map((edu, i) => (
              <div key={i} className="bg-slate-800 rounded-xl p-4 mb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input value={edu.college} onChange={(e) => updateEducation(i, "college", e.target.value)}
                    placeholder="College / University" className={inputClass} />
                  <input value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)}
                    placeholder="Degree (e.g. B.Tech)" className={inputClass} />
                  <input value={edu.fieldOfStudy} onChange={(e) => updateEducation(i, "fieldOfStudy", e.target.value)}
                    placeholder="Field of Study" className={inputClass} />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={edu.startYear} onChange={(e) => updateEducation(i, "startYear", e.target.value)}
                      placeholder="Start Year" className={inputClass} />
                    <input value={edu.endYear} onChange={(e) => updateEducation(i, "endYear", e.target.value)}
                      placeholder="End Year" className={inputClass} />
                  </div>
                </div>
                <button onClick={() => removeEducation(i)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            ))}
          </div>

          {/* Work Experience */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Work Experience</h2>
              <button onClick={addWork} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium transition">
                <Plus size={16} /> Add
              </button>
            </div>
            {form.workExperience.length === 0 && (
              <p className="text-slate-500 text-sm">No experience added yet.</p>
            )}
            {form.workExperience.map((work, i) => (
              <div key={i} className="bg-slate-800 rounded-xl p-4 mb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input value={work.company} onChange={(e) => updateWork(i, "company", e.target.value)}
                    placeholder="Company Name" className={inputClass} />
                  <input value={work.position} onChange={(e) => updateWork(i, "position", e.target.value)}
                    placeholder="Position / Role" className={inputClass} />
                  <input value={work.startDate} onChange={(e) => updateWork(i, "startDate", e.target.value)}
                    placeholder="Start Date (e.g. Jan 2022)" className={inputClass} />
                  <input value={work.endDate} onChange={(e) => updateWork(i, "endDate", e.target.value)}
                    placeholder="End Date (or Present)" className={inputClass} />
                </div>
                <textarea
                  rows={2}
                  value={work.description}
                  onChange={(e) => updateWork(i, "description", e.target.value)}
                  placeholder="Brief description of responsibilities..."
                  className={`${inputClass} resize-none mb-3`}
                />
                <button onClick={() => removeWork(i)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "github", icon: Github, placeholder: "https://github.com/username" },
                { key: "linkedin", icon: Linkedin, placeholder: "https://linkedin.com/in/username" },
                { key: "portfolio", icon: Globe, placeholder: "https://yourportfolio.com" },
                { key: "twitter", icon: Twitter, placeholder: "https://twitter.com/username" },
              ].map(({ key, icon: Icon, placeholder }) => (
                <div key={key}>
                  <label className={labelClass}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <div className="relative">
                    <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="url"
                      value={form.socialLinks[key]}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          socialLinks: { ...p.socialLinks, [key]: e.target.value },
                        }))
                      }
                      placeholder={placeholder}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition py-4 rounded-xl text-white font-semibold"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
