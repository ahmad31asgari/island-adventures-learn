import type { Activity } from "../types";
import { pick } from "../rng";
import { varyDraft } from "./farsi";

export const SCIENCE_CHAPTERS = [
  "زنگ علوم",
  "خوراکی‌ها",
  "مواد اطراف ما (۱)",
  "مواد اطراف ما (۲)",
  "آب، ماده‌ی با ارزش",
  "زندگی ما و آب",
  "نیرو، همه جا (۱)",
  "نیرو، همه جا (۲)",
  "نیرو و حرکت",
  "انرژی، نیاز هر روز ما",
  "انرژی الکتریکی",
  "بلندی‌ها و پستی‌ها",
  "جست‌وجو کنیم و بسازیم",
  "نشانه‌های زندگی جانوران و گیاهان",
];

type Draft = Activity;

const CH: Draft[][] = [
  [
    { kind: "choice", label: "جای خالی", prompt: "دانشمندان برای شناختن جهان اول ... می‌کنند.", options: ["مشاهده", "فراموش", "بازی"], correct: 0 },
    { kind: "match", label: "وصل کردنی", prompt: "هر حس را به عضو بدن وصل کن.", pairs: [{ left: "بینایی", right: "چشم" }, { left: "شنوایی", right: "گوش" }, { left: "بویایی", right: "بینی" }] },
    { kind: "choice", label: "پیش‌بینی", prompt: "اگر یک تکه یخ را بیرون بگذاریم چه می‌شود؟", options: ["آب می‌شود", "بزرگ‌تر می‌شود", "سنگ می‌شود"], correct: 0 },
    { kind: "categorize", label: "دسته‌بندی", prompt: "کارها را دسته‌بندی کن.", buckets: ["مشاهده", "آزمایش"], items: [{ text: "نگاه کردن به برگ", bucket: 0 }, { text: "ریختن آب روی نمک", bucket: 1 }] },
  ],
  [
    { kind: "choice", label: "سوال از تصویر", visual: "🥕", prompt: "هویج از کدام گروه غذایی است؟", options: ["میوه و سبزی", "لبنیات", "گوشت"], correct: 0 },
    { kind: "categorize", label: "دسته‌بندی", prompt: "خوراکی‌ها را دسته‌بندی کن.", buckets: ["سالم", "کم‌فایده"], items: [{ text: "سیب", bucket: 0 }, { text: "نوشابه", bucket: 1 }, { text: "شیر", bucket: 0 }, { text: "چیپس", bucket: 1 }] },
    { kind: "choice", label: "جای خالی", prompt: "برای رشد استخوان‌ها به ... نیاز داریم.", options: ["شیر و لبنیات", "نوشابه", "شیرینی"], correct: 0 },
    { kind: "order", label: "مرتب‌سازی", prompt: "مراحل خوردن سالم را مرتب کن.", tokens: ["شستن دست‌ها", "شستن میوه", "خوردن", "مسواک زدن"] },
  ],
  [
    { kind: "choice", label: "جای خالی", prompt: "هر چیزی که جا اشغال کند و جرم داشته باشد، ... نام دارد.", options: ["ماده", "نور", "صدا"], correct: 0 },
    { kind: "categorize", label: "دسته‌بندی", prompt: "مواد را دسته‌بندی کن.", buckets: ["جامد", "مایع"], items: [{ text: "سنگ", bucket: 0 }, { text: "آب", bucket: 1 }, { text: "چوب", bucket: 0 }, { text: "روغن", bucket: 1 }] },
    { kind: "choice", label: "اشتباه‌یابی", prompt: "کدام جمله نادرست است؟", options: ["هوا ماده نیست", "آب مایع است", "یخ جامد است"], correct: 0 },
  ],
  [
    { kind: "choice", label: "پیش‌بینی", prompt: "اگر شکر را در آب گرم بریزیم چه می‌شود؟", options: ["حل می‌شود", "بزرگ می‌شود", "یخ می‌زند"], correct: 0 },
    { kind: "match", label: "وصل کردنی", prompt: "هر ماده را به حالتش وصل کن.", pairs: [{ left: "بخار آب", right: "گاز" }, { left: "شیر", right: "مایع" }, { left: "آهن", right: "جامد" }] },
    { kind: "choice", label: "سوال از تصویر", visual: "🧊", prompt: "یخ کدام حالت ماده است؟", options: ["جامد", "مایع", "گاز"], correct: 0 },
  ],
  [
    { kind: "choice", label: "جای خالی", prompt: "بیشتر سطح کره‌ی زمین را ... پوشانده است.", options: ["آب", "خاک", "شن"], correct: 0 },
    { kind: "order", label: "مرتب‌سازی", prompt: "چرخه‌ی آب را مرتب کن.", tokens: ["تبخیر آب دریا", "تشکیل ابر", "بارش باران", "جاری شدن رودخانه"] },
    { kind: "choice", label: "پیش‌بینی", prompt: "اگر شیر آب را باز بگذاریم چه می‌شود؟", options: ["آب هدر می‌رود", "آب بیشتر می‌شود"], correct: 0 },
  ],
  [
    { kind: "categorize", label: "دسته‌بندی", prompt: "کارها را دسته‌بندی کن.", buckets: ["صرفه‌جویی", "هدر دادن"], items: [{ text: "بستن شیر آب", bucket: 0 }, { text: "شستن حیاط با شلنگ", bucket: 1 }, { text: "دوش کوتاه", bucket: 0 }] },
    { kind: "choice", label: "جای خالی", prompt: "آب آشامیدنی باید ... باشد.", options: ["تمیز و سالم", "گل‌آلود", "شور"], correct: 0 },
  ],
  [
    { kind: "choice", label: "جای خالی", prompt: "هل دادن و کشیدن نمونه‌ای از ... است.", options: ["نیرو", "نور", "صدا"], correct: 0 },
    { kind: "choice", label: "سوال از تصویر", visual: "🧲", prompt: "آهن‌ربا کدام را جذب می‌کند؟", options: ["میخ آهنی", "مداد چوبی", "لیوان پلاستیکی"], correct: 0 },
    { kind: "categorize", label: "دسته‌بندی", prompt: "کدام‌ها جذب آهن‌ربا می‌شوند؟", buckets: ["جذب می‌شود", "جذب نمی‌شود"], items: [{ text: "پیچ آهنی", bucket: 0 }, { text: "کاغذ", bucket: 1 }, { text: "گیره فلزی", bucket: 0 }, { text: "پارچه", bucket: 1 }] },
  ],
  [
    { kind: "choice", label: "پیش‌بینی", prompt: "اگر توپی را روی سطح ناهموار بغلتانیم چه می‌شود؟", options: ["زودتر می‌ایستد", "تندتر می‌رود"], correct: 0 },
    { kind: "choice", label: "جای خالی", prompt: "نیرویی که مانع حرکت اجسام روی هم می‌شود، ... نام دارد.", options: ["اصطکاک", "جاذبه", "کشش"], correct: 0 },
  ],
  [
    { kind: "choice", label: "جای خالی", prompt: "نیرویی که همه چیز را به سمت زمین می‌کشد ... است.", options: ["جاذبه", "باد", "نور"], correct: 0 },
    { kind: "choice", label: "سوال از تصویر", visual: "🍎", prompt: "سیب از درخت به کدام سمت می‌افتد؟", options: ["پایین", "بالا", "کنار"], correct: 0 },
  ],
  [
    { kind: "match", label: "وصل کردنی", prompt: "هر انرژی را به منبعش وصل کن.", pairs: [{ left: "نور و گرما", right: "خورشید" }, { left: "حرکت بادبادک", right: "باد" }, { left: "روشنایی لامپ", right: "برق" }] },
    { kind: "choice", label: "جای خالی", prompt: "مهم‌ترین منبع انرژی زمین ... است.", options: ["خورشید", "ماه", "ستاره‌ها"], correct: 0 },
  ],
  [
    { kind: "choice", label: "اشتباه‌یابی", prompt: "کدام کار خطرناک است؟", options: ["دست خیس به پریز برق زدن", "خاموش کردن لامپ اضافی", "استفاده از لامپ کم‌مصرف"], correct: 0 },
    { kind: "choice", label: "جای خالی", prompt: "برای روشن شدن لامپ باید مدار ... باشد.", options: ["کامل", "شکسته", "خالی"], correct: 0 },
  ],
  [
    { kind: "categorize", label: "دسته‌بندی", prompt: "ناهمواری‌ها را دسته‌بندی کن.", buckets: ["بلندی", "پستی"], items: [{ text: "کوه", bucket: 0 }, { text: "دره", bucket: 1 }, { text: "تپه", bucket: 0 }, { text: "دشت", bucket: 1 }] },
    { kind: "choice", label: "سوال از تصویر", visual: "🌋", prompt: "این چه ناهمواری‌ای است؟", options: ["کوه آتشفشان", "دریاچه", "جنگل"], correct: 0 },
  ],
  [
    { kind: "order", label: "مرتب‌سازی", prompt: "مراحل ساختن یک وسیله را مرتب کن.", tokens: ["فکر کردن", "نقشه کشیدن", "ساختن", "آزمایش کردن"] },
    { kind: "choice", label: "پیش‌بینی", prompt: "اگر پایه‌های یک ساختمان مقوایی پهن‌تر باشد چه می‌شود؟", options: ["محکم‌تر می‌ایستد", "زودتر می‌افتد"], correct: 0 },
  ],
  [
    { kind: "categorize", label: "دسته‌بندی", prompt: "جانوران را دسته‌بندی کن.", buckets: ["مهره‌دار", "بی‌مهره"], items: [{ text: "ماهی", bucket: 0 }, { text: "کرم خاکی", bucket: 1 }, { text: "گنجشک", bucket: 0 }, { text: "حلزون", bucket: 1 }] },
    { kind: "match", label: "وصل کردنی", prompt: "هر جانور را به محل زندگی‌اش وصل کن.", pairs: [{ left: "ماهی", right: "آب" }, { left: "شتر", right: "بیابان" }, { left: "خرس قطبی", right: "یخ و برف" }] },
    { kind: "choice", label: "جای خالی", prompt: "گیاهان برای غذاسازی به نور ... نیاز دارند.", options: ["خورشید", "لامپ قوه", "ماه"], correct: 0 },
  ],
];

export function scienceActivity(chapter: number, rand: () => number): Activity {
  const bank = CH[Math.min(chapter, CH.length - 1)]!;
  return varyDraft(pick(rand, bank), rand);
}
