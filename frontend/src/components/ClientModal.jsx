import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export default function ClientModal({
  open,
  onClose,
  onClientSaved,
  editingClient,
}) {
  const emptyForm = {
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "lead",
    value: "",
    notes: "",
  };
  const [formData, setFormData] = useState(emptyForm);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingClient) {
      setFormData({
        name: editingClient.name || "",
        company: editingClient.company || "",
        email: editingClient.email || "",
        phone: editingClient.phone || "",
        status: editingClient.status || "lead",
        value: editingClient.value || "",
        notes: editingClient.notes || "",
      });
    } else {
      setFormData(emptyForm);
    }

    setError("");
  }, [editingClient, open]);

  if (!open) return null;

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const url = editingClient
        ? `/api/clients/${editingClient.id}`
        : "/api/clients";

      const methodText = editingClient ? "PATCH" : "POST";

      const client = await apiFetch(url, {
        method: methodText,
        body: JSON.stringify(formData)
      });


      if (!client.res.ok) {
        setError(client.data.message || "Could not create client");
        return;
      }

      onClientSaved(client.data.client);
      onClose();

      setFormData(emptyForm);
    } catch (err) {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#111111] p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {editingClient ? "Edit client" : "Add client"}
            </h2>
            <p className="text-sm text-neutral-500">
              Create a new CRM client.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full name"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
          />

          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
          />

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
          >
            <option value="lead">Lead</option>
            <option value="contacted">Contacted</option>
            <option value="proposal">Proposal</option>
            <option value="client">Client</option>
            <option value="lost">Lost</option>
          </select>

          <input
            name="value"
            type="number"
            value={formData.value}
            onChange={handleChange}
            placeholder="Estimated value"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
          />
        </div>

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes..."
          className="mt-4 h-32 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
        />

        {error && (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        )}

        <button
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black hover:bg-neutral-200"
        >
          {loading
            ? editingClient
              ? "Saving..."
              : "Creating..."
            : editingClient
              ? "Save changes"
              : "Create client"}
        </button>
      </form>
    </div>
  );
}