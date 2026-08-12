export type SubjectId = "math" | "farsi" | "science";

export type CharacterId = "ostad" | "boy" | "girl1" | "girl2" | "granny";

export type ActivityKind =
  | "choice"
  | "fill"
  | "match"
  | "order"
  | "categorize";

export interface BaseActivity {
  label: string;
  speak?: string;
  review?: boolean;
}

export interface ChoiceActivity extends BaseActivity {
  kind: "choice";
  prompt: string;
  visual?: string;
  options: string[];
  correct: number;
}

export interface FillActivity extends BaseActivity {
  kind: "fill";
  prompt: string;
  visual?: string;
  /** one or two blanks */
  answers: string[];
  options: string[];
}

export interface MatchActivity extends BaseActivity {
  kind: "match";
  prompt: string;
  pairs: { left: string; right: string }[];
}

export interface OrderActivity extends BaseActivity {
  kind: "order";
  prompt: string;
  /** correct order */
  tokens: string[];
}

export interface CategorizeActivity extends BaseActivity {
  kind: "categorize";
  prompt: string;
  buckets: string[];
  items: { text: string; bucket: number }[];
}

export type Activity =
  | ChoiceActivity
  | FillActivity
  | MatchActivity
  | OrderActivity
  | CategorizeActivity;

export interface Island {
  index: number;
  subject: SubjectId;
  chapterIndex: number;
  chapterTitle: string;
  title: string;
  activities: (Activity & { character: CharacterId })[];
}
