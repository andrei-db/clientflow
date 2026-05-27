export default function StatCard({ title, value, description, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-400">{title}</p>
          <h3 className="mt-3 text-3xl font-bold">{value}</h3>
        </div>

        <div className="rounded-xl bg-white/10 p-3">
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-4 text-sm text-neutral-500">{description}</p>
    </div>
  );
}