import { useSelector } from "react-redux";
import MainLayout from "../layout/MainLayout";

export default function Settings() {
  const { user } = useSelector((state) => state.auth);

  return (
    <MainLayout>
      <div className="mb-8">
        <p className="text-sm text-neutral-500">Account</p>
        <h2 className="text-4xl font-bold tracking-tight">Settings</h2>
      </div>

      <div className="max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="text-xl font-semibold">Profile information</h3>
        <p className="mt-2 text-sm text-neutral-500">
          Basic information about your account.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-neutral-400">Name</label>
            <input
              value={user?.name || ""}
              disabled
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-neutral-400 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-400">Email</label>
            <input
              value={user?.email || ""}
              disabled
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-neutral-400 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-400">Role</label>
            <input
              value={user?.role || "user"}
              disabled
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-neutral-400 outline-none"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}