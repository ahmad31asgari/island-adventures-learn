import { Link } from "@tanstack/react-router";
import { Star, Headphones, Dumbbell, Video, BookOpen, Lock, Check } from "lucide-react";
import { OSTAD_HAPPY } from "@/lib/characters";
import { SUBJECTS, chapterOf, islandIcon } from "@/lib/curriculum";
import { fa } from "@/lib/rng";
import type { SubjectId } from "@/lib/types";

const ICONS = {
  star: Star,
  headphones: Headphones,
  dumbbell: Dumbbell,
  video: Video,
  book: BookOpen,
  chest: Check,
} as const;

interface Props {
  subject: SubjectId;
  completed: Set<number>;
  current: number;
}

/** Duolingo-style winding island path with the mascot next to the current island. */
export function IslandPath({ subject, completed, current }: Props) {
  const meta = SUBJECTS[subject];
  const visibleUpTo = Math.min(meta.islands - 1, current + 12);
  const indices = Array.from({ length: visibleUpTo + 1 }, (_, i) => i);
  const offsets = [0, -52, -78, -52, 0, 52, 78, 52];

  let lastChapter = -1;

  return (
    <div className="flex flex-col items-center gap-6 px-4 pb-10 pt-4">
      {indices.map((index) => {
        const chapter = chapterOf(subject, index);
        const header =
          chapter !== lastChapter ? (
            <div
              key={`h-${index}`}
              className="mt-2 w-full max-w-md rounded-2xl px-4 py-3 text-primary-foreground"
              style={{ backgroundColor: "var(--primary)", boxShadow: "0 5px 0 0 var(--primary-deep)" }}
            >
              <p className="text-xs font-bold opacity-80">
                فصل {fa(chapter + 1)} از {fa(meta.chapters.length)}
              </p>
              <p className="text-lg font-extrabold">{meta.chapters[chapter]}</p>
            </div>
          ) : null;
        if (chapter !== lastChapter) lastChapter = chapter;

        const isDone = completed.has(index);
        const isCurrent = index === current;
        const locked = index > current;
        const Icon = ICONS[islandIcon(index)];
        const offset = offsets[index % offsets.length]!;

        return (
          <div key={index} className="flex w-full flex-col items-center gap-6">
            {header}
            <div className="relative flex w-full items-center justify-center">
              <div style={{ transform: `translateX(${offset}px)` }} className="relative">
                {isCurrent && (
                  <span className="absolute -top-9 right-1/2 translate-x-1/2 rounded-lg bg-card px-2 py-1 text-[0.7rem] font-extrabold text-primary shadow">
                    شروع کن!
                  </span>
                )}
                {locked ? (
                  <div
                    className="island-node opacity-70"
                    style={{ backgroundColor: "var(--locked)", boxShadow: "0 8px 0 0 var(--locked-deep)" }}
                  >
                    <span className="island-gloss opacity-20" />
                    <Lock className="size-7 text-muted-foreground" />
                  </div>
                ) : (
                  <Link
                    to="/learn/$subject/island/$index"
                    params={{ subject, index: String(index) }}
                    aria-label={`جزیره ${fa(index + 1)}`}
                    className="island-node active:translate-y-1"
                    style={{
                      backgroundColor: isDone ? "var(--primary-deep)" : "var(--primary)",
                      boxShadow: `0 8px 0 0 ${isDone ? "var(--locked-deep)" : "var(--primary-deep)"}`,
                    }}
                  >
                    <span className="island-gloss" />
                    <Icon className="size-8 text-primary-foreground" />
                  </Link>
                )}
                {isCurrent && (
                  <img
                    src={OSTAD_HAPPY}
                    alt="استاد سبیلو"
                    loading="lazy"
                    width={768}
                    height={768}
                    className="animate-bob pointer-events-none absolute -left-28 bottom-0 h-28 w-28 object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
