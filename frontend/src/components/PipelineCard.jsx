import { Mail, Phone } from "lucide-react";

export default function PipelineCard({ client, onStatusChange }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
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
        onChange={(e) => onStatusChange(client, e.target.value)}
        className="mt-4 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
      >
        <option value="lead">Lead</option>
        <option value="contacted">Contacted</option>
        <option value="proposal">Proposal</option>
        <option value="client">Client</option>
        <option value="lost">Lost</option>
      </select>
    </div>
  );
}