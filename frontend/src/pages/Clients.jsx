import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { Mail, Phone, Plus } from "lucide-react";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");

  async function loadClients() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/clients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Could not load clients");
        return;
      }

      setClients(data.clients);
    } catch (err) {
      setError("Could not connect to server");
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  return (
    <MainLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500">CRM</p>
          <h2 className="text-4xl font-bold tracking-tight">Clients</h2>
        </div>

        <button className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-neutral-200">
          <Plus size={18} />
          Add client
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {clients.map((client) => (
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

              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300">
                {client.status}
              </span>
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
    </MainLayout>
  );
}