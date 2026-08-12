import type { Activity } from "../types";
import { fa, intBetween, pick, shuffle } from "../rng";

export const MATH_CHAPTERS = [
  "الگوها",
  "عددهای چهار رقمی",
  "عددهای کسری",
  "ضرب و تقسیم",
  "محیط و مساحت",
  "جمع و تفریق",
  "آمار و احتمال",
  "ضرب عددهای دو رقمی",
];

function choice(
  label: string,
  prompt: string,
  correctText: string,
  wrong: string[],
  rand: () => number,
  visual?: string,
): Activity {
  const options = shuffle(rand, [correctText, ...wrong]);
  return {
    kind: "choice",
    label,
    prompt,
    ...(visual ? { visual } : {}),
    options,
    correct: options.indexOf(correctText),
    speak: prompt,
  };
}

function numFill(label: string, prompt: string, answers: string[], rand: () => number): Activity {
  const distractors = answers.map((a) => fa(Number(String(a).replace(/[^\d۰-۹]/g, "0")) || 0));
  const pool = new Set(answers);
  while (pool.size < answers.length + 3) {
    const base = Number(answers[0]?.replace(/\D/g, "") ?? "0");
    pool.add(fa(Math.max(0, base + intBetween(rand, -9, 9))));
  }
  void distractors;
  return {
    kind: "fill",
    label,
    prompt,
    answers,
    options: shuffle(rand, [...pool]),
    speak: prompt,
  };
}

