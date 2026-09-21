import { useEffect, useState } from "react";
import {
  OSTAD_CELEBRATE,
  OSTAD_HAPPY,
  OSTAD_IDLE,
  OSTAD_THINK,
  OSTAD_WAVE,
} from "@/lib/characters";
import { cn } from "@/lib/utils";

export type OstadMood = "idle" | "welcome" | "thinking" | "celebrate";

interface Props {
  mood?: OstadMood;
  autoPlay?: boolean;
  className?: string;
  interactive?: boolean;
}

const POSES: Record<OstadMood, string> = {
  idle: OSTAD_IDLE,
  welcome: OSTAD_WAVE,
  thinking: OSTAD_THINK,
  celebrate: OSTAD_CELEBRATE,
};

const IDLE_SEQUENCE: OstadMood[] = ["idle", "idle", "thinking", "idle", "welcome"];

export function AnimatedOstad({
  mood = "idle",
  autoPlay = false,
  className,
  interactive = false,
}: Props) {
  const [pose, setPose] = useState<OstadMood>(mood);

  useEffect(() => {
    setPose(mood);
  }, [mood]);

  useEffect(() => {
    if (!autoPlay || mood !== "idle") return;
    let sequenceIndex = 0;
    const timer = window.setInterval(() => {
      sequenceIndex = (sequenceIndex + 1) % IDLE_SEQUENCE.length;
      setPose(IDLE_SEQUENCE[sequenceIndex] ?? "idle");
    }, 3600);
    return () => window.clearInterval(timer);
  }, [autoPlay, mood]);

  const reactToTap = () => {
    if (!interactive) return;
    setPose("welcome");
    window.setTimeout(() => setPose(mood), 1700);
  };

  const image = POSES[pose] ?? OSTAD_HAPPY;

  return (
    <button
      type="button"
      className={cn(
        "ostad-stage border-0 bg-transparent p-0",
        interactive ? "pointer-events-auto cursor-pointer" : "pointer-events-none",
        className,
      )}
      onClick={reactToTap}
      aria-label={interactive ? "سلام به استاد سبیلو" : undefined}
      tabIndex={interactive ? 0 : -1}
    >
      <img
        key={pose}
        src={image}
        alt="استاد سبیلو"
        width={768}
        height={768}
        className={cn(
          "h-full w-full object-contain",
          pose === "celebrate" ? "animate-ostad-celebrate" : "animate-ostad-pose",
        )}
      />
    </button>
  );
}