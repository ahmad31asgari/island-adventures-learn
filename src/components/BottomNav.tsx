import { Link } from "@tanstack/react-router";
import { Home, Trophy, Gift, MoreHorizontal, User } from "lucide-react";

const items = [
  { to: "/subjects", icon: Home, label: "خانه" },
  { to: "/league", icon: Trophy, label: "لیگ" },
  { to: "/gifts", icon: Gift, label: "هدیه‌ها" },
  { to: "/more", icon: MoreHorizontal, label: "بیشتر" },
  { to: "/profile", icon: User, label: "پروفایل" },
] as const;

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-20 grid grid-cols-5 border-t border-border bg-card px-2 py-2">
      {items.map(({ to, icon: Icon, label }) => (
        <Link
          key={to}
          to={to}
          aria-label={label}
          className="flex flex-col items-center gap-0.5 rounded-xl py-1 text-[0.65rem] font-bold text-muted-foreground transition-colors"
          activeProps={{ className: "bg-secondary text-primary" }}
        >
          <Icon className="size-6" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
