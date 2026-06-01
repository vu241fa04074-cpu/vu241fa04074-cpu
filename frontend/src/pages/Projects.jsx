import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FolderKanban, Plus, Github, ExternalLink, BadgeCheck,
  Pencil, Trash2, X, Loader2, Tag,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import { getProjects, createProject, updateProject, deleteProject } from "../api/projectApi";

const inputClass = "app-input";

const emptyForm = { title: "", description: "", technologies: "", githubLink: "", liveLink: "" };

const isValidUrl = (value) => {
  if (!value) return true;

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch { toast.error("Failed to load projects"); }
    finally { setLoading(false); }
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    if (!isValidUrl(form.githubLink) || !isValidUrl(form.liveLink)) {
      toast.error("Project links must start with http:// or https://.");
      return;
    }
    const techArray = form.technologies.split(",").map((t) => t.trim()).filter(Boolean);

    try {
      setSubmitting(true);
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        technologies: techArray,
        githubLink: form.githubLink.trim(),
        liveLink: form.liveLink.trim(),
      };

      if (editingId) {
        const updated = await updateProject(editingId, payload);
        setProjects((prev) => prev.map((p) => (p._id === editingId ? updated : p)));
        toast.success("Project updated!");
        setEditingId(null);
      } else {
        const created = await createProject(payload);
        setProjects((prev) => [created, ...prev]);
        toast.success("Project added!");
      }
      setForm(emptyForm);
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setForm({
      title: project.title,
      description: project.description,
      technologies: project.technologies?.join(", ") || "",
      githubLink: project.githubLink || "",
      liveLink: project.liveLink || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success("Project deleted.");
    } catch { toast.error("Delete failed."); }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Projects</h1>
          <p className="text-slate-600 mt-1">Showcase your work with repository and live demo links.</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="app-card mb-8 overflow-hidden p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                <FolderKanban size={20} className="text-blue-600" />
                {editingId ? "Edit Project" : "Add New Project"}
              </h2>
              <button onClick={cancelEdit} className="text-slate-400 hover:text-slate-950 transition">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="app-label">Project Title *</label>
                  <input name="title" value={form.title} onChange={handleChange}
                    placeholder="My Awesome Project" className={inputClass} required />
                </div>
                <div>
                  <label className="app-label">Technologies (comma separated)</label>
                  <input name="technologies" value={form.technologies} onChange={handleChange}
                    placeholder="React, Node.js, MongoDB" className={inputClass} />
                </div>
                <div>
                  <label className="app-label">GitHub Repository URL</label>
                  <input name="githubLink" value={form.githubLink} onChange={handleChange}
                    placeholder="https://github.com/username/repo" className={inputClass} />
                </div>
                <div>
                  <label className="app-label">Live Demo URL</label>
                  <input name="liveLink" value={form.liveLink} onChange={handleChange}
                    placeholder="https://yourproject.com" className={inputClass} />
                </div>
              </div>
              <div className="mb-5">
                <label className="app-label">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  rows={4} placeholder="Describe what this project does..." className={`${inputClass} resize-none`} required />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={submitting}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition px-6 py-3 rounded-xl text-white font-semibold text-sm">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                  {submitting ? "Saving..." : editingId ? "Update Project" : "Add Project"}
                </button>
                <button type="button" onClick={cancelEdit}
                  className="app-button-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project List */}
      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader /></div>
      ) : projects.length === 0 ? (
        <div className="app-card p-16 text-center">
          <FolderKanban size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-950 mb-2">No Projects Yet</h2>
          <p className="text-slate-600">Add your first project to start building your portfolio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {projects.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="app-card p-6 transition hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h2 className="text-xl font-bold text-slate-950">{project.title}</h2>
                    {project.verified && (
                      <span className="flex items-center gap-1 text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full">
                        <BadgeCheck size={12} /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{project.description}</p>

                  {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs">
                          <Tag size={10} />
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 text-slate-700 hover:text-blue-700 transition text-sm bg-slate-100 px-3 py-1.5 rounded-lg">
                        <Github size={14} /> GitHub
                      </a>
                    )}
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 text-blue-700 hover:text-blue-800 transition text-sm bg-blue-50 px-3 py-1.5 rounded-lg">
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(project)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition text-slate-600">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(project._id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
