import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { Plus } from "lucide-react";
import ProjectModal from "../components/ProjectModal";
import ProjectCard from "../components/ProjectCard";
import { apiFetch } from "../lib/api";

const columns = [
  { title: "Planned", status: "planned" },
  { title: "In Progress", status: "in_progress" },
  { title: "Completed", status: "completed" },
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  async function loadProjects() {
    try {
      setLoading(true);

      const project = await apiFetch("/api/projects");

      if (!project.res.ok) {
        setError(project.data.message || "Could not load projects");
        return;
      }

      setProjects(project.data.projects);
    } catch (err) {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  }

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

  async function handleDeleteProject(id) {
    try {
      const project = await apiFetch(`/api/projects/${id}`, {
        method: "DELETE"
      });

      if (!project.res.ok) return;

      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

  async function handleStatusChange(project, newStatus) {
    try {

      const projectApi = await apiFetch(
        `/api/projects/${project.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            title: project.title,
            description: project.description,
            status: newStatus,
            budget: project.budget,
            deadline: project.deadline,
          }),
        }
      );


      if (!projectApi.res.ok) return;

      setProjects((prev) =>
        prev.map((item) => (item.id === project.id ? projectApi.data.project : item))
      );
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

        <button
          onClick={() => {
            setEditingProject(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-neutral-200"
        >
          <Plus size={18} />
          Add project
        </button>
      </div>

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

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {loading && (
        <div className="grid gap-5 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]"
            />
          ))}
        </div>
      )}

      {!loading && filteredProjects.length > 0 && (
        <div className="grid gap-5 xl:grid-cols-3">
          {columns.map((column) => {
            const columnProjects = filteredProjects.filter(
              (project) => project.status === column.status
            );

            return (
              <div
                key={column.status}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="font-semibold">{column.title}</h3>

                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-400">
                    {columnProjects.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {columnProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onEdit={(project) => {
                        setEditingProject(project);
                        setModalOpen(true);
                      }}
                      onDelete={handleDeleteProject}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filteredProjects.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center">
          <h3 className="text-xl font-semibold">No projects found</h3>
          <p className="mt-2 text-sm text-neutral-500">
            Create your first project or adjust your filters.
          </p>

          <button
            onClick={() => {
              setEditingProject(null);
              setModalOpen(true);
            }}
            className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-neutral-200"
          >
            Add project
          </button>
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
            const exists = prev.some(
              (project) => project.id === savedProject.id
            );

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