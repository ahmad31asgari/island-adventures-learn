import type { Activity, CharacterId, Island, SubjectId } from "./types";
import { makeRng, intBetween, shuffle, fa } from "./rng";
import { MATH_CHAPTERS, mathActivity } from "./content/math";
import { FARSI_CHAPTERS, farsiActivity } from "./content/farsi";
import { SCIENCE_CHAPTERS, scienceActivity } from "./content/science";
import { SIDE_CHARACTERS } from "./characters";

export interface SubjectMeta {
  id: SubjectId;
  title: string;
  emoji: string;
  chapters: string[];
  islands: number;
  minActivities: number;
  maxActivities: number;
  color: string;
}

export const SUBJECTS: Record<SubjectId, SubjectMeta> = {
  math: {
    id: "math",
    title: "ریاضی",
    emoji: "➕",
    chapters: MATH_CHAPTERS,
    islands: 120,
    minActivities: 5,
    maxActivities: 6,
    color: "var(--subject-math)",
  },
  farsi: {
    id: "farsi",
    title: "فارسی",
    emoji: "📖",
    chapters: FARSI_CHAPTERS,
    islands: 138,
    minActivities: 7,
    maxActivities: 8,
    color: "var(--subject-farsi)",
  },
  science: {
    id: "science",
    title: "علوم",
    emoji: "🔬",
    chapters: SCIENCE_CHAPTERS,
    islands: 108,
    minActivities: 7,
    maxActivities: 8,
    color: "var(--subject-science)",
  },
};

export const SUBJECT_LIST = [SUBJECTS.math, SUBJECTS.farsi, SUBJECTS.science];

export function isSubject(value: string): value is SubjectId {
  return value === "math" || value === "farsi" || value === "science";
}

function generator(subject: SubjectId) {
  if (subject === "math") return mathActivity;
  if (subject === "farsi") return farsiActivity;
  return scienceActivity;
}

export function chapterOf(subject: SubjectId, islandIndex: number) {
  const meta = SUBJECTS[subject];
  const perChapter = Math.ceil(meta.islands / meta.chapters.length);
  return Math.min(meta.chapters.length - 1, Math.floor(islandIndex / perChapter));
}

function activityKey(a: Activity) {
  return `${a.kind}|${a.prompt}`;
}

/** Deterministically builds one island: current-chapter work plus review of past chapters. */
export function buildIsland(subject: SubjectId, islandIndex: number): Island {
  const meta = SUBJECTS[subject];
  const chapter = chapterOf(subject, islandIndex);
  const rand = makeRng((islandIndex + 1) * 7919 + subject.length * 131);
  const make = generator(subject);
  const total = intBetween(rand, meta.minActivities, meta.maxActivities);
  const reviewCount = chapter === 0 ? 0 : Math.max(1, Math.round(total * 0.3));
  const chars = shuffle(rand, SIDE_CHARACTERS);

  const activities: (Activity & { character: CharacterId })[] = [];
  const seen = new Set<string>();
  let guard = 0;

  while (activities.length < total && guard < total * 30) {
    guard++;
    const isReview = activities.length >= total - reviewCount;
    const targetChapter = isReview ? intBetween(rand, 0, Math.max(0, chapter - 1)) : chapter;
    const activity = make(targetChapter, rand);
    const key = activityKey(activity);
    if (seen.has(key)) continue;
    seen.add(key);
    activities.push({
      ...activity,
      ...(isReview ? { review: true } : {}),
      character: chars[activities.length % chars.length]!,
    });
  }

  return {
    index: islandIndex,
    subject,
    chapterIndex: chapter,
    chapterTitle: meta.chapters[chapter]!,
    title: `جزیره‌ی ${fa(islandIndex + 1)}`,
    activities,
  };
}

export const ISLAND_ICONS = ["star", "headphones", "dumbbell", "video", "book", "chest"] as const;

export function islandIcon(index: number) {
  return ISLAND_ICONS[index % ISLAND_ICONS.length]!;
}
