import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiFetch } from "../lib/api";

const emptyForm = {
    title: "",
    description: "",
    status: "planned",
    budget: "",
    deadline: "",
    clientId: "",
};

export default function ProjectModal({
    open,
    onClose,
    onProjectSaved,
    editingProject,
}) {
    const [formData, setFormData] = useState(emptyForm);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);

    useEffect(() => {
        if (editingProject) {
            setFormData({
                title: editingProject.title || "",
                description: editingProject.description || "",
                status: editingProject.status || "planned",
                budget: editingProject.budget || "",
                deadline: editingProject.deadline
                    ? editingProject.deadline.split("T")[0]
                    : "",
                clientId: editingProject.clientId || "",
            });
        } else {
            setFormData(emptyForm);
        }

        setError("");
    }, [editingProject, open]);

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

        try {

            const url = editingProject
                ? `/api/projects/${editingProject.id}`
                : "/api/projects";

            const method = editingProject ? "PATCH" : "POST";

            const project = await apiFetch(url, {
                method,
                body: JSON.stringify(formData),
            });



            if (!project.res.ok) {
                setError(project.data.message || "Could not create project");
                return;
            }

            onProjectSaved(project.data.project);
            setFormData(emptyForm);
            onClose();
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
                            {editingProject ? "Edit project" : "Add project"}
                        </h2>
                        <p className="text-sm text-neutral-500">
                            Create a new client project.
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
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Project title"
                        className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
                    />

                    <input
                        name="budget"
                        type="number"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="Budget"
                        className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
                    />

                    <select
                        name="clientId"
                        value={formData.clientId}
                        onChange={handleChange}
                        className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
                    >
                        <option value="">No client</option>

                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.name} — {client.company}
                            </option>
                        ))}
                    </select>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
                    >
                        <option value="planned">Planned</option>
                        <option value="in_progress">In progress</option>
                        <option value="completed">Completed</option>
                    </select>

                    <input
                        name="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
                    />
                </div>

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description..."
                    className="mt-4 h-32 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
                />

                {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

                <button
                    disabled={loading}
                    className="mt-6 w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black hover:bg-neutral-200 disabled:opacity-60"
                >
                    {loading
                        ? editingProject
                            ? "Saving..."
                            : "Creating..."
                        : editingProject
                            ? "Save changes"
                            : "Create project"}
                </button>
            </form>
        </div>
    );
}