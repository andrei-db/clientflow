import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { Mail, Phone, Plus, Trash2, Pencil } from "lucide-react";
import ClientModal from "../components/ClientModal";
import { apiFetch } from "../lib/api";
export default function Clients() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);


  async function loadClients() {
    try {
      setLoading(true);
      const clients = await apiFetch("/api/clients");

      if (!clients.res.ok) {
        setError(clients.data.message);
        return;
      }

      setClients(clients.data.clients);


    } catch (err) {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  }

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name?.toLowerCase().includes(search.toLowerCase()) ||
      client.company?.toLowerCase().includes(search.toLowerCase()) ||
      client.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  async function handleDeleteClient(id) {
    try {
      const client = await apiFetch(`/api/clients/${id}`, {
        method: "DELETE",
      });

      if (!client.res.ok) return;

      setClients((prev) =>
        prev.filter((client) => client.id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <MainLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500">CRM</p>
          <h2 className="text-4xl font-bold tracking-tight">Clients</h2>
        </div>

        <button className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-neutral-200"
          onClick={() => {
            setEditingClient(null);
            setModalOpen(true);
          }}>
          <Plus size={18} />
          Add client
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none"
        >
          <option value="all">All statuses</option>
          <option value="lead">Lead</option>
          <option value="contacted">Contacted</option>
          <option value="client">Client</option>
          <option value="proposal">Proposal</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {loading && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]"
            />
          ))}
        </div>
      )}

      {!loading && filteredClients.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{client.name}</h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    {client.company}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300">
                    {client.status}
                  </span>

                  <button
                    onClick={() => {
                      setEditingClient(client);
                      setModalOpen(true);
                    }}
                    className="rounded-xl p-2 text-neutral-500 transition hover:bg-white/10 hover:text-white"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="rounded-xl p-2 text-neutral-500 transition hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>

              <div className="mt-6 space-y-3 text-sm text-neutral-400">
                <p className="flex items-center gap-2">
                  <Mail size={16} />
                  {client.email}
                </p>

                {client.phone && (
                  <p className="flex items-center gap-2">
                    <Phone size={16} />
                    {client.phone}
                  </p>
                )}
              </div>

              <div className="mt-6 rounded-2xl bg-black/30 p-4">
                <p className="text-xs text-neutral-500">Estimated value</p>
                <p className="mt-1 text-2xl font-bold">€{client.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && filteredClients.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center">
          <h3 className="text-xl font-semibold">No clients found</h3>
          <p className="mt-2 text-sm text-neutral-500">
            Add your first client or adjust your search filters.
          </p>

          <button
            onClick={() => {
              setEditingClient(null);
              setModalOpen(true);
            }}
            className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-neutral-200"
          >
            Add client
          </button>
        </div>
      )}
      <ClientModal
        open={modalOpen}
        editingClient={editingClient}
        onClose={() => {
          setModalOpen(false);
          setEditingClient(null);
        }}
        onClientSaved={(savedClient) => {
          setClients((prev) => {
            const exists = prev.some((client) => client.id === savedClient.id);

            if (exists) {
              return prev.map((client) =>
                client.id === savedClient.id ? savedClient : client
              );
            }

            return [savedClient, ...prev];
          });
        }}
      />
    </MainLayout>
  );
}