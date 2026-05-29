import {
    LayoutDashboard,
    Users,
    BriefcaseBusiness,
    KanbanSquare,
    Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import Topbar from "../components/Topbar";
import { useSelector } from "react-redux";
const navItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Clients", path: "/clients", icon: Users },
    { label: "Projects", path: "/projects", icon: BriefcaseBusiness },
    { label: "Pipeline", path: "/pipeline", icon: KanbanSquare },
    { label: "Settings", path: "/settings", icon: Settings },
];

export default function MainLayout({ children }) {
    const { mode } = useSelector((state) => state.theme);
    return (
        <div
            className={
                mode === "dark"
                    ? "min-h-screen bg-[#070707] text-white flex"
                    : "min-h-screen bg-[#f4f4f5] text-black flex"
            }
        >
            <aside
                className={
                    mode === "dark"
                        ? "w-72 border-r border-white/10 bg-white/[0.03] p-5"
                        : "w-72 border-r border-black/10 bg-white p-5"
                }
            >
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
                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${isActive
                                        ? mode === "dark"
                                            ? "bg-white text-black"
                                            : "bg-black text-white"
                                        : mode === "dark"
                                            ? "text-neutral-400 hover:bg-white/10 hover:text-white"
                                            : "text-neutral-500 hover:bg-black/5 hover:text-black"
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

            <main className="flex-1 p-8">
                <Topbar />
                {children}
            </main>
        </div>
    );
}