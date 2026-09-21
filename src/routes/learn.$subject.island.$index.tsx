import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { ActivityCard } from "@/components/ActivityCard";
import { buildIsland, isSubject } from "@/lib/curriculum";
import { completeIsland } from "@/lib/player";
import { usePlayer } from "@/hooks/use-player";
import { fa } from "@/lib/rng";
import { AnimatedOstad } from "@/components/AnimatedOstad";

export const Route = createFileRoute("/learn/$subject/island/$index")({
  head: () => ({
    meta: [
      { title: "تمرین جزیره | جزیره‌های یادگیری" },
      { name: "description", content: "فعالیت‌های این جزیره را انجام بده و ستاره بگیر." },
      { property: "og:title", content: "تمرین جزیره | جزیره‌های یادگیری" },
      { property: "og:description", content: "فعالیت‌های این جزیره را انجام بده و ستاره بگیر." },
    ],
  }),
  component: IslandRun,
});

function IslandRun() {
  const { subject, index } = Route.useParams();
  const navigate = useNavigate();
  const { player, patch } = usePlayer();
  const [step, setStep] = useState(0);
  const [right, setRight] = useState(0);
  const [done, setDone] = useState(false);

  const islandIndex = Number(index);
  const island = useMemo(
    () => (isSubject(subject) ? buildIsland(subject, islandIndex) : null),
    [subject, islandIndex],
  );

  if (!island) return <Navigate to="/subjects" />;

  const total = island.activities.length;

  const onNext = async (correct: boolean) => {
    const rights = right + (correct ? 1 : 0);
    setRight(rights);
    if (step + 1 < total) {
      setStep(step + 1);
      return;
    }
    setDone(true);
    const stars = rights === total ? 3 : rights >= total - 1 ? 2 : 1;
    if (player) {
      await patch({ xp: player.xp + rights * 10 });
      await completeIsland(player.id, island.subject, islandIndex, stars);
    }
  };

  if (done) {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 px-6 text-center">
        <AnimatedOstad mood="celebrate" interactive className="h-48 w-48" />
        <h1 className="text-2xl font-extrabold text-primary">جزیره تمام شد!</h1>
        <p className="font-bold">
          {fa(right)} از {fa(total)} درست • {fa(right * 10)} امتیاز
        </p>
        <button
          type="button"
          className="btn-3d w-full max-w-sm"
          onClick={() => void navigate({ to: "/learn/$subject", params: { subject } })}
        >
          برگشت به مسیر
        </button>
      </main>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          aria-label="بستن"
          onClick={() => void navigate({ to: "/learn/$subject", params: { subject } })}
        >
          <X className="size-6 text-muted-foreground" />
        </button>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(step / total) * 100}%`, backgroundColor: "var(--primary)" }}
          />
        </div>
        <span className="text-xs font-extrabold text-muted-foreground">
          {fa(step + 1)}/{fa(total)}
        </span>
      </header>
      <ActivityCard
        key={step}
        activity={island.activities[step]!}
        playerName={player?.name ?? ""}
        seed={islandIndex * 31 + step}
        onNext={(correct) => void onNext(correct)}
      />
    </div>
  );
}
