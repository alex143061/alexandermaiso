import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX,
  FiCheckCircle, FiAlertCircle, FiFolder, FiClock, FiLayers,
} from "react-icons/fi";
import { StarsCanvas } from "../components/canvas";

const initialProjects = [
  { id: 1, name: "ROADWATCH", category: "IoT", status: "Completed", date: "2026-10-18" },
  { id: 2, name: "Alexander Maiso E-commerce App", category: "Web Dev", status: "Completed", date: "2026-09-12" },
  { id: 3, name: "Lex Karaoke", category: "Web Dev", status: "Completed", date: "2026-08-20" },
  { id: 4, name: "WP Leads", category: "Web Dev", status: "Completed", date: "2026-08-10" },
  { id: 5, name: "LearnEduColor LMS Website", category: "Web Dev", status: "Completed", date: "2026-07-15" },
  { id: 6, name: "Createlabz.io IoT Store", category: "Web Dev", status: "Completed", date: "2026-07-01" },
  { id: 7, name: "Educolorworld Website", category: "Web Dev", status: "Completed", date: "2026-06-20" },
  { id: 8, name: "Impossible Kids Website", category: "Web Dev", status: "Completed", date: "2026-06-01" },
  { id: 9, name: "C & L Physiotherapy", category: "Web Dev", status: "Completed", date: "2026-05-10" },
  { id: 10, name: "PawLitrax™", category: "Mobile", status: "In Progress", date: "2026-04-15" },
  { id: 11, name: "Lost & Found System @UM Matina", category: "Software", status: "Completed", date: "2026-03-20" },
  { id: 12, name: "Pautang Gadget System", category: "Software", status: "Completed", date: "2026-02-10" },
  { id: 13, name: "Line Follower Robot", category: "IoT", status: "Completed", date: "2026-01-15" },
];

const statusColors = {
  Completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "In Progress": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Planned: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const categoryColors = {
  IoT: "bg-teal-500/20 text-teal-400",
  "Web Dev": "bg-purple-500/20 text-purple-400",
  Software: "bg-orange-500/20 text-orange-400",
  Mobile: "bg-pink-500/20 text-pink-400",
};

const Dashboard = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: "", category: "Web Dev", status: "Planned",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (type, message) => setToast({ type, message });

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.status.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingProject(null);
    setFormData({ name: "", category: "Web Dev", status: "Planned", date: new Date().toISOString().split("T")[0] });
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditingProject(project);
    setFormData({ name: project.name, category: project.category, status: project.status, date: project.date });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { showToast("error", "Project name is required."); return; }
    if (editingProject) {
      setProjects(projects.map((p) => (p.id === editingProject.id ? { ...formData, id: p.id } : p)));
      showToast("success", `"${formData.name}" updated successfully.`);
    } else {
      setProjects([{ ...formData, id: Date.now() }, ...projects]);
      showToast("success", `"${formData.name}" created successfully.`);
    }
    setModalOpen(false);
  };

  const handleDelete = (project) => {
    setProjects(projects.filter((p) => p.id !== project.id));
    setDeleteConfirm(null);
    showToast("success", `"${project.name}" deleted.`);
  };

  const completedCount = projects.filter((p) => p.status === "Completed").length;
  const inProgressCount = projects.filter((p) => p.status === "In Progress").length;

  return (
    <div className="relative w-full min-h-screen bg-primary/70 text-white">
      <div className="fixed inset-0 z-[-1] w-full h-full">
        <StarsCanvas fixed />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border ${
              toast.type === "success"
                ? "bg-emerald-500/90 text-white border-emerald-300"
                : "bg-rose-500/90 text-white border-rose-300"
            } flex items-center gap-3`}
          >
            {toast.type === "success" ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
            <span className="font-medium text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-6xl mx-auto p-4 sm:p-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 mb-2">
            Project Dashboard
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            A live CRUD demonstration. Go ahead, <span className="text-teal-400 font-medium">create</span>, <span className="text-purple-400 font-medium">edit</span>, and <span className="text-rose-400 font-medium">delete</span> projects to explore how it works. Nothing is saved, so refresh anytime to start fresh!
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
              <FiLayers size={24} className="text-teal-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{projects.length}</p>
              <p className="text-xs text-gray-400">Total Projects</p>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <FiCheckCircle size={24} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{completedCount}</p>
              <p className="text-xs text-gray-400">Completed</p>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <FiClock size={24} className="text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{inProgressCount}</p>
              <p className="text-xs text-gray-400">In Progress</p>
            </div>
          </div>
        </motion.div>

        {/* Toolbar: Search + Add */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <FiSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:bg-white/10 transition-all"
            />
          </div>
          <button
            onClick={openCreate}
            className="h-12 px-6 bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 hover:from-teal-400 hover:via-purple-400 hover:to-orange-400 rounded-xl font-bold text-white text-sm shadow-lg shadow-teal-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <FiPlus size={18} />
            New Project
          </button>
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((project) => (
                    <motion.tr key={project.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-teal-500/20 to-purple-500/20 flex items-center justify-center">
                            <FiFolder size={16} className="text-teal-400" />
                          </div>
                          <span className="font-semibold text-white text-sm">{project.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[project.category] || "bg-gray-500/20 text-gray-400"}`}>{project.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[project.status] || "bg-gray-500/20 text-gray-400"}`}>{project.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{project.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(project)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-teal-400 hover:border-teal-500/40 hover:bg-teal-500/10 transition-all" title="Edit">
                            <FiEdit2 size={15} />
                          </button>
                          <button onClick={() => setDeleteConfirm(project)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10 transition-all" title="Delete">
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden divide-y divide-white/5">
            <AnimatePresence>
              {filtered.map((project) => (
                <motion.div key={project.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-teal-500/20 to-purple-500/20 flex items-center justify-center">
                        <FiFolder size={18} className="text-teal-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{project.name}</p>
                        <p className="text-xs text-gray-500">{project.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(project)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-teal-400 transition-all">
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteConfirm(project)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-rose-400 transition-all">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[project.category] || "bg-gray-500/20 text-gray-400"}`}>{project.category}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[project.status] || "bg-gray-500/20 text-gray-400"}`}>{project.status}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <FiSearch size={40} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No projects found. Try a different search or create a new one.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{editingProject ? "Edit Project" : "New Project"}</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                  <FiX size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Project Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter project name" className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:bg-white/10 transition-all" autoFocus />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:bg-white/10 transition-all appearance-none cursor-pointer">
                      <option value="Web Dev" className="bg-gray-900">Web Dev</option>
                      <option value="IoT" className="bg-gray-900">IoT</option>
                      <option value="Software" className="bg-gray-900">Software</option>
                      <option value="Mobile" className="bg-gray-900">Mobile</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:bg-white/10 transition-all appearance-none cursor-pointer">
                      <option value="Planned" className="bg-gray-900">Planned</option>
                      <option value="In Progress" className="bg-gray-900">In Progress</option>
                      <option value="Completed" className="bg-gray-900">Completed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Date</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:bg-white/10 transition-all" />
                </div>
                <button type="submit" className="w-full h-12 bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 hover:from-teal-400 hover:via-purple-400 hover:to-orange-400 rounded-xl font-bold text-white text-sm shadow-lg shadow-teal-500/25 transition-all duration-300 transform hover:-translate-y-0.5 mt-2">
                  {editingProject ? "Update Project" : "Create Project"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm(null)} className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-4">
                <FiTrash2 size={24} className="text-rose-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Project?</h2>
              <p className="text-gray-400 text-sm mb-6">
                Are you sure you want to delete <span className="text-white font-semibold">"{deleteConfirm.name}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-11 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold text-sm hover:bg-white/10 transition-all">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 h-11 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-semibold text-sm transition-all">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
