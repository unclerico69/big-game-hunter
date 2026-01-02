import { Link, useLocation } from "wouter";
import { LayoutDashboard, Tv2, Settings, ListCheck, Zap } from "lucide-react";
import { clsx } from "clsx";
import { GiDeer } from "react-icons/gi";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/recommendations", label: "Auto-Tuner", icon: Zap },
    { href: "/setup", label: "TV Setup", icon: Tv2 },
    { href: "/preferences", label: "Preferences", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6">
          <h1 className="text-xl font-display font-bold text-primary flex items-center gap-2">
            <GiDeer className="w-8 h-8" />
            <div className="flex flex-col leading-none">
              <span className="text-sm tracking-widest text-muted-foreground">BIG GAME</span>
              <span className="text-glow tracking-tighter text-2xl">HUNTER</span>
            </div>
          </h1>
          <p className="text-[10px] text-muted-foreground/60 mt-2 tracking-[0.2em] uppercase">Venue Management</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium",
                isActive 
                  ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(34,197,94,0.1)]" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}>
                <item.icon className={clsx(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="bg-secondary/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">System Online</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground/60">
              Last sync: Just now
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 pb-24">
        {children}
      </main>

      {/* Mobile Nav (Bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-lg border-t border-border p-4 flex justify-around z-50">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className={clsx(
              "flex flex-col items-center gap-1",
              isActive ? "text-primary" : "text-muted-foreground"
            )}>
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
