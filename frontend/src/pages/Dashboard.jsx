import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import StatCard from "../components/StatCard";
import {
    Users,
    BriefcaseBusiness,
    TrendingUp,
    BadgeDollarSign,
} from "lucide-react";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalClients: 0,
        leads: 0,
        contacted: 0,
        activeClients: 0,
        estimatedRevenue: 0,
    });
    const [projectStats, setProjectStats] = useState({
        totalProjects: 0,
        planned: 0,
        inProgress: 0,
        completed: 0,
        totalBudget: 0,
    });

    const [recentClients, setRecentClients] = useState([]);

    useEffect(() => {
        async function loadStats() {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:4000/api/clients/stats", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();



            if (res.ok) {
                setStats(data);
            }

            const clientsRes = await fetch("http://localhost:4000/api/clients", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const clientsData = await clientsRes.json();

            if (clientsRes.ok) {
                setRecentClients(clientsData.clients.slice(0, 5));
            }

            const projectStatsRes = await fetch("http://localhost:4000/api/projects/stats", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const projectStatsData = await projectStatsRes.json();

            if (projectStatsRes.ok) {
                setProjectStats(projectStatsData);
            }
        }

        loadStats();
    }, []);

    return (
        <MainLayout>
            <div className="mb-8">
                <p className="text-sm text-neutral-500">Overview</p>
                <h2 className="text-4xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Clients"
                    value={stats.totalClients}
                    description="All CRM contacts"
                    icon={Users}
                />

                <StatCard
                    title="Leads"
                    value={stats.leads}
                    description="Potential clients"
                    icon={TrendingUp}
                />

                <StatCard
                    title="Contacted"
                    value={stats.contacted}
                    description="Clients already contacted"
                    icon={BriefcaseBusiness}
                />

                <StatCard
                    title="Estimated Revenue"
                    value={`€${stats.estimatedRevenue}`}
                    description="Total pipeline value"
                    icon={BadgeDollarSign}
                />
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-6">
                    <h3 className="text-xl font-semibold">Recent clients</h3>
                    <p className="text-sm text-neutral-500">
                        Latest clients added to your CRM.
                    </p>
                </div>

                <div className="space-y-3">
                    {recentClients.map((client) => (
                        <div
                            key={client.id}
                            className="flex items-center justify-between rounded-2xl bg-black/30 px-4 py-4"
                        >
                            <div>
                                <p className="font-medium">{client.name}</p>
                                <p className="text-sm text-neutral-500">{client.company}</p>
                            </div>

                            <div className="text-right">
                                <p className="text-sm font-medium">€{client.value}</p>
                                <p className="text-xs text-neutral-500">{client.status}</p>
                            </div>
                        </div>
                    ))}

                    {recentClients.length === 0 && (
                        <p className="text-sm text-neutral-500">No clients yet.</p>
                    )}
                </div>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Projects"
                    value={projectStats.totalProjects}
                    description="All active and completed work"
                    icon={BriefcaseBusiness}
                />

                <StatCard
                    title="In Progress"
                    value={projectStats.inProgress}
                    description="Projects currently being worked on"
                    icon={TrendingUp}
                />

                <StatCard
                    title="Completed"
                    value={projectStats.completed}
                    description="Successfully delivered projects"
                    icon={Users}
                />

                <StatCard
                    title="Project Budget"
                    value={`€${projectStats.totalBudget}`}
                    description="Total project value"
                    icon={BadgeDollarSign}
                />
            </div>
        </MainLayout>
    );
}