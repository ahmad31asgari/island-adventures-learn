import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { usePlayer } from "@/hooks/use-player";
import { fa } from "@/lib/rng";

export const Route = createFileRoute("/league")({
  head: () => ({
    meta: [
      { title: "لیگ برنز | جزیره‌های یادگیری" },
      { name: "description", content: "امتیازهایت را با دوستان مقایسه کن و در لیگ بالا برو." },
      { property: "og:title", content: "لیگ برنز | جزیره‌های یادگیری" },
      { property: "og:description", content: "امتیازهایت را با دوستان مقایسه کن." },
    ],
  }),
  component: League,
});

const RIVALS = [
  { name: "آرش", xp: 320 },
  { name: "نازی", xp: 280 },
  { name: "بهار", xp: 210 },
  { name: "کیان", xp: 140 },
];

function League() {
  const { player } = usePlayer();
  const rows = [...RIVALS, { name: player?.name || "تو", xp: player?.xp ?? 0 }].sort(
    (a, b) => b.xp - a.xp,
  );

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <main className="flex-1 space-y-3 px-4 py-6">
        <h1 className="flex items-center gap-2 text-xl font-extrabold">
          <Trophy className="size-6 text-xp" /> لیگ برنز
        </h1>
        {rows.map((row, i) => (
          <div key={row.name + i} className="card-3d flex items-center gap-3 px-4 py-3">
            <span className="w-6 text-center font-extrabold text-muted-foreground">{fa(i + 1)}</span>
            <span className="flex-1 font-extrabold">{row.name}</span>
            <span className="font-extrabold text-xp">{fa(row.xp)}</span>
          </div>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}
