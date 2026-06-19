import Link from "next/link";

const navItems = [
  { label: "Home", icon: "🏠", active: true },
  { label: "Discover", icon: "🔍", active: false },
  { label: "Upload", icon: "➕", active: false, isUpload: true },
  { label: "Inbox", icon: "💬", active: false },
  { label: "Profile", icon: "👤", active: false },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 z-50 flex w-full items-center justify-around border-t border-white/10 bg-black pb-safe pt-2 text-white lg:hidden">
      {navItems.map((item) => (
        <button
          key={item.label}
          type="button"
          className="flex flex-col items-center gap-1 p-2"
        >
          {item.isUpload ? (
            <div className="flex h-8 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-400 via-white to-pink-500 p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-md bg-white text-black">
                <span className="text-xl leading-none">{item.icon}</span>
              </div>
            </div>
          ) : (
            <>
              <span className={`text-xl ${item.active ? "opacity-100" : "opacity-60"}`}>
                {item.icon}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  item.active ? "text-white" : "text-white/60"
                }`}
              >
                {item.label}
              </span>
            </>
          )}
        </button>
      ))}
    </nav>
  );
}
