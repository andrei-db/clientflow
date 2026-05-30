import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import StatCard from "../components/StatCard";
import { apiFetch } from "../lib/api";
import {
    Users,
    BriefcaseBusiness,
    TrendingUp,
    BadgeDollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";
import ActivityFeed from "../components/ActivityFeed";
import ClientsStatusChart from "../components/ClientsStatusChart";
import ProjectsStatusChart from "../components/ProjectsStatusChart";
import RevenueChart from "../components/RevenueChart";
import InvoicesStatusChart from "../components/InvoicesStatusChart";
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
    const [invoiceStats, setInvoiceStats] = useState({
        totalInvoices: 0,
        draft: 0,
        sent: 0,
        paid: 0,
        overdue: 0,
        totalRevenue: 0,
        outstanding: 0,
    });

    const [recentClients, setRecentClients] = useState([]);
    const [recentProjects, setRecentProjects] = useState([]);
    const [activities, setActivities] = useState([]);
    useEffect(() => {
        async function loadStats() {
            const clientStats = await apiFetch("/api/clients/stats");

            if (clientStats.res.ok) {
                setStats(clientStats.data);
            }

            const clients = await apiFetch("/api/clients");

            if (clients.res.ok) {
                setRecentClients(clients.data.clients.slice(0, 5));
            }

            const projectStats = await apiFetch("/api/projects/stats");

            if (projectStats.res.ok) {
                setProjectStats(projectStats.data);
            }

            const projects = await apiFetch("/api/projects");

            if (projects.res.ok) {
                setRecentProjects(projects.data.projects.slice(0, 5));
            }

            const activitiesResponse = await apiFetch("/api/activities");

            if (activitiesResponse.res.ok) {
                setActivities(activitiesResponse.data.activities);
            }

            const invoiceStatsResponse =
                await apiFetch("/api/invoices/stats");

            if (invoiceStatsResponse.res.ok) {
                setInvoiceStats(invoiceStatsResponse.data);
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

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <ClientsStatusChart stats={stats} />
                <ProjectsStatusChart stats={projectStats} />
            </div>

            <div className="mt-8">
                <RevenueChart
                    clientRevenue={stats.estimatedRevenue}
                    projectRevenue={projectStats.totalBudget}
                />
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold">Recent projects</h3>
                            <p className="text-sm text-neutral-500">
                                Latest clients added to your workspace.
                            </p>
                        </div>

                        <Link
                            to="/clients"
                            className="text-sm text-neutral-400 hover:text-white"
                        >
                            View all
                        </Link>
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
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold">Recent projects</h3>
                            <p className="text-sm text-neutral-500">
                                Latest projects added to your workspace.
                            </p>
                        </div>

                        <Link
                            to="/projects"
                            className="text-sm text-neutral-400 hover:text-white"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentProjects.map((project) => (
                            <div
                                key={project.id}
                                className="flex items-center justify-between rounded-2xl bg-black/30 px-4 py-4"
                            >
                                <div>
                                    <p className="font-medium">{project.title}</p>
                                    <p className="text-sm text-neutral-500">
                                        {project.description || "No description"}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-medium">€{project.budget}</p>
                                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-400">
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {recentProjects.length === 0 && (
                            <p className="text-sm text-neutral-500">No projects yet.</p>
                        )}
                    </div>
                </div>
            </div>



            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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

            <div className="mt-8">
                <ActivityFeed
                    activities={activities}
                />
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Invoices"
                    value={invoiceStats.totalInvoices}
                    description="Total invoices created"
                    icon={BadgeDollarSign}
                />

                <StatCard
                    title="Paid Revenue"
                    value={`€${invoiceStats.totalRevenue}`}
                    description="Revenue from paid invoices"
                    icon={TrendingUp}
                />

                <StatCard
                    title="Outstanding"
                    value={`€${invoiceStats.outstanding}`}
                    description="Sent or overdue invoices"
                    icon={BriefcaseBusiness}
                />

                <StatCard
                    title="Overdue"
                    value={invoiceStats.overdue}
                    description="Invoices past due status"
                    icon={Users}
                />
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <RevenueChart
                    clientRevenue={stats.estimatedRevenue}
                    projectRevenue={projectStats.totalBudget}
                />

                <InvoicesStatusChart stats={invoiceStats} />
            </div>
        </MainLayout>
    );
}