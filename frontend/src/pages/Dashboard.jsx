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
    </MainLayout>
  );
}