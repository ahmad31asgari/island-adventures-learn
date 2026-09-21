import { useMemo, useState } from "react";
import { Volume2 } from "lucide-react";
import { CHARACTERS, encourage, praise } from "@/lib/characters";
import { useSpeech } from "@/hooks/use-speech";
import { playCorrect, playTap, playWrong } from "@/lib/sfx";
import type { Activity, CharacterId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AnimatedOstad, type OstadMood } from "@/components/AnimatedOstad";

type Act = Activity & { character: CharacterId };

interface Props {
  activity: Act;
  playerName: string;
  seed: number;
  onNext: (correct: boolean) => void;
}

type Phase = "answering" | "checked";

export function ActivityCard({ activity, playerName, seed, onNext }: Props) {
  const char = CHARACTERS[activity.character];
  const { speak, speaking } = useSpeech();
  const [phase, setPhase] = useState<Phase>("answering");
  const [correct, setCorrect] = useState(false);

  // per-kind answer state
  const [choice, setChoice] = useState<number | null>(null);
  const [fills, setFills] = useState<string[]>([]);
  const [matchLeft, setMatchLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<string[]>([]);
  const [placed, setPlaced] = useState<Record<string, number>>({});

  const shuffledTokens = useMemo(() => {
    if (activity.kind !== "order") return [];
    return [...activity.tokens].sort((a, b) => (a + seed).localeCompare(b + seed, "fa"));
  }, [activity, seed]);

  const rightColumn = useMemo(() => {
    if (activity.kind !== "match") return [];
    return [...activity.pairs.map((p) => p.right)].sort((a, b) => a.localeCompare(b, "fa"));
  }, [activity]);

  const ready = (() => {
    switch (activity.kind) {
      case "choice":
        return choice !== null;
      case "fill":
        return fills.filter(Boolean).length === activity.answers.length;
      case "match":
        return Object.keys(matches).length === activity.pairs.length;
      case "order":
        return order.length === activity.tokens.length;
      case "categorize":
        return Object.keys(placed).length === activity.items.length;
    }
  })();

  const evaluate = () => {
    switch (activity.kind) {
      case "choice":
        return choice === activity.correct;
      case "fill":
        return activity.answers.every((a, i) => fills[i] === a);
      case "match":
        return activity.pairs.every((p) => matches[p.left] === p.right);
      case "order":
        return activity.tokens.every((t, i) => order[i] === t);
      case "categorize":
        return activity.items.every((it) => placed[it.text] === it.bucket);
    }
  };

  const check = () => {
    const ok = evaluate();
    setCorrect(ok);
    setPhase("checked");
    if (ok) playCorrect(seed);
    else playWrong(seed);
  };

  const optionState = (isSelected: boolean, isCorrectOption: boolean) => {
    if (phase === "answering") return isSelected ? "selected" : "idle";
    if (isSelected) return correct ? "right" : "wrong";
    if (!correct && isCorrectOption) return "right-hint";
    return "idle";
  };

  const stateClass = (state: string) =>
    cn(
      "card-3d w-full px-4 py-3 text-start text-base font-bold transition-all",
      state === "idle" && "border-border",
      state === "selected" && "border-accent bg-secondary",
      state === "right" && "border-primary bg-primary/20 text-primary",
      state === "right-hint" && "border-primary/60",
      state === "wrong" && "border-destructive bg-destructive/20 text-destructive",
    );

  const ostadMood: OstadMood =
    phase === "answering" ? "idle" : correct ? "celebrate" : "thinking";

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <div className="flex-1 space-y-5 px-4 pb-40 pt-4">
        <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-extrabold text-muted-foreground">
          {activity.label}
          {activity.review ? " • مرور" : ""}
        </span>

        <div className="flex items-end gap-2">
          {activity.character === "ostad" ? (
            <AnimatedOstad
              mood={ostadMood}
              autoPlay={phase === "answering"}
              interactive={phase === "answering"}
              className="h-28 w-28 shrink-0"
            />
          ) : (
            <img
              src={char.image}
              alt={char.name}
              loading="lazy"
              width={768}
              height={768}
              className={cn(
                "h-28 w-28 shrink-0 object-contain",
                phase === "checked" && !correct && "animate-shake",
                phase === "checked" && correct && "animate-pop-in",
              )}
            />
          )}
          <div className="card-3d relative flex-1 p-3">
            <p className="text-base font-extrabold leading-7">{activity.prompt}</p>
            <button
              type="button"
              onClick={() => void speak(activity.speak ?? activity.prompt, activity.character)}
              className="mt-2 flex items-center gap-1 text-xs font-bold text-accent"
              aria-label="شنیدن سوال"
            >
              <Volume2 className={cn("size-4", speaking && "animate-pulse")} />
              بشنو
            </button>
          </div>
        </div>

        {"visual" in activity && activity.visual ? (
          <div className="card-3d grid place-items-center py-6 text-5xl">{activity.visual}</div>
        ) : null}

        {activity.kind === "choice" && (
          <div className="space-y-3">
            {activity.options.map((opt, i) => (
              <button
                key={opt + i}
                type="button"
                disabled={phase === "checked"}
                onClick={() => {
                  playTap();
                  setChoice(i);
                }}
                className={stateClass(optionState(choice === i, i === activity.correct))}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {activity.kind === "fill" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {activity.answers.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const next = [...fills];
                    next[i] = "";
                    setFills(next);
                  }}
                  className={cn(
                    "card-3d min-w-20 px-3 py-2 text-center font-extrabold",
                    phase === "checked" && (fills[i] === activity.answers[i] ? "border-primary text-primary" : "border-destructive text-destructive"),
                  )}
                >
                  {fills[i] || "؟"}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {activity.options.map((opt, i) => (
                <button
                  key={opt + i}
                  type="button"
                  disabled={phase === "checked"}
                  onClick={() => {
                    playTap();
                    const next = [...fills];
                    const slot = activity.answers.findIndex((_, idx) => !next[idx]);
                    if (slot >= 0) next[slot] = opt;
                    setFills(next);
                  }}
                  className="card-3d px-4 py-2 font-extrabold"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {activity.kind === "match" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
              {activity.pairs.map((p) => (
                <button
                  key={p.left}
                  type="button"
                  disabled={phase === "checked"}
                  onClick={() => {
                    playTap();
                    setMatchLeft(p.left);
                  }}
                  className={stateClass(
                    phase === "checked"
                      ? matches[p.left] === p.right
                        ? "right"
                        : "wrong"
                      : matchLeft === p.left
                        ? "selected"
                        : matches[p.left]
                          ? "right-hint"
                          : "idle",
                  )}
                >
                  {p.left}
                  {matches[p.left] ? <span className="block text-xs opacity-70">{matches[p.left]}</span> : null}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {rightColumn.map((right) => (
                <button
                  key={right}
                  type="button"
                  disabled={phase === "checked" || !matchLeft}
                  onClick={() => {
                    if (!matchLeft) return;
                    playTap();
                    setMatches({ ...matches, [matchLeft]: right });
                    setMatchLeft(null);
                  }}
                  className={stateClass(Object.values(matches).includes(right) ? "right-hint" : "idle")}
                >
                  {right}
                </button>
              ))}
            </div>
          </div>
        )}

        {activity.kind === "order" && (
          <div className="space-y-4">
            <div className="card-3d flex min-h-16 flex-wrap items-center gap-2 p-3">
              {order.map((t, i) => (
                <button
                  key={t + i}
                  type="button"
                  disabled={phase === "checked"}
                  onClick={() => setOrder(order.filter((_, idx) => idx !== i))}
                  className={cn(
                    "rounded-lg bg-secondary px-3 py-1.5 font-extrabold",
                    phase === "checked" && (activity.tokens[i] === t ? "text-primary" : "text-destructive"),
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {shuffledTokens
                .filter((t) => order.filter((o) => o === t).length < shuffledTokens.filter((s) => s === t).length)
                .map((t, i) => (
                  <button
                    key={t + i}
                    type="button"
                    disabled={phase === "checked"}
                    onClick={() => {
                      playTap();
                      setOrder([...order, t]);
                    }}
                    className="card-3d px-3 py-2 font-extrabold"
                  >
                    {t}
                  </button>
                ))}
            </div>
          </div>
        )}

        {activity.kind === "categorize" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {activity.items
                .filter((it) => placed[it.text] === undefined)
                .map((it) => (
                  <span key={it.text} className="card-3d px-3 py-2 font-extrabold">
                    {it.text}
                  </span>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {activity.buckets.map((bucket, bIdx) => (
                <div key={bucket} className="card-3d min-h-28 space-y-2 p-3">
                  <p className="text-sm font-extrabold text-accent">{bucket}</p>
                  {activity.items
                    .filter((it) => placed[it.text] === bIdx)
                    .map((it) => (
                      <button
                        key={it.text}
                        type="button"
                        disabled={phase === "checked"}
                        onClick={() => {
                          const next = { ...placed };
                          delete next[it.text];
                          setPlaced(next);
                        }}
                        className={cn(
                          "block w-full rounded-lg bg-secondary px-2 py-1 text-sm font-bold",
                          phase === "checked" && (it.bucket === bIdx ? "text-primary" : "text-destructive"),
                        )}
                      >
                        {it.text}
                      </button>
                    ))}
                  <button
                    type="button"
                    disabled={phase === "checked"}
                    onClick={() => {
                      const remaining = activity.items.find((it) => placed[it.text] === undefined);
                      if (!remaining) return;
                      playTap();
                      setPlaced({ ...placed, [remaining.text]: bIdx });
                    }}
                    className="w-full rounded-lg border-2 border-dashed border-border py-1 text-xs font-bold text-muted-foreground"
                  >
                    اینجا بگذار
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 border-t-2 p-4",
          phase === "answering" && "border-border bg-background",
          phase === "checked" && correct && "border-primary bg-primary/10",
          phase === "checked" && !correct && "border-destructive bg-destructive/10",
        )}
      >
        {phase === "checked" && (
          <p
            className={cn(
              "animate-pop-in mb-3 text-base font-extrabold",
              correct ? "text-primary" : "text-destructive",
            )}
          >
            {correct ? praise(playerName, seed) : encourage(playerName, seed)}
          </p>
        )}
        <button
          type="button"
          disabled={!ready && phase === "answering"}
          onClick={() => {
            if (phase === "answering") check();
            else onNext(correct);
          }}
          className={cn("btn-3d w-full text-lg active:btn-3d-press", !ready && phase === "answering" && "opacity-40")}
          style={
            phase === "checked" && !correct
              ? { backgroundColor: "var(--destructive)", boxShadow: "0 5px 0 0 var(--destructive-deep)" }
              : undefined
          }
        >
          {phase === "answering" ? "بررسی" : "ادامه"}
        </button>
      </div>
    </div>
  );
}
