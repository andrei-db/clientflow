import MainLayout from "../layout/MainLayout";
import StatCard from "../components/StatCard";
import { Users, BriefcaseBusiness, TrendingUp, BadgeDollarSign } from "lucide-react";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="mb-8">
        <p className="text-sm text-neutral-500">Overview</p>
        <h2 className="text-4xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Clients"
          value="24"
          description="+8% from last month"
          icon={Users}
        />

        <StatCard
          title="Active Projects"
          value="12"
          description="4 projects due this week"
          icon={BriefcaseBusiness}
        />

        <StatCard
          title="Conversion Rate"
          value="38%"
          description="+12% compared to last quarter"
          icon={TrendingUp}
        />

        <StatCard
          title="Estimated Revenue"
          value="€18.4k"
          description="Projected monthly value"
          icon={BadgeDollarSign}
        />
      </div>
    </MainLayout>
  );
}