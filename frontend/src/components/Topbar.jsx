import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <p className="text-sm text-neutral-500">Welcome back</p>
        <h1 className="text-2xl font-semibold">Manage your business flow</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <Search size={18} className="text-neutral-500" />
          <input
            className="w-64 bg-transparent text-sm outline-none placeholder:text-neutral-600"
            placeholder="Search clients, projects..."
          />
        </div>

        <button className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 hover:bg-white/10 transition">
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
          <div className="h-9 w-9 rounded-full bg-white text-black grid place-items-center font-bold">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">Andrei</p>
            <p className="text-xs text-neutral-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}