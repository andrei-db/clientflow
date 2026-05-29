import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { apiFetch } from "../lib/api";

export default function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProject() {
      const { res, data } = await apiFetch(`/api/projects/${id}`);

      if (!res.ok) {
        setError(data.message || "Could not load project");
        return;
      }

      setProject(data.project);
    }

    loadProject();
  }, [id]);

  if (error) {
    return (
      <MainLayout>
        <p className="text-sm text-red-400">{error}</p>
      </MainLayout>
    );
  }

  if (!project) {
    return (
      <MainLayout>
        <p className="text-sm text-neutral-500">Loading project...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Link to="/projects" className="text-sm text-neutral-400 hover:text-white">
        ← Back to projects
      </Link>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-neutral-500">Project</p>
            <h2 className="mt-2 text-4xl font-bold">{project.title}</h2>

            {project.client && (
              <Link
                to={`/clients/${project.client.id}`}
                className="mt-3 inline-block text-sm text-neutral-400 hover:text-white"
              >
                Client: {project.client.name} — {project.client.company}
              </Link>
            )}
          </div>

          <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-neutral-300">
            {project.status}
          </span>
        </div>

        {project.description && (
          <p className="mt-6 text-neutral-400">{project.description}</p>
        )}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-neutral-500">Budget</p>
          <p className="mt-2 text-3xl font-bold">€{project.budget}</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-neutral-500">Deadline</p>
          <p className="mt-2 text-2xl font-bold">
            {project.deadline
              ? new Date(project.deadline).toLocaleDateString()
              : "No deadline"}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-neutral-500">Created</p>
          <p className="mt-2 text-2xl font-bold">
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </MainLayout>
  );
}