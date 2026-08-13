import { createFileRoute, Link } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { SUBJECT_LIST } from "@/lib/curriculum";
import { fa } from "@/lib/rng";
import { usePlayer } from "@/hooks/use-player";

export const Route = createFileRoute("/subjects")({
  head: () => ({
    meta: [
      { title: "انتخاب درس | جزیره‌های یادگیری" },
      { name: "description", content: "ریاضی، فارسی یا علوم؟ درس امروزت را انتخاب کن." },
      { property: "og:title", content: "انتخاب درس | جزیره‌های یادگیری" },
      { property: "og:description", content: "ریاضی، فارسی یا علوم؟ درس امروزت را انتخاب کن." },
    ],
  }),
  component: Subjects,
});

function Subjects() {
  const { player } = usePlayer();

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <main className="flex-1 space-y-4 px-4 py-6">
        <h1 className="text-xl font-extrabold">
          {player?.name ? `${player.name} جان، امروز چی یاد بگیریم؟` : "امروز چی یاد بگیریم؟"}
        </h1>
        {SUBJECT_LIST.map((subject) => (
          <Link
            key={subject.id}
            to="/learn/$subject"
            params={{ subject: subject.id }}
            className="card-3d flex items-center gap-4 px-4 py-5"
          >
            <span className="text-4xl">{subject.emoji}</span>
            <span className="flex-1">
              <span className="block text-lg font-extrabold">{subject.title}</span>
              <span className="block text-xs font-bold text-muted-foreground">
                {fa(subject.chapters.length)} فصل • {fa(subject.islands)} جزیره
              </span>
            </span>
          </Link>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}