/** Chapter-specific generators (real grade-3 math content, endless variations). */
export function mathActivity(chapter: number, rand: () => number): Activity {
  switch (chapter) {
    case 0: {
      const start = intBetween(rand, 1, 9);
      const step = pick(rand, [2, 3, 4, 5, 10]);
      const seq = [start, start + step, start + 2 * step, start + 3 * step];
      const type = intBetween(rand, 0, 2);
      if (type === 0) {
        return numFill(
          "جای خالی",
          `الگو را کامل کن: ${seq.slice(0, 3).map(fa).join(" ، ")} ، ...`,
          [fa(seq[3]!)],
          rand,
        );
      }
      if (type === 1) {
        return {
          kind: "order",
          label: "مرتب‌سازی",
          prompt: "عددها را از کوچک به بزرگ مرتب کن.",
          tokens: seq.map(fa),
          speak: "عددها را از کوچک به بزرگ مرتب کن.",
        };
      }
      return choice(
        "پیش‌بینی",
        `در این الگو هر بار چند تا اضافه می‌شود؟ ${seq.map(fa).join(" ، ")}`,
        fa(step),
        [fa(step + 1), fa(step + 2), fa(Math.max(1, step - 1))],
        rand,
      );
    }
    case 1: {
      const n = intBetween(rand, 1000, 9999);
      const type = intBetween(rand, 0, 2);
      const digits = String(n).split("").map(Number);
      if (type === 0) {
        return choice(
          "سوال از عدد",
          `در عدد ${fa(n)} رقم صدگان کدام است؟`,
          fa(digits[1]!),
          [fa(digits[0]!), fa(digits[2]!), fa(digits[3]!)],
          rand,
        );
      }
      if (type === 1) {
        const m = intBetween(rand, 1000, 9999);
        return choice(
          "مقایسه",
          `کدام عدد بزرگ‌تر است؟ ${fa(n)} یا ${fa(m)}`,
          fa(Math.max(n, m)),
          [fa(Math.min(n, m))],
          rand,
        );
      }
      return numFill("جای خالی", `عدد بعد از ${fa(n)} کدام است؟`, [fa(n + 1)], rand);
    }
    case 2: {
      const d = pick(rand, [2, 3, 4, 5, 6, 8]);
      const num = intBetween(rand, 1, d - 1);
      const type = intBetween(rand, 0, 2);
      if (type === 0) {
        const emo = "🍕".repeat(d);
        return choice(
          "سوال از تصویر",
          `یک پیتزا به ${fa(d)} قسمت مساوی تقسیم شده و ${fa(num)} تکه خورده شده. چه کسری خورده شده است؟`,
          `${fa(num)}/${fa(d)}`,
          [`${fa(d)}/${fa(num)}`, `${fa(num)}/${fa(d + 1)}`, `${fa(num + 1)}/${fa(d)}`],
          rand,
          emo,
        );
      }
      if (type === 1) {
        return choice(
          "مقایسه کسر",
          `کدام کسر بزرگ‌تر است؟ ${fa(1)}/${fa(d)} یا ${fa(1)}/${fa(d + 2)}`,
          `${fa(1)}/${fa(d)}`,
          [`${fa(1)}/${fa(d + 2)}`],
          rand,
        );
      }
      return {
        kind: "match",
        label: "وصل کردنی",
        prompt: "هر کسر را به شکل خواندنش وصل کن.",
        pairs: [
          { left: "۱/۲", right: "یک دوم" },
          { left: "۱/۳", right: "یک سوم" },
          { left: "۳/۴", right: "سه چهارم" },
        ],
      };
    }
    case 3: {
      const a = intBetween(rand, 2, 9);
      const b = intBetween(rand, 2, 9);
      const type = intBetween(rand, 0, 2);
      if (type === 0) {
        return numFill("جای خالی", `${fa(a)} × ${fa(b)} = ...`, [fa(a * b)], rand);
      }
      if (type === 1) {
        return numFill("جای خالی دوتایی", `${fa(a * b)} ÷ ${fa(a)} = ...  و  ${fa(a * b)} ÷ ${fa(b)} = ...`, [fa(b), fa(a)], rand);
      }
      return choice(
        "اشتباه‌یابی",
        `کدام جمله نادرست است؟`,
        `${fa(a)} × ${fa(b)} = ${fa(a * b + 2)}`,
        [`${fa(a)} × ${fa(b)} = ${fa(a * b)}`, `${fa(b)} × ${fa(a)} = ${fa(a * b)}`],
        rand,
      );
    }
    case 4: {
      const w = intBetween(rand, 2, 12);
      const h = intBetween(rand, 2, 12);
      const type = intBetween(rand, 0, 1);
      if (type === 0) {
        return numFill(
          "جای خالی",
          `محیط مستطیلی با طول ${fa(w)} و عرض ${fa(h)} سانتی‌متر چند سانتی‌متر است؟`,
          [fa(2 * (w + h))],
          rand,
        );
      }
      return choice(
        "سوال از تصویر",
        `مساحت مستطیلی با طول ${fa(w)} و عرض ${fa(h)} سانتی‌متر چقدر است؟`,
        `${fa(w * h)} سانتی‌متر مربع`,
        [`${fa(2 * (w + h))} سانتی‌متر مربع`, `${fa(w + h)} سانتی‌متر مربع`],
        rand,
        "📐",
      );
    }
    case 5: {
      const a = intBetween(rand, 120, 980);
      const b = intBetween(rand, 100, 800);
      const type = intBetween(rand, 0, 1);
      if (type === 0) return numFill("جای خالی", `${fa(a)} + ${fa(b)} = ...`, [fa(a + b)], rand);
      const big = Math.max(a, b);
      const small = Math.min(a, b);
      return numFill("جای خالی", `${fa(big)} − ${fa(small)} = ...`, [fa(big - small)], rand);
    }
    case 6: {
      const type = intBetween(rand, 0, 1);
      if (type === 0) {
        const counts = [intBetween(rand, 2, 9), intBetween(rand, 2, 9), intBetween(rand, 2, 9)];
        const maxIdx = counts.indexOf(Math.max(...counts));
        const names = ["سیب", "پرتقال", "موز"];
        return choice(
          "سوال از نمودار",
          `در نمودار: سیب ${fa(counts[0]!)} ، پرتقال ${fa(counts[1]!)} ، موز ${fa(counts[2]!)}. کدام بیشتر است؟`,
          names[maxIdx]!,
          names.filter((_, i) => i !== maxIdx),
          rand,
          "📊",
        );
      }
      return choice(
        "احتمال",
        "در کیسه‌ای ۵ مهره قرمز و ۱ مهره آبی است. بیرون آوردن کدام رنگ محتمل‌تر است؟",
        "قرمز",
        ["آبی", "هر دو یکسان"],
        rand,
        "🎒",
      );
    }
    default: {
      const a = intBetween(rand, 11, 49);
      const b = intBetween(rand, 2, 9);
      const type = intBetween(rand, 0, 1);
      if (type === 0) return numFill("جای خالی", `${fa(a)} × ${fa(b)} = ...`, [fa(a * b)], rand);
      return choice(
        "مسئله",
        `هر جعبه ${fa(b)} مداد دارد. ${fa(a)} جعبه چند مداد دارد؟`,
        fa(a * b),
        [fa(a * b + b), fa(a + b), fa(a * b - b)],
        rand,
        "✏️",
      );
    }
  }
}
