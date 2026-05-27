import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  KanbanSquare,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Clients", path: "/clients", icon: Users },
  { label: "Projects", path: "/projects", icon: BriefcaseBusiness },
  { label: "Pipeline", path: "/pipeline", icon: KanbanSquare },
  { label: "Settings", path: "/settings", icon: Settings },
];

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#070707] text-white flex">
      <aside className="w-72 border-r border-white/10 bg-white/[0.03] p-5">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight">ClientFlow</h1>
          <p className="text-sm text-neutral-500 mt-1">CRM Dashboard</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                    isActive
                      ? "bg-white text-black"
                      : "text-neutral-400 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}