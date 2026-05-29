import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { Mail, Phone } from "lucide-react";
import { apiFetch } from "../lib/api";

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
                    <div
                      key={client.id}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4"
                    >
                      <h4 className="font-semibold">{client.name}</h4>
                      <p className="mt-1 text-sm text-neutral-500">
                        {client.company}
                      </p>

                      <div className="mt-4 space-y-2 text-sm text-neutral-400">
                        <p className="flex items-center gap-2">
                          <Mail size={15} />
                          {client.email}
                        </p>

                        {client.phone && (
                          <p className="flex items-center gap-2">
                            <Phone size={15} />
                            {client.phone}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 rounded-xl bg-black/30 p-3">
                        <p className="text-xs text-neutral-500">Value</p>
                        <p className="text-lg font-bold">€{client.value}</p>
                      </div>

                      <select
                        value={client.status}
                        onChange={(e) =>
                          handleStatusChange(client, e.target.value)
                        }
                        className="mt-4 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
                      >
                        <option value="lead">Lead</option>
                        <option value="contacted">Contacted</option>
                        <option value="proposal">Proposal</option>
                        <option value="client">Client</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>
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