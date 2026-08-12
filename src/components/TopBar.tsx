import { Link } from "@tanstack/react-router";
import { Flame, Heart, Star, BookOpen } from "lucide-react";
import { fa } from "@/lib/rng";
import { SUBJECTS } from "@/lib/curriculum";
import type { SubjectId } from "@/lib/types";

interface Props {
  subject: SubjectId;
  streak: number;
  xp: number;
  hearts: number;
}

export function TopBar({ subject, streak, xp, hearts }: Props) {
  const meta = SUBJECTS[subject];
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
      <Link
        to="/subjects"
        className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-1.5 text-sm font-bold"
        aria-label="تغییر درس"
      >
        <BookOpen className="size-5" style={{ color: meta.color }} />
        <span>{meta.title}</span>
      </Link>
      <div className="flex items-center gap-1 text-sm font-extrabold text-streak">
        <Flame className="size-5 fill-streak" />
        {fa(streak)}
      </div>
      <div className="flex items-center gap-1 text-sm font-extrabold text-xp">
        <Star className="size-5 fill-xp" />
        {fa(xp)}
      </div>
      <div className="flex items-center gap-1 text-sm font-extrabold text-heart">
        <Heart className="size-5 fill-heart" />
        {fa(hearts)}
      </div>
    </header>
  );
}
