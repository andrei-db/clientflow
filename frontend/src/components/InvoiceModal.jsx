import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { apiFetch } from "../lib/api";

const emptyForm = {
  number: "",
  amount: "",
  status: "draft",
  dueDate: "",
  clientId: "",
};

export default function InvoiceModal({ open, onClose, onInvoiceCreated }) {
  const [formData, setFormData] = useState(emptyForm);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadClients() {
      const { res, data } = await apiFetch("/api/clients");

      if (res.ok) {
        setClients(data.clients);
      }
    }

    if (open) {
      loadClients();
    }
  }, [open]);

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

    const { res, data } = await apiFetch("/api/invoices", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Could not create invoice");
      return;
    }

    onInvoiceCreated(data.invoice);
    setFormData(emptyForm);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#111111] p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Add invoice</h2>
            <p className="text-sm text-neutral-500">
              Create a new invoice for a client.
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
            name="number"
            value={formData.number}
            onChange={handleChange}
            placeholder="Invoice number"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
          />

          <input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>

          <input
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
          />

          <select
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            className="md:col-span-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
          >
            <option value="">Select client</option>

            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} — {client.company}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black hover:bg-neutral-200 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create invoice"}
        </button>
      </form>
    </div>
  );
}