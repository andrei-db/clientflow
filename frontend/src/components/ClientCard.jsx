import { Mail, Phone, Pencil, Trash2 } from "lucide-react";

export default function ClientCard({ client, onEdit, onDelete }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{client.name}</h3>
          <p className="mt-1 text-sm text-neutral-500">{client.company}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300">
            {client.status}
          </span>

          <button
            onClick={() => onEdit(client)}
            className="rounded-xl p-2 text-neutral-500 transition hover:bg-white/10 hover:text-white"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => onDelete(client.id)}
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
  );
}