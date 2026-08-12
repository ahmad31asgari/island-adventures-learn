import type { Activity } from "../types";
import { pick, shuffle } from "../rng";

export const FARSI_CHAPTERS = [
  "نهادها",
  "کوشا و توانا",
  "ایران زیبا",
  "نام‌آوران",
  "راه زندگی",
  "علم و عمل",
  "ادب و هنر",
];

type Draft = Omit<Activity, "character">;

const CH: Draft[][] = [
  // ۱ نهادها
  [
    { kind: "choice", label: "جای خالی", prompt: "محله‌ی ما مثل یک ... بزرگ است که همه به هم کمک می‌کنند.", options: ["خانواده", "کتاب", "خیابان", "درخت"], correct: 0 },
    { kind: "match", label: "وصل کردنی", prompt: "هر کلمه را به معنی‌اش وصل کن.", pairs: [{ left: "همسایه", right: "کسی که کنار ما زندگی می‌کند" }, { left: "محله", right: "جایی که چند خانه کنار هم است" }, { left: "مهربانی", right: "خوبی کردن به دیگران" }] },
    { kind: "order", label: "مرتب‌سازی", prompt: "کلمه‌ها را مرتب کن تا جمله درست شود.", tokens: ["ما", "به", "همسایه‌ها", "کمک", "می‌کنیم"] },
    { kind: "choice", label: "اشتباه‌یابی", prompt: "کدام کلمه غلط نوشته شده است؟", options: ["مهربون‌ی", "همسایه", "محله", "خانواده"], correct: 0 },
    { kind: "categorize", label: "دسته‌بندی", prompt: "کلمه‌ها را دسته‌بندی کن.", buckets: ["اسم", "فعل"], items: [{ text: "خانه", bucket: 0 }, { text: "رفت", bucket: 1 }, { text: "مدرسه", bucket: 0 }, { text: "خواند", bucket: 1 }] },
    { kind: "choice", label: "توصیف تصویر", visual: "🏘️", prompt: "در تصویر چه می‌بینی؟", options: ["چند خانه در یک محله", "یک کشتی در دریا", "یک هواپیما", "یک جنگل"], correct: 0 },
  ],
  // ۲ کوشا و توانا
  [
    { kind: "choice", label: "جای خالی", prompt: "با ... و کوشش می‌توان به هدف رسید.", options: ["تلاش", "خواب", "بازی", "ترس"], correct: 0 },
    { kind: "choice", label: "معنی کلمه", prompt: "«کوشا» یعنی چه؟", options: ["کسی که تلاش می‌کند", "کسی که می‌خوابد", "کسی که می‌خندد", "کسی که می‌دود"], correct: 0 },
    { kind: "order", label: "مرتب‌سازی", prompt: "جمله را مرتب کن.", tokens: ["دانش‌آموز", "کوشا", "درسش", "را", "خوب", "می‌خواند"] },
    { kind: "choice", label: "پیش‌بینی", prompt: "اگر هر روز تمرین کنی، چه اتفاقی می‌افتد؟", options: ["بهتر و ماهرتر می‌شوی", "خسته و ناموفق می‌شوی", "هیچ فرقی نمی‌کند"], correct: 0 },
    { kind: "match", label: "وصل کردنی", prompt: "مخالف هر کلمه را پیدا کن.", pairs: [{ left: "کوشا", right: "تنبل" }, { left: "شاد", right: "غمگین" }, { left: "بزرگ", right: "کوچک" }] },
    { kind: "categorize", label: "دسته‌بندی", prompt: "کلمه‌ها را بر اساس تعداد بخش دسته‌بندی کن.", buckets: ["یک بخشی", "دو بخشی"], items: [{ text: "گل", bucket: 0 }, { text: "کتاب", bucket: 1 }, { text: "در", bucket: 0 }, { text: "مدرسه", bucket: 1 }] },
  ],
  // ۳ ایران زیبا
  [
    { kind: "choice", label: "سوال از تصویر", visual: "🏔️", prompt: "بلندترین قله‌ی ایران چه نام دارد؟", options: ["دماوند", "سبلان", "زاگرس", "الوند"], correct: 0 },
    { kind: "choice", label: "جای خالی", prompt: "خلیج ... در جنوب ایران قرار دارد.", options: ["فارس", "خزر", "عمان شمالی", "سیاه"], correct: 0 },
    { kind: "match", label: "وصل کردنی", prompt: "هر شهر را به ویژگی‌اش وصل کن.", pairs: [{ left: "اصفهان", right: "سی‌وسه‌پل" }, { left: "شیراز", right: "حافظیه" }, { left: "مشهد", right: "حرم امام رضا" }] },
    { kind: "order", label: "مرتب‌سازی", prompt: "جمله را مرتب کن.", tokens: ["ایران", "سرزمین", "زیبای", "من", "است"] },
    { kind: "choice", label: "اشتباه‌یابی", prompt: "کدام جمله نادرست است؟", options: ["دریای خزر در جنوب ایران است", "دماوند یک کوه است", "شیراز شهر شعر است"], correct: 0 },
    { kind: "categorize", label: "دسته‌بندی", prompt: "هر واژه را در جای درست بگذار.", buckets: ["شهر", "کوه"], items: [{ text: "تبریز", bucket: 0 }, { text: "سبلان", bucket: 1 }, { text: "یزد", bucket: 0 }, { text: "دماوند", bucket: 1 }] },
  ],
  // ۴ نام‌آوران
  [
    { kind: "choice", label: "جای خالی", prompt: "فردوسی شاعر بزرگی است که کتاب ... را نوشت.", options: ["شاهنامه", "گلستان", "بوستان", "مثنوی"], correct: 0 },
    { kind: "choice", label: "سوال", prompt: "«نام‌آور» یعنی چه؟", options: ["کسی که مشهور و بزرگ است", "کسی که اسم ندارد", "کسی که فراموش شده"], correct: 0 },
    { kind: "match", label: "وصل کردنی", prompt: "هر نام‌آور را به کارش وصل کن.", pairs: [{ left: "فردوسی", right: "شاعر" }, { left: "ابن‌سینا", right: "پزشک و دانشمند" }, { left: "خوارزمی", right: "ریاضی‌دان" }] },
    { kind: "order", label: "مرتب‌سازی", prompt: "جمله را مرتب کن.", tokens: ["ابن‌سینا", "دانشمند", "بزرگ", "ایرانی", "بود"] },
    { kind: "choice", label: "پیش‌بینی", prompt: "اگر مثل دانشمندان کنجکاو باشیم، چه می‌شود؟", options: ["چیزهای تازه یاد می‌گیریم", "چیزی یاد نمی‌گیریم"], correct: 0 },
    { kind: "categorize", label: "دسته‌بندی", prompt: "کلمه‌ها را دسته‌بندی کن.", buckets: ["شاعر", "دانشمند"], items: [{ text: "حافظ", bucket: 0 }, { text: "ابن‌سینا", bucket: 1 }, { text: "سعدی", bucket: 0 }, { text: "خوارزمی", bucket: 1 }] },
  ],
  // ۵ راه زندگی
  [
    { kind: "choice", label: "جای خالی", prompt: "برای رسیدن به موفقیت باید ... داشته باشیم.", options: ["صبر", "عجله", "بی‌دقتی"], correct: 0 },
    { kind: "choice", label: "درک متن", prompt: "«هر که بامش بیش، برفش بیشتر» یعنی چه؟", options: ["هر کس بزرگ‌تر باشد، مسئولیتش بیشتر است", "برف روی بام‌ها می‌نشیند", "خانه‌های بزرگ سردترند"], correct: 0 },
    { kind: "order", label: "مرتب‌سازی", prompt: "ضرب‌المثل را مرتب کن.", tokens: ["از", "تو", "حرکت", "از", "خدا", "برکت"] },
    { kind: "match", label: "وصل کردنی", prompt: "هر ضرب‌المثل را به معنی‌اش وصل کن.", pairs: [{ left: "کار نیکو کردن از پر کردن است", right: "با تمرین ماهر می‌شویم" }, { left: "عقل سالم در بدن سالم است", right: "ورزش برای فکر خوب است" }] },
    { kind: "choice", label: "اشتباه‌یابی", prompt: "کدام رفتار درست نیست؟", options: ["وسط حرف دیگران پریدن", "سلام کردن", "کمک به دوستان"], correct: 0 },
    { kind: "categorize", label: "دسته‌بندی", prompt: "رفتارها را دسته‌بندی کن.", buckets: ["خوب", "نادرست"], items: [{ text: "راست‌گویی", bucket: 0 }, { text: "دروغ‌گویی", bucket: 1 }, { text: "کمک کردن", bucket: 0 }, { text: "بی‌احترامی", bucket: 1 }] },
  ],
  // ۶ علم و عمل
  [
    { kind: "choice", label: "جای خالی", prompt: "کتاب بهترین ... انسان است.", options: ["دوست", "دشمن", "بازی"], correct: 0 },
    { kind: "choice", label: "دستور زبان", prompt: "در جمله «علی کتاب خواند» فعل کدام است؟", options: ["خواند", "علی", "کتاب"], correct: 0 },
    { kind: "order", label: "مرتب‌سازی", prompt: "جمله را مرتب کن.", tokens: ["دانش", "چراغ", "راه", "زندگی", "است"] },
    { kind: "match", label: "وصل کردنی", prompt: "هم‌خانواده‌ها را وصل کن.", pairs: [{ left: "علم", right: "معلم" }, { left: "کتاب", right: "کتابخانه" }, { left: "درس", right: "مدرسه" }] },
    { kind: "choice", label: "توصیف تصویر", visual: "📚", prompt: "این تصویر چه چیزی را نشان می‌دهد؟", options: ["کتاب‌های کتابخانه", "میوه‌ها", "حیوانات"], correct: 0 },
    { kind: "categorize", label: "دسته‌بندی", prompt: "کلمه‌ها را دسته‌بندی کن.", buckets: ["اسم", "صفت"], items: [{ text: "دانا", bucket: 1 }, { text: "کتاب", bucket: 0 }, { text: "بزرگ", bucket: 1 }, { text: "مدرسه", bucket: 0 }] },
  ],
  // ۷ ادب و هنر
  [
    { kind: "choice", label: "جای خالی", prompt: "هنرمند با دست‌های خود چیزهای ... می‌سازد.", options: ["زیبا", "زشت", "خراب"], correct: 0 },
    { kind: "choice", label: "سوال از تصویر", visual: "🎨", prompt: "این وسیله کار چه کسی است؟", options: ["نقاش", "راننده", "پزشک"], correct: 0 },
    { kind: "order", label: "مرتب‌سازی", prompt: "بیت را مرتب کن.", tokens: ["توانا", "بود", "هر", "که", "دانا", "بود"] },
    { kind: "match", label: "وصل کردنی", prompt: "هر هنر را به ابزارش وصل کن.", pairs: [{ left: "نقاشی", right: "قلم‌مو" }, { left: "خوشنویسی", right: "قلم نی" }, { left: "سفالگری", right: "چرخ سفال" }] },
    { kind: "choice", label: "اشتباه‌یابی", prompt: "کدام کلمه غلط املایی دارد؟", options: ["هنرمنت", "هنرمند", "هنر", "زیبا"], correct: 0 },
    { kind: "categorize", label: "دسته‌بندی", prompt: "کلمه‌ها را دسته‌بندی کن.", buckets: ["هنر", "ورزش"], items: [{ text: "نقاشی", bucket: 0 }, { text: "فوتبال", bucket: 1 }, { text: "موسیقی", bucket: 0 }, { text: "شنا", bucket: 1 }] },
  ],
];

export function farsiActivity(chapter: number, rand: () => number): Activity {
  const bank = CH[Math.min(chapter, CH.length - 1)]!;
  const draft = pick(rand, bank);
  return varyDraft(draft, rand);
}

export function varyDraft(draft: Draft, rand: () => number): Activity {
  if (draft.kind === "choice") {
    const correctText = draft.options[draft.correct]!;
    const options = shuffle(rand, draft.options);
    return { ...draft, options, correct: options.indexOf(correctText), speak: draft.prompt };
  }
  if (draft.kind === "match") {
    return { ...draft, pairs: shuffle(rand, draft.pairs), speak: draft.prompt };
  }
  if (draft.kind === "categorize") {
    return { ...draft, items: shuffle(rand, draft.items), speak: draft.prompt };
  }
  return { ...draft, speak: draft.prompt };
}
