export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      <aside className="w-64 border-r border-white/10 p-6">
        <h1 className="text-2xl font-bold">ClientFlow</h1>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}