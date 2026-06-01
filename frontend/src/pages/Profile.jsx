import { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import {
  Camera,
  ExternalLink,
  Eye,
  EyeOff,
  Github,
  Globe,
  Linkedin,
  Loader2,
  Plus,
  Save,
  Trash2,
  User,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getMyProfile, updateProfile } from "../api/profileApi";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

const emptyLinks = {
  github: "",
  linkedin: "",
  leetcode: "",
  hackerrank: "",
  codechef: "",
  portfolio: "",
};

const linkFields = [
  { key: "github", label: "GitHub", icon: Github, placeholder: "https://github.com/username" },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/username" },
  { key: "leetcode", label: "LeetCode", badge: "LC", placeholder: "https://leetcode.com/username" },
  { key: "hackerrank", label: "HackerRank", badge: "HR", placeholder: "https://hackerrank.com/username" },
  { key: "codechef", label: "CodeChef", badge: "CC", placeholder: "https://www.codechef.com/users/username" },
  { key: "portfolio", label: "Portfolio", icon: Globe, placeholder: "https://yourwebsite.com" },
];

const isValidUrl = (value) => {
  if (!value) return true;

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");

  const [form, setForm] = useState({
    headline: "",
    bio: "",
    skills: [],
    education: [],
    workExperience: [],
    socialLinks: emptyLinks,
    isPublic: true,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (profileImagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile();
      setProfile(data);
      setProfileImagePreview(data.profileImage ? `${API_ORIGIN}${data.profileImage}` : "");
      setForm({
        headline: data.headline || "",
        bio: data.bio || "",
        skills: data.skills || [],
        education: data.education?.length ? data.education : [],
        workExperience: data.workExperience?.length ? data.workExperience : [],
        socialLinks: {
          ...emptyLinks,
          ...(data.socialLinks || {}),
        },
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
      });
    } catch {
      toast.error("Could not load your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Upload a JPG or PNG image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile photo must be below 5 MB.");
      return;
    }

    if (profileImagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(profileImagePreview);
    }

    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const invalidLink = linkFields.find(({ key }) => !isValidUrl(form.socialLinks[key]));
    if (invalidLink) {
      toast.error(`${invalidLink.label} must be a valid URL.`);
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("headline", form.headline.trim());
      formData.append("bio", form.bio.trim());
      formData.append("skills", JSON.stringify(form.skills));
      formData.append("education", JSON.stringify(form.education));
      formData.append("workExperience", JSON.stringify(form.workExperience));
      formData.append("socialLinks", JSON.stringify(form.socialLinks));
      formData.append("isPublic", String(form.isPublic));

      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      const updated = await updateProfile(formData);
      setProfile(updated);
      setProfileImageFile(null);
      if (updated.profileImage) {
        setProfileImagePreview(`${API_ORIGIN}${updated.profileImage}`);
      }
      toast.success("Profile saved.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (form.skills.includes(trimmed)) {
      setSkillInput("");
      return;
    }

    setForm((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((item) => item !== skill) }));
  };

  const addEducation = () => {
    setForm((prev) => ({
      ...prev,
      education: [...prev.education, { college: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" }],
    }));
  };

  const updateEducation = (index, field, value) => {
    const education = [...form.education];
    education[index] = { ...education[index], [field]: value };
    setForm((prev) => ({ ...prev, education }));
  };

  const removeEducation = (index) => {
    setForm((prev) => ({ ...prev, education: prev.education.filter((_, itemIndex) => itemIndex !== index) }));
  };

  const addWork = () => {
    setForm((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, { company: "", position: "", startDate: "", endDate: "", description: "" }],
    }));
  };

  const updateWork = (index, field, value) => {
    const workExperience = [...form.workExperience];
    workExperience[index] = { ...workExperience[index], [field]: value };
    setForm((prev) => ({ ...prev, workExperience }));
  };

  const removeWork = (index) => {
    setForm((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  const publicUrl = `${window.location.origin}/u/${user?.username}`;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">Edit Profile</h1>
            <p className="mt-1 text-slate-600">Manage the public information shown on VERIFOLIO DIGITAL PLATFORM.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setForm((prev) => ({ ...prev, isPublic: !prev.isPublic }))}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                form.isPublic
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {form.isPublic ? <Eye size={16} /> : <EyeOff size={16} />}
              {form.isPublic ? "Public" : "Private"}
            </button>
            <button onClick={handleSave} disabled={saving} className="app-button-primary">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "Saving" : "Save Profile"}
            </button>
          </div>
        </div>

        {form.isPublic && (
          <div className="app-card flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-slate-700">Public profile URL</p>
              <a href={publicUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                {publicUrl}
              </a>
            </div>
            <a href={publicUrl} target="_blank" rel="noreferrer" className="app-button-secondary">
              <ExternalLink size={16} />
              View
            </a>
          </div>
        )}

        <section className="app-card p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex flex-col items-center gap-3 md:w-56">
              <div className="relative">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt={user?.name || "Profile"}
                    className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-md ring-1 ring-slate-200"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-700 shadow-sm ring-1 ring-blue-200">
                    {user?.name?.[0] || "U"}
                  </div>
                )}
                <label className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition hover:bg-blue-700">
                  <Camera size={17} />
                  <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>
              <p className="text-center text-xs text-slate-500">JPG or PNG, maximum 5 MB.</p>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="app-label">Full Name</label>
                <input value={user?.name || ""} readOnly className="app-input cursor-not-allowed bg-slate-50 text-slate-500" />
              </div>
              <div>
                <label className="app-label">Username</label>
                <input value={`@${user?.username || ""}`} readOnly className="app-input cursor-not-allowed bg-slate-50 text-slate-500" />
              </div>
              <div className="md:col-span-2">
                <label className="app-label">Professional Headline</label>
                <input
                  value={form.headline}
                  onChange={(event) => setForm((prev) => ({ ...prev, headline: event.target.value }))}
                  placeholder="Full Stack Developer"
                  className="app-input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="app-label">Bio</label>
                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
                  placeholder="A short, clear summary of your work and interests."
                  className="app-input resize-none"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="app-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-950">
            <User size={18} className="text-blue-600" />
            Skills
          </h2>
          <div className="mb-4 flex gap-3">
            <input
              value={skillInput}
              onChange={(event) => setSkillInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), addSkill())}
              placeholder="Add a skill"
              className="app-input"
            />
            <button onClick={addSkill} className="app-button-primary px-4">
              <Plus size={18} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                {skill}
                <button onClick={() => removeSkill(skill)} className="text-slate-400 transition hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </span>
            ))}
            {form.skills.length === 0 && <p className="text-sm text-slate-500">Add the skills you want visitors to notice first.</p>}
          </div>
        </section>

        <section className="app-card p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-950">Profile Links</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {linkFields.map(({ key, label, icon: Icon, badge, placeholder }) => (
              <div key={key}>
                <label className="app-label">{label}</label>
                <div className="relative">
                  {Icon ? (
                    <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  ) : (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{badge}</span>
                  )}
                  <input
                    type="url"
                    value={form.socialLinks[key] || ""}
                    onChange={(event) => setForm((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, [key]: event.target.value },
                    }))}
                    placeholder={placeholder}
                    className="app-input pl-11"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="app-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950">Education</h2>
            <button onClick={addEducation} className="app-button-secondary px-4 py-2">
              <Plus size={16} /> Add
            </button>
          </div>
          <div className="space-y-3">
            {form.education.length === 0 && <p className="text-sm text-slate-500">No education added yet.</p>}
            {form.education.map((education, index) => (
              <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input value={education.college} onChange={(event) => updateEducation(index, "college", event.target.value)} placeholder="College / University" className="app-input" />
                  <input value={education.degree} onChange={(event) => updateEducation(index, "degree", event.target.value)} placeholder="Degree" className="app-input" />
                  <input value={education.fieldOfStudy} onChange={(event) => updateEducation(index, "fieldOfStudy", event.target.value)} placeholder="Field of Study" className="app-input" />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={education.startYear} onChange={(event) => updateEducation(index, "startYear", event.target.value)} placeholder="Start Year" className="app-input" />
                    <input value={education.endYear} onChange={(event) => updateEducation(index, "endYear", event.target.value)} placeholder="End Year" className="app-input" />
                  </div>
                </div>
                <button onClick={() => removeEducation(index)} className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="app-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950">Work Experience</h2>
            <button onClick={addWork} className="app-button-secondary px-4 py-2">
              <Plus size={16} /> Add
            </button>
          </div>
          <div className="space-y-3">
            {form.workExperience.length === 0 && <p className="text-sm text-slate-500">No experience added yet.</p>}
            {form.workExperience.map((work, index) => (
              <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input value={work.company} onChange={(event) => updateWork(index, "company", event.target.value)} placeholder="Company" className="app-input" />
                  <input value={work.position} onChange={(event) => updateWork(index, "position", event.target.value)} placeholder="Position" className="app-input" />
                  <input value={work.startDate} onChange={(event) => updateWork(index, "startDate", event.target.value)} placeholder="Start Date" className="app-input" />
                  <input value={work.endDate} onChange={(event) => updateWork(index, "endDate", event.target.value)} placeholder="End Date or Present" className="app-input" />
                </div>
                <textarea value={work.description} onChange={(event) => updateWork(index, "description", event.target.value)} rows={2} placeholder="Short description" className="app-input mb-3 resize-none" />
                <button onClick={() => removeWork(index)} className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <button onClick={handleSave} disabled={saving} className="app-button-primary w-full py-4">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? "Saving Profile" : "Save All Changes"}
        </button>
      </div>
    </DashboardLayout>
  );
}
