import { Trash2 } from "lucide-react";

export default function TaskCard({ task, onStatusChange, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-black/30 p-4">
      <div>
        <p className="font-medium">{task.title}</p>
        <p className="text-xs text-neutral-500">{task.status}</p>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value)}
          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
        >
          <option value="todo">Todo</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>

        <button
          onClick={() => onDelete(task.id)}
          className="rounded-xl p-2 text-neutral-500 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}