import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { apiFetch } from "../lib/api";
import TaskCard from "../components/TaskCard";
export default function ProjectDetails() {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [error, setError] = useState("");

    const [taskTitle, setTaskTitle] = useState("");
    const [taskLoading, setTaskLoading] = useState(false);

    useEffect(() => {
        async function loadProject() {
            const { res, data } = await apiFetch(`/api/projects/${id}`);

            if (!res.ok) {
                setError(data.message || "Could not load project");
                return;
            }

            setProject(data.project);
        }

        loadProject();
    }, [id]);

    async function handleCreateTask(e) {
        e.preventDefault();

        if (!taskTitle.trim()) return;

        setTaskLoading(true);

        const { res, data } = await apiFetch("/api/tasks", {
            method: "POST",
            body: JSON.stringify({
                title: taskTitle,
                projectId: project.id,
            }),
        });

        setTaskLoading(false);

        if (!res.ok) return;

        setProject((prev) => ({
            ...prev,
            tasks: [data.task, ...prev.tasks],
        }));

        setTaskTitle("");
    }

    async function handleTaskStatusChange(task, status) {
        const { res, data } = await apiFetch(`/api/tasks/${task.id}`, {
            method: "PATCH",
            body: JSON.stringify({
                title: task.title,
                status,
            }),
        });

        if (!res.ok) return;

        setProject((prev) => ({
            ...prev,
            tasks: prev.tasks.map((item) =>
                item.id === task.id ? data.task : item
            ),
        }));
    }

    async function handleDeleteTask(id) {
        const { res } = await apiFetch(`/api/tasks/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) return;

        setProject((prev) => ({
            ...prev,
            tasks: prev.tasks.filter((task) => task.id !== id),
        }));
    }

    if (error) {
        return (
            <MainLayout>
                <p className="text-sm text-red-400">{error}</p>
            </MainLayout>
        );
    }

    if (!project) {
        return (
            <MainLayout>
                <p className="text-sm text-neutral-500">Loading project...</p>
            </MainLayout>
        );
    }

    const totalTasks = project.tasks.length;

    const completedTasks = project.tasks.filter(
        (task) => task.status === "done"
    ).length;

    const progress =
        totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;
    return (
        <MainLayout>
            <Link to="/projects" className="text-sm text-neutral-400 hover:text-white">
                ← Back to projects
            </Link>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-neutral-500">Project</p>
                        <h2 className="mt-2 text-4xl font-bold">{project.title}</h2>

                        {project.client && (
                            <Link
                                to={`/clients/${project.client.id}`}
                                className="mt-3 inline-block text-sm text-neutral-400 hover:text-white"
                            >
                                Client: {project.client.name} — {project.client.company}
                            </Link>
                        )}
                    </div>

                    <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-neutral-300">
                        {project.status}
                    </span>
                </div>

                {project.description && (
                    <p className="mt-6 text-neutral-400">{project.description}</p>
                )}
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm text-neutral-500">Budget</p>
                    <p className="mt-2 text-3xl font-bold">€{project.budget}</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm text-neutral-500">Deadline</p>
                    <p className="mt-2 text-2xl font-bold">
                        {project.deadline
                            ? new Date(project.deadline).toLocaleDateString()
                            : "No deadline"}
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm text-neutral-500">Created</p>
                    <p className="mt-2 text-2xl font-bold">
                        {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm text-neutral-500">Progress</p>

                    <p className="mt-2 text-3xl font-bold">
                        {progress}%
                    </p>

                    <div className="mt-4 h-2 rounded-full bg-white/10">
                        <div
                            className="h-2 rounded-full bg-white"
                            style={{
                                width: `${progress}%`,
                            }}
                        />
                    </div>

                    <p className="mt-3 text-xs text-neutral-500">
                        {completedTasks} / {totalTasks} tasks completed
                    </p>
                </div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-6">
                    <h3 className="text-xl font-semibold">Tasks</h3>
                    <p className="text-sm text-neutral-500">
                        Track work items for this project.
                    </p>
                </div>

                <form onSubmit={handleCreateTask} className="mb-6 flex gap-3">
                    <input
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Add a new task..."
                        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
                    />

                    <button
                        disabled={taskLoading}
                        className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-neutral-200 disabled:opacity-60"
                    >
                        {taskLoading ? "Adding..." : "Add"}
                    </button>
                </form>

                <div className="space-y-3">
                    {(project.tasks || []).map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onStatusChange={handleTaskStatusChange}
                            onDelete={handleDeleteTask}
                        />
                    ))}

                    {(project.tasks || []).length === 0 && (
                        <p className="text-sm text-neutral-500">No tasks yet.</p>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}