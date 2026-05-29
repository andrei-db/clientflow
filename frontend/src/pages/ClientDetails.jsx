import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { apiFetch } from "../lib/api";

export default function ClientDetails() {
  const { id } = useParams();

  const [client, setClient] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClient() {
      const { res, data } = await apiFetch(`/api/clients/${id}`);

      if (!res.ok) {
        setError(data.message || "Could not load client");
        return;
      }

      setClient(data.client);
    }

    loadClient();
  }, [id]);

  if (error) {
    return (
      <MainLayout>
        <p className="text-sm text-red-400">{error}</p>
      </MainLayout>
    );
  }

  if (!client) {
    return (
      <MainLayout>
        <p className="text-sm text-neutral-500">Loading client...</p>
      </MainLayout>
    );
  }

  const totalProjectValue = client.projects.reduce(
    (sum, project) => sum + project.budget,
    0
  );

  return (
    <MainLayout>
      <Link to="/clients" className="text-sm text-neutral-400 hover:text-white">
        ← Back to clients
      </Link>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-neutral-500">{client.company}</p>
            <h2 className="mt-2 text-4xl font-bold">{client.name}</h2>
            <p className="mt-3 text-neutral-400">{client.email}</p>
          </div>

          <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-neutral-300">
            {client.status}
          </span>
        </div>

        {client.notes && (
          <div className="mt-6 rounded-2xl bg-black/30 p-4">
            <p className="text-sm text-neutral-500">Notes</p>
            <p className="mt-2 text-sm text-neutral-300">{client.notes}</p>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-neutral-500">Client value</p>
          <p className="mt-2 text-3xl font-bold">€{client.value}</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-neutral-500">Projects</p>
          <p className="mt-2 text-3xl font-bold">{client.projects.length}</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-neutral-500">Project value</p>
          <p className="mt-2 text-3xl font-bold">€{totalProjectValue}</p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="text-xl font-semibold">Projects</h3>

        <div className="mt-5 space-y-3">
          {client.projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-2xl bg-black/30 p-4"
            >
              <div>
                <p className="font-medium">{project.title}</p>
                <p className="text-sm text-neutral-500">
                  {project.description || "No description"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium">€{project.budget}</p>
                <p className="text-xs text-neutral-500">{project.status}</p>
              </div>
            </div>
          ))}

          {client.projects.length === 0 && (
            <p className="text-sm text-neutral-500">
              No projects assigned to this client yet.
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}