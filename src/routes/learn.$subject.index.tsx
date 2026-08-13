import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { IslandPath } from "@/components/IslandPath";
import { isSubject, SUBJECTS } from "@/lib/curriculum";
import { fetchProgress } from "@/lib/player";
import { usePlayer } from "@/hooks/use-player";

export const Route = createFileRoute("/learn/$subject/")({
  head: () => ({
    meta: [
      { title: "مسیر جزیره‌ها | جزیره‌های یادگیری" },
      { name: "description", content: "جزیره‌ها را یکی‌یکی باز کن و ستاره جمع کن." },
      { property: "og:title", content: "مسیر جزیره‌ها | جزیره‌های یادگیری" },
      { property: "og:description", content: "جزیره‌ها را یکی‌یکی باز کن و ستاره جمع کن." },
    ],
  }),
  component: LearnPath,
});

function LearnPath() {
  const { subject } = Route.useParams();
  const { player, loading } = usePlayer();

  const progress = useQuery({
    queryKey: ["progress", player?.id, subject],
    enabled: Boolean(player?.id) && isSubject(subject),
    queryFn: () => fetchProgress(player!.id, subject as never),
  });

  if (!isSubject(subject)) return <Navigate to="/subjects" />;
  if (!loading && !player) return <Navigate to="/" />;

  const rows = progress.data ?? [];
  const completed = new Set(rows.filter((r) => r.completions > 0).map((r) => r.island_index));
  const current = Math.min(SUBJECTS[subject].islands - 1, completed.size);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <TopBar
        subject={subject}
        streak={player?.streak ?? 0}
        xp={player?.xp ?? 0}
        hearts={player?.hearts ?? 5}
      />
      <main className="flex-1 overflow-x-hidden">
        <IslandPath subject={subject} completed={completed} current={current} />
      </main>
      <BottomNav />
    </div>
  );
}
