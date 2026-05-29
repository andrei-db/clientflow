import { Calendar, Pencil, Trash2, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
export default function ProjectCard({
    project,
    onEdit,
    onDelete,
    onStatusChange,
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <Link
                        to={`/projects/${project.id}`}
                        className="text-lg font-semibold hover:text-neutral-300"
                    >
                        {project.title}
                    </Link>
                    <p className="mt-2 text-sm text-neutral-500">
                        {project.description || "No description"}
                    </p>
                    {project.client && (
                        <p className="mt-2 text-xs text-neutral-400">
                            Client: {project.client.name}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(project)}
                        className="rounded-xl p-2 text-neutral-500 transition hover:bg-white/10 hover:text-white"
                    >
                        <Pencil size={16} />
                    </button>

                    <button
                        onClick={() => onDelete(project.id)}
                        className="rounded-xl p-2 text-neutral-500 transition hover:bg-red-500/10 hover:text-red-400"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="mt-5 space-y-3 text-sm text-neutral-400">
                <p className="flex items-center gap-2">
                    <Wallet size={16} />
                    €{project.budget}
                </p>

                <p className="flex items-center gap-2">
                    <Calendar size={16} />
                    {project.deadline
                        ? new Date(project.deadline).toLocaleDateString()
                        : "No deadline"}
                </p>
            </div>

            <select
                value={project.status}
                onChange={(e) => onStatusChange(project, e.target.value)}
                className="mt-5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none"
            >
                <option value="planned">Planned</option>
                <option value="in_progress">In progress</option>
                <option value="completed">Completed</option>
            </select>
        </div>
    );
}