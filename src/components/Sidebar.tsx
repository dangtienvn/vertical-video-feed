const navItems = [
  { label: "For You", icon: "🏠", active: true },
  { label: "Explore", icon: "🔍", active: false },
  { label: "Following", icon: "👥", active: false },
  { label: "Upload", icon: "➕", active: false },
  { label: "Profile", icon: "👤", active: false },
];

export default function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-black px-4 py-6 lg:flex">
      <h1 className="mb-8 text-2xl font-bold text-white">TokFeed</h1>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
              item.active
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <p className="text-xs text-white/40">© 2026 TokFeed</p>
    </aside>
  );
}
