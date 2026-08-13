import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Flame, Heart, Star } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { usePlayer } from "@/hooks/use-player";
import { clearPlayer } from "@/lib/player";
import { fa } from "@/lib/rng";
import { OSTAD_HAPPY } from "@/lib/characters";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "پروفایل من | جزیره‌های یادگیری" },
      { name: "description", content: "امتیاز، قلب‌ها و روزهای پیوسته‌ی تمرین تو." },
      { property: "og:title", content: "پروفایل من | جزیره‌های یادگیری" },
      { property: "og:description", content: "امتیاز، قلب‌ها و روزهای پیوسته‌ی تمرین تو." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { player, setPlayer } = usePlayer();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <main className="flex-1 space-y-5 px-4 py-6">
        <div className="flex flex-col items-center gap-2">
          <img
            src={OSTAD_HAPPY}
            alt="استاد سبیلو"
            width={768}
            height={768}
            className="h-32 w-32 object-contain"
          />
          <h1 className="text-xl font-extrabold">{player?.name || "دوست من"}</h1>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="card-3d flex flex-col items-center gap-1 py-4">
            <Star className="size-6 fill-xp text-xp" />
            <span className="font-extrabold">{fa(player?.xp ?? 0)}</span>
            <span className="text-xs font-bold text-muted-foreground">امتیاز</span>
          </div>
          <div className="card-3d flex flex-col items-center gap-1 py-4">
            <Flame className="size-6 fill-streak text-streak" />
            <span className="font-extrabold">{fa(player?.streak ?? 0)}</span>
            <span className="text-xs font-bold text-muted-foreground">روز پیوسته</span>
          </div>
          <div className="card-3d flex flex-col items-center gap-1 py-4">
            <Heart className="size-6 fill-heart text-heart" />
            <span className="font-extrabold">{fa(player?.hearts ?? 5)}</span>
            <span className="text-xs font-bold text-muted-foreground">قلب</span>
          </div>
        </div>
        <button
          type="button"
          className="card-3d w-full py-3 font-extrabold text-destructive"
          onClick={() => {
            clearPlayer();
            setPlayer(null);
            void navigate({ to: "/" });
          }}
        >
          تغییر کاربر
        </button>
      </main>
      <BottomNav />
    </div>
  );
}
