import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { apiFetch } from "../lib/api";
import PipelineCard from "../components/PipelineCard";
const columns = [
  { title: "Lead", status: "lead" },
  { title: "Contacted", status: "contacted" },
  { title: "Proposal", status: "proposal" },
  { title: "Client", status: "client" },
  { title: "Lost", status: "lost" },
];

export default function Pipeline() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadClients() {
    try {
      setLoading(true);

      const { res, data } = await apiFetch("/api/clients");

      if (!res.ok) {
        setError(data.message || "Could not load pipeline");
        return;
      }

      setClients(data.clients);
    } catch (err) {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(client, newStatus) {
    try {
      const { res, data } = await apiFetch(`/api/clients/${client.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: client.name,
          company: client.company,
          email: client.email,
          phone: client.phone,
          status: newStatus,
          value: client.value,
          notes: client.notes,
        }),
      });

      if (!res.ok) return;

      setClients((prev) =>
        prev.map((item) => (item.id === client.id ? data.client : item))
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  return (
    <MainLayout>
      <div className="mb-8">
        <p className="text-sm text-neutral-500">Sales</p>
        <h2 className="text-4xl font-bold tracking-tight">Pipeline</h2>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {loading && (
        <div className="grid gap-5 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-96 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]"
            />
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid gap-5 xl:grid-cols-5">
          {columns.map((column) => {
            const columnClients = clients.filter(
              (client) => client.status === column.status
            );

            return (
              <div
                key={column.status}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="font-semibold">{column.title}</h3>

                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-400">
                    {columnClients.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {columnClients.map((client) => (
                    <PipelineCard
                      key={client.id}
                      client={client}
                      onStatusChange={handleStatusChange}
                    />
                  ))}

                  {columnClients.length === 0 && (
                    <p className="rounded-2xl border border-dashed border-white/10 p-4 text-center text-sm text-neutral-500">
                      No clients
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}