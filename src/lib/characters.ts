import ostadHappy from "@/assets/char-ostad-happy.png";
import ostadSad from "@/assets/char-ostad-sad.png";
import ostadIdle from "@/assets/char-ostad-idle.png";
import ostadCelebrate from "@/assets/char-ostad-celebrate.png";
import ostadThink from "@/assets/char-ostad-think.png";
import ostadWave from "@/assets/char-ostad-wave.png";
import boy from "@/assets/char-boy.png";
import girl1 from "@/assets/char-girl1.png";
import girl2 from "@/assets/char-girl2.png";
import granny from "@/assets/char-granny.png";
import type { CharacterId } from "./types";

export interface CharacterInfo {
  id: CharacterId;
  name: string;
  image: string;
  /** gpt-4o-mini-tts voice + tone steering */
  voice: string;
  voiceStyle: string;
}

export const CHARACTERS: Record<CharacterId, CharacterInfo> = {
  ostad: {
    id: "ostad",
    name: "استاد سبیلو",
    image: ostadHappy,
    voice: "onyx",
    voiceStyle: "با لحن مهربان، شاد و کمی شوخ، مثل یک معلم دوست‌داشتنی و آرام صحبت کن.",
  },
  boy: {
    id: "boy",
    name: "آرش",
    image: boy,
    voice: "alloy",
    voiceStyle: "مثل یک پسر پرانرژی نه ساله، سرزنده و هیجان‌زده صحبت کن.",
  },
  girl1: {
    id: "girl1",
    name: "نازی",
    image: girl1,
    voice: "shimmer",
    voiceStyle: "مثل یک دختر نه ساله، شیرین، آرام و مهربان صحبت کن.",
  },
  girl2: {
    id: "girl2",
    name: "بهار",
    image: girl2,
    voice: "nova",
    voiceStyle: "مثل یک دختر کوچک کنجکاو و باهوش، با کمی هیجان صحبت کن.",
  },
  granny: {
    id: "granny",
    name: "مادربزرگ گلی",
    image: granny,
    voice: "sage",
    voiceStyle: "مثل یک مادربزرگ مهربان و آرام و با تجربه، شمرده صحبت کن.",
  },
};

export const OSTAD_HAPPY = ostadHappy;
export const OSTAD_SAD = ostadSad;
export const OSTAD_IDLE = ostadIdle;
export const OSTAD_CELEBRATE = ostadCelebrate;
export const OSTAD_THINK = ostadThink;
export const OSTAD_WAVE = ostadWave;

export const SIDE_CHARACTERS: CharacterId[] = ["boy", "girl1", "girl2", "granny", "ostad"];

const PRAISE = [
  (n: string) => `آفرین ${n}! کارت حرف نداشت.`,
  (n: string) => `عالی بود ${n}! داری حرفه‌ای می‌شی.`,
  (n: string) => `${n} جان، درست جواب دادی! چه دقیق!`,
  (n: string) => `واااو ${n}! مثل یک قهرمان جواب دادی.`,
  (n: string) => `دقیقاً همین بود ${n}! ادامه بده.`,
  (n: string) => `${n}، مغزت مثل برق کار می‌کنه!`,
  (n: string) => `چه هوشی داری ${n}! یک ستاره برای تو.`,
];

const ENCOURAGE = [
  (n: string) => `اشکالی نداره ${n}، دوباره با دقت نگاه کن.`,
  (n: string) => `نزدیک بودی ${n}! یک بار دیگه فکر کن.`,
  (n: string) => `${n} جان، اشتباه هم بخشی از یادگرفتنه.`,
  (n: string) => `نگران نباش ${n}، جواب درست رو با هم می‌بینیم.`,
  (n: string) => `کمی بیشتر دقت کن ${n}، تو می‌تونی!`,
  (n: string) => `${n}، این یکی سخت بود. بعدی رو می‌گیری!`,
];

export function praise(name: string, seed: number) {
  return PRAISE[Math.abs(seed) % PRAISE.length]!(name || "دوست من");
}

export function encourage(name: string, seed: number) {
  return ENCOURAGE[Math.abs(seed) % ENCOURAGE.length]!(name || "دوست من");
}
