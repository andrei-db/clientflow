import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { Calendar, Plus, Wallet, Trash2, Pencil } from "lucide-react";
import ProjectModal from "../components/ProjectModal";
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  useEffect(() => {
    loadProjects();
  }, []);
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(search.toLowerCase()) ||
      project.description?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  async function loadProjects() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Could not load projects");
        return;
      }

      setProjects(data.projects);
    } catch (err) {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  }


  async function handleDeleteProject(id) {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:4000/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <MainLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500">Work</p>
          <h2 className="text-4xl font-bold tracking-tight">Projects</h2>
        </div>

        <button onClick={() => {
          setEditingProject(null);
          setModalOpen(true);
        }}
          className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-neutral-200">
          <Plus size={18} />
          Add project
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none"
        >
          <option value="all">All statuses</option>
          <option value="planned">Planned</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {loading && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-56 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]"
            />
          ))}
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500">
                    {project.description || "No description"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300">
                    {project.status}
                  </span>

                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setModalOpen(true);
                    }}
                    className="rounded-xl p-2 text-neutral-500 transition hover:bg-white/10 hover:text-white"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="rounded-xl p-2 text-neutral-500 transition hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-neutral-400">
                <p className="flex items-center gap-2">
                  <Wallet size={16} />
                  €{project.budget}
                </p>

                <p className="flex items-center gap-2">
                  <Calendar size={16} />
                  {project.deadline
                    ? new Date(project.deadline).toLocaleDateString()
                    : "No deadline"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredProjects.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center">
          <h3 className="text-xl font-semibold">No projects yet</h3>
          <p className="mt-2 text-sm text-neutral-500">
            Create your first project and track its budget, status and deadline.
          </p>
        </div>
      )}
      <ProjectModal
        open={modalOpen}
        editingProject={editingProject}
        onClose={() => {
          setModalOpen(false);
          setEditingProject(null);
        }}
        onProjectSaved={(savedProject) => {
          setProjects((prev) => {
            const exists = prev.some((project) => project.id === savedProject.id);

            if (exists) {
              return prev.map((project) =>
                project.id === savedProject.id ? savedProject : project
              );
            }

            return [savedProject, ...prev];
          });
        }}
      />
    </MainLayout>
  );
}