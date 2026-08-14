import type { Activity } from "../types";
import { pick } from "../rng";
import { varyDraft } from "./farsi";

export const SOCIAL_CHAPTERS = [
  "خانواده‌ی من",
  "محله و همسایه",
  "شغل‌ها",
  "نقشه و راه‌ها",
  "ایران زیبای من",
];

type Draft = Activity;

const CH: Draft[][] = [
  // ۱ خانواده‌ی من
  [
    { kind: "choice", label: "جای خالی", prompt: "پدر و مادر، خواهر و برادر با هم یک ... می‌سازند.", options: ["خانواده", "مدرسه", "خیابان", "باغ"], correct: 0 },
    { kind: "match", label: "وصل کردنی", prompt: "هر عضو خانواده را به نقشش وصل کن.", pairs: [{ left: "پدر", right: "حامی و سرپرست" }, { left: "مادر", right: "مهر و مراقبت" }, { left: "فرزند", right: "دانش‌آموز خانواده" }] },
    { kind: "order", label: "مرتب‌سازی", prompt: "مراحل روز صبح را مرتب کن.", tokens: ["بیدار شدن", "شستن صورت", "خوردن صبحانه", "رفتن به مدرسه"] },
    { kind: "categorize", label: "دسته‌بندی", prompt: "کارهای خانوادگی را دسته‌بندی کن.", buckets: ["کار خانه", "کار بیرون"], items: [{ text: "آشپزی", bucket: 0 }, { text: "خرید نان", bucket: 1 }, { text: "تمیز کردن", bucket: 0 }, { text: "رفتن به اداره", bucket: 1 }] },
    { kind: "choice", label: "اشتباه‌یابی", prompt: "کدام رفتار در خانواده درست نیست؟", options: ["بی‌احترامی به پدر و مادر", "کمک به خواهر", "گوش دادن به حرف مادر"], correct: 0 },
    { kind: "choice", label: "سوال از تصویر", visual: "👨‍👩‍👧‍👦", prompt: "در این تصویر چه می‌بینی؟", options: ["یک خانواده", "یک مدرسه", "یک فروشگاه", "یک بیمارستان"], correct: 0 },
  ],
  // ۲ محله و همسایه
  [
    { kind: "choice", label: "جای خالی", prompt: "کسانی که نزدیک خانه‌ی ما زندگی می‌کنند، ... ما هستند.", options: ["همسایه", "دوست", "فامیل", "همکلاسی"], correct: 0 },
    { kind: "match", label: "وصل کردنی", prompt: "هر جای محله را به کارش وصل کن.", pairs: [{ left: "مسجد", right: "نماز خواندن" }, { left: "مدرسه", right: "یاد گرفتن" }, { left: "نانوایی", right: "پختن نان" }] },
    { kind: "order", label: "مرتب‌سازی", prompt: "جمله را مرتب کن.", tokens: ["ما", "با", "همسایه‌ها", "مهربان", "هستیم"] },
    { kind: "categorize", label: "دسته‌بندی", prompt: "مکان‌ها را دسته‌بندی کن.", buckets: ["محله", "خانواده"], items: [{ text: "پارک", bucket: 0 }, { text: "اتاق خواب", bucket: 1 }, { text: "مغازه", bucket: 0 }, { text: "آشپزخانه", bucket: 1 }] },
    { kind: "choice", label: "پیش‌بینی", prompt: "اگر در محله به همسایه سلام نکنیم، چه می‌شود؟", options: ["رابطه‌ها سرد می‌شود", "همه خوشحال می‌شوند", "هیچ اتفاقی نمی‌افتد"], correct: 0 },
    { kind: "choice", label: "سوال از تصویر", visual: "🏘️", prompt: "این تصویر چه چیزی را نشان می‌دهد؟", options: ["یک محله", "یک جنگل", "یک کوه", "یک رودخانه"], correct: 0 },
  ],
  // ۳ شغل‌ها
  [
    { kind: "choice", label: "جای خالی", prompt: "کسی که بیماران را معاینه می‌کند، ... است.", options: ["پزشک", "معلم", "راننده", "نجار"], correct: 0 },
    { kind: "match", label: "وصل کردنی", prompt: "هر شغل را به ابزار یا محل کارش وصل کن.", pairs: [{ left: "آتش‌نشان", right: "ماشین آتش‌نشانی" }, { left: "معلم", right: "مدرسه" }, { left: "کشاورز", right: "مزرعه" }] },
    { kind: "categorize", label: "دسته‌بندی", prompt: "شغل‌ها را دسته‌بندی کن.", buckets: ["خدمات", "تولید"], items: [{ text: "پلیس", bucket: 0 }, { text: "نانوا", bucket: 1 }, { text: "پرستار", bucket: 0 }, { text: "خیاط", bucket: 1 }] },
    { kind: "order", label: "مرتب‌سازی", prompt: "مراحل ساختن نان را مرتب کن.", tokens: ["آماده کردن خمیر", "پختن در تنور", "فروختن نان", "خوردن نان"] },
    { kind: "choice", label: "اشتباه‌یابی", prompt: "کدام جمله نادرست است؟", options: ["پزشک درس می‌خواند تا ماشین درست کند", "کشاورز غذا تولید می‌کند", "آتش‌نشان به مردم کمک می‌کند"], correct: 0 },
    { kind: "choice", label: "سوال از تصویر", visual: "🚒", prompt: "این وسیله متعلق به کدام شغل است؟", options: ["آتش‌نشان", "پلیس", "آمبولانس", "اتوبوس"], correct: 0 },
  ],
  // ۴ نقشه و راه‌ها
  [
    { kind: "choice", label: "جای خالی", prompt: "برای پیدا کردن راه از ... استفاده می‌کنیم.", options: ["نقشه", "قصه", "شعر", "آهنگ"], correct: 0 },
    { kind: "match", label: "وصل کردنی", prompt: "هر علامت نقشه را به معنی‌اش وصل کن.", pairs: [{ left: "🔵", right: "شهر بزرگ" }, { left: "🏔️", right: "کوه" }, { left: "💧", right: "رودخانه" }] },
    { kind: "categorize", label: "دسته‌بندی", prompt: "راه‌ها را دسته‌بندی کن.", buckets: ["داخل شهر", "بین شهر"], items: [{ text: "خیابان", bucket: 0 }, { text: "بزرگراه", bucket: 1 }, { text: "کوچه", bucket: 0 }, { text: "جاده‌ی اصلی", bucket: 1 }] },
    { kind: "order", label: "مرتب‌سازی", prompt: "برای سفر با اتوبوس چه مراحلی داریم؟", tokens: ["خرید بلیط", "نشستن در اتوبوس", "حرکت", "رسیدن به مقصد"] },
    { kind: "choice", label: "پیش‌بینی", prompt: "اگر در نقشه شمال را بشناسی، چه کمکی می‌کند؟", options: ["راه را درست پیدا می‌کنی", "گم می‌شوی", "خسته می‌شوی"], correct: 0 },
    { kind: "choice", label: "سوال از تصویر", visual: "🧭", prompt: "این وسیله چه کاری می‌کند؟", options: ["جهت را نشان می‌دهد", "زمان را نشان می‌دهد", "آب و هوا را نشان می‌دهد"], correct: 0 },
  ],
  // ۵ ایران زیبای من
  [
    { kind: "choice", label: "جای خالی", prompt: "پایتخت ایران شهر ... است.", options: ["تهران", "اصفهان", "شیراز", "مشهد"], correct: 0 },
    { kind: "match", label: "وصل کردنی", prompt: "هر نماد را به معنی‌اش وصل کن.", pairs: [{ left: "🔴🔴🔴", right: "سه رنگ پرچم" }, { left: "🦁 و خورشید", right: "نماد تاریخی" }, { left: "🌸", right: "گل لاله" }] },
    { kind: "categorize", label: "دسته‌بندی", prompt: "مکان‌ها را دسته‌بندی کن.", buckets: ["طبیعت", "ساختمان"], items: [{ text: "کویر", bucket: 0 }, { text: "کاخ", bucket: 1 }, { text: "جنگل", bucket: 0 }, { text: "مسجد", bucket: 1 }] },
    { kind: "order", label: "مرتب‌سازی", prompt: "رنگ‌های پرچم ایران از بالا به پایین.", tokens: ["سبز", "سفید", "قرمز"] },
    { kind: "choice", label: "اشتباه‌یابی", prompt: "کدام جمله نادرست است؟", options: ["ایران فقط یک شهر دارد", "ایران کشور بزرگی است", "ایران پرچم دارد"], correct: 0 },
    { kind: "choice", label: "سوال از تصویر", visual: "🏛️", prompt: "این تصویر احتمالاً کدام جای ایران است؟", options: ["یک بنای تاریخی", "یک جنگل", "یک بیابان", "یک دریا"], correct: 0 },
  ],
];

export function socialActivity(chapter: number, rand: () => number): Activity {
  const bank = CH[Math.min(chapter, CH.length - 1)]!;
  return varyDraft(pick(rand, bank), rand);
}
