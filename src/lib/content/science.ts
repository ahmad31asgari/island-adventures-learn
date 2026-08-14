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
    { kind: "choice", label: "جای خالی", prompt: "دانشمندان برای شناختن جهان اول ... می‌کنند.", options: ["مشاهده", "فراموش", "بازی", "خواب"], correct: 0 },
    { kind: "match", label: "وصل کردنی", prompt: "هر حس را به عضو بدن وصل کن.", pairs: [{ left: "بینایی", right: "چشم" }, { left: "شنوایی", right: "گوش" }, { left: "بویایی", right: "بینی" }, { left: "چشایی", right: "زبان" }] },
    { kind: "choice", label: "پیش‌بینی", prompt: "اگر یک تکه یخ را بیرون بگذاریم چه می‌شود؟", options: ["آب می‌شود", "بزرگ‌تر می‌شود", "سنگ می‌شود", "پرنده می‌شود"], correct: 0 },
    { kind: "categorize", label: "دسته‌بندی", prompt: "کارها را دسته‌بندی کن.", buckets: ["مشاهده", "آزمایش"], items: [{ text: "نگاه کردن به برگ", bucket: 0 }, { text: "ریختن آب روی نمک", bucket: 1 }, { text: "شنیدن صدای پرنده", bucket: 0 }, { text: "آزمایش کردن آهن‌ربا", bucket: 1 }] },
    { kind: "order", label: "مرتب‌سازی", prompt: "مراحل یک آزمایش ساده را مرتب کن.", tokens: ["سؤال پرسیدن", "حدس زدن", "آزمایش کردن", "نتیجه گرفتن"] },
    { kind: "choice", label: "سوال از تصویر", visual: "🔍", prompt: "این ابزار برای چه کاری است؟", options: ["دیدن چیزهای ریز", "شنیدن صدا", "بوییدن گل", "چشیدن غذا"], correct: 0 },
  ],
  [
    { kind: "choice", label: "سوال از تصویر", visual: "🥕", prompt: "هویج از کدام گروه غذایی است؟", options: ["میوه و سبزی", "لبنیات", "گوشت", "نشاسته"], correct: 0 },
    { kind: "categorize", label: "دسته‌بندی", prompt: "خوراکی‌ها را دسته‌بندی کن.", buckets: ["سالم", "کم‌فایده"], items: [{ text: "سیب", bucket: 0 }, { text: "نوشابه", bucket: 1 }, { text: "شیر", bucket: 0 }, { text: "چیپس", bucket: 1 }, { text: "نان سبوس‌دار", bucket: 0 }, { text: "آب‌نبات زیاد", bucket: 1 }] },
    { kind: "choice", label: "جای خالی", prompt: "برای رشد استخوان‌ها به ... نیاز داریم.", options: ["شیر و لبنیات", "نوشابه", "شیرینی", "سس"], correct: 0 },
    { kind: "order", label: "مرتب‌سازی", prompt: "مراحل خوردن سالم را مرتب کن.", tokens: ["شستن دست‌ها", "شستن میوه", "خوردن", "مسواک زدن"] },
    { kind: "match", label: "وصل کردنی", prompt: "غذاها را به گروهشان وصل کن.", pairs: [{ left: "پنیر", right: "لبنیات" }, { left: "برنج", right: "نشاسته" }, { left: "مرغ", right: "گوشت" }, { left: "هلو", right: "میوه" }] },
    { kind: "choice", label: "اشتباه‌یابی", prompt: "کدام عادت غذایی درست نیست؟", options: ["خوردن فقط شیرینی برای ناهار", "خوردن صبحانه", "نوشیدن آب کافی", "خوردن میوه"], correct: 0 },
  ],
  [
    { kind: "choice", label: "جای خالی", prompt: "هر چیزی که جا اشغال کند و جرم داشته باشد، ... نام دارد.", options: ["ماده", "نور", "صدا", "انرژی"], correct: 0 },
    { kind: "categorize", label: "دسته‌بندی", prompt: "مواد را دسته‌بندی کن.", buckets: ["جامد", "مایع"], items: [{ text: "سنگ", bucket: 0 }, { text: "آب", bucket: 1 }, { text: "چوب", bucket: 0 }, { text: "روغن", bucket: 1 }, { text: "کتاب", bucket: 0 }, { text: "شیر", bucket: 1 }] },
    { kind: "choice", label: "اشتباه‌یابی", prompt: "کدام جمله نادرست است؟", options: ["هوا ماده نیست", "آب مایع است", "یخ جامد است", "سنگ جامد است"], correct: 0 },
    { kind: "match", label: "وصل کردنی", prompt: "حالت ماده را به مثالش وصل کن.", pairs: [{ left: "جامد", right: "میز" }, { left: "مایع", right: "آب" }, { left: "گاز", right: "هوا" }] },
    { kind: "choice", label: "پیش‌بینی", prompt: "اگر آب را در فریزر بگذاریم چه می‌شود؟", options: ["یخ می‌زند", "بخار می‌شود", "حل می‌شود", "رنگش عوض می‌شود"], correct: 0 },
    { kind: "choice", label: "سوال از تصویر", visual: "🧊", prompt: "یخ کدام حالت ماده است؟", options: ["جامد", "مایع", "گاز", "هیچ‌کدام"], correct: 0 },
  ],
  [
    { kind: "choice", label: "پیش‌بینی", prompt: "اگر شکر را در آب گرم بریزیم چه می‌شود؟", options: ["حل می‌شود", "بزرگ می‌شود", "یخ می‌زند", "شناور می‌ماند"], correct: 0 },
    { kind: "match", label: "وصل کردنی", prompt: "هر ماده را به حالتش وصل کن.", pairs: [{ left: "بخار آب", right: "گاز" }, { left: "شیر", right: "مایع" }, { left: "آهن", right: "جامد" }, { left: "هوا", right: "گاز" }] },
    { kind: "categorize", label: "دسته‌بندی", prompt: "تغییرات را دسته‌بندی کن.", buckets: ["فیزیکی", "شیمیایی"], items: [{ text: "ذوب شدن یخ", bucket: 0 }, { text: "ترش شدن شیر", bucket: 1 }, { text: "خمیر شدن کاغذ", bucket: 0 }, { text: "سوختن چوب", bucket: 1 }] },
    { kind: "choice", label: "جای خالی", prompt: "وقتی آب گرم شود و به هوا برود، ... می‌شود.", options: ["بخار", "یخ", "باران", "برف"], correct: 0 },
    { kind: "order", label: "مرتب‌سازی", prompt: "تغییر حالت آب را مرتب کن.", tokens: ["یخ", "آب", "بخار"] },
  ],
  [
    { kind: "choice", label: "جای خالی", prompt: "بیشتر سطح کره‌ی زمین را ... پوشانده است.", options: ["آب", "خاک", "شن", "برف"], correct: 0 },
    { kind: "order", label: "مرتب‌سازی", prompt: "چرخه‌ی آب را مرتب کن.", tokens: ["تبخیر آب دریا", "تشکیل ابر", "بارش باران", "جاری شدن رودخانه"] },
    { kind: "choice", label: "پیش‌بینی", prompt: "اگر شیر آب را باز بگذاریم چه می‌شود؟", options: ["آب هدر می‌رود", "آب بیشتر می‌شود", "آب سردتر می‌شود", "هیچ اتفاقی نمی‌افتد"], correct: 0 },
    { kind: "categorize", label: "دسته‌بندی", prompt: "کارها را دسته‌بندی کن.", buckets: ["صرفه‌جویی", "هدر دادن"], items: [{ text: "بستن شیر آب", bucket: 0 }, { text: "شستن حیاط با شلنگ", bucket: 1 }, { text: "دوش کوتاه", bucket: 0 }, { text: "روشن گذاشتن آب", bucket: 1 }] },
    { kind: "match", label: "وصل کردنی", prompt: "منبع آب را به توضیحش وصل کن.", pairs: [{ left: "چاه", right: "آب زیرزمینی" }, { left: "رودخانه", right: "آب سطحی" }, { left: "دریا", right: "آب شور" }] },
  ],
  [
    { kind: "categorize", label: "دسته‌بندی", prompt: "کارها را دسته‌بندی کن.", buckets: ["صرفه‌جویی", "هدر دادن"], items: [{ text: "بستن شیر آب", bucket: 0 }, { text: "شستن حیاط با شلنگ", bucket: 1 }, { text: "دوش کوتاه", bucket: 0 }, { text: "باز گذاشتن شیر هنگام مسواک", bucket: 1 }] },
    { kind: "choice", label: "جای خالی", prompt: "آب آشامیدنی باید ... باشد.", options: ["تمیز و سالم", "گل‌آلود", "شور", "گرم"], correct: 0 },
    { kind: "choice", label: "سوال از تصویر", visual: "🚰", prompt: "این علامت به ما چه یادآوری می‌کند؟", options: ["آب را هدر ندهیم", "آتش خطرناک است", "برق بزنید", "بدوید"], correct: 0 },
    { kind: "order", label: "مرتب‌سازی", prompt: "مراحل تصفیه‌ی آب ساده را مرتب کن.", tokens: ["رسوب دادن", "صافی کردن", "جوشاندن", "نوشیدن"] },
  ],
  [
    { kind: "choice", label: "جای خالی", prompt: "هل دادن و کشیدن نمونه‌ای از ... است.", options: ["نیرو", "نور", "صدا", "گرما"], correct: 0 },
    { kind: "choice", label: "سوال از تصویر", visual: "🧲", prompt: "آهن‌ربا کدام را جذب می‌کند؟", options: ["میخ آهنی", "مداد چوبی", "لیوان پلاستیکی", "کاغذ"], correct: 0 },
    { kind: "categorize", label: "دسته‌بندی", prompt: "کدام‌ها جذب آهن‌ربا می‌شوند؟", buckets: ["جذب می‌شود", "جذب نمی‌شود"], items: [{ text: "پیچ آهنی", bucket: 0 }, { text: "کاغذ", bucket: 1 }, { text: "گیره فلزی", bucket: 0 }, { text: "پارچه", bucket: 1 }, { text: "سوزن آهنی", bucket: 0 }, { text: "پلاستیک", bucket: 1 }] },
    { kind: "match", label: "وصل کردنی", prompt: "نیرو را به مثالش وصل کن.", pairs: [{ left: "کشش", right: "کشیدن کش" }, { left: "فشار", right: "نشستن روی صندلی" }, { left: "هل دادن", right: "باز کردن در" }] },
  ],
  [
    { kind: "choice", label: "پیش‌بینی", prompt: "اگر توپی را روی سطح ناهموار بغلتانیم چه می‌شود؟", options: ["زودتر می‌ایستد", "تندتر می‌رود", "بالا می‌رود", "سبک‌تر می‌شود"], correct: 0 },
    { kind: "choice", label: "جای خالی", prompt: "نیرویی که مانع حرکت اجسام روی هم می‌شود، ... نام دارد.", options: ["اصطکاک", "جاذبه", "کشش", "فشار"], correct: 0 },
    { kind: "categorize", label: "دسته‌بندی", prompt: "سطوح را دسته‌بندی کن.", buckets: ["صاف", "ناهموار"], items: [{ text: "آینه", bucket: 0 }, { text: "فرش", bucket: 1 }, { text: "سنگ صیقلی", bucket: 0 }, { text: "زمین خاکی", bucket: 1 }] },
    { kind: "choice", label: "سوال از تصویر", visual: "🛝", prompt: "در سرسره‌ی صاف کودک سریع‌تر می‌لغزد چون ... کمتر است.", options: ["اصطکاک", "جاذبه", "فشار", "کشش"], correct: 0 },
  ],
  [
    { kind: "choice", label: "جای خالی", prompt: "نیرویی که همه چیز را به سمت زمین می‌کشد ... است.", options: ["جاذبه", "باد", "نور", "صدا"], correct: 0 },
    { kind: "choice", label: "سوال از تصویر", visual: "🍎", prompt: "سیب از درخت به کدام سمت می‌افتد؟", options: ["پایین", "بالا", "کنار", "دور می‌زند"], correct: 0 },
    { kind: "match", label: "وصل کردنی", prompt: "نیرو را به اثرش وصل کن.", pairs: [{ left: "جاذبه", right: "افتادن سیب" }, { left: "کشش", right: "کشیدن فنر" }, { left: "فشار", right: "نشستن روی تشک" }] },
    { kind: "choice", label: "اشتباه‌یابی", prompt: "کدام جمله نادرست است؟", options: ["جاذبه فقط در شب کار می‌کند", "جاذبه زمین را به خورشید می‌کشد", "جاذبه باعث افتادن اجسام می‌شود"], correct: 0 },
  ],
  [
    { kind: "match", label: "وصل کردنی", prompt: "هر انرژی را به منبعش وصل کن.", pairs: [{ left: "نور و گرما", right: "خورشید" }, { left: "حرکت بادبادک", right: "باد" }, { left: "روشنایی لامپ", right: "برق" }, { left: "غذا", right: "بدن" }] },
    { kind: "choice", label: "جای خالی", prompt: "مهم‌ترین منبع انرژی زمین ... است.", options: ["خورشید", "ماه", "ستاره‌ها", "برف"], correct: 0 },
    { kind: "categorize", label: "دسته‌بندی", prompt: "انرژی‌ها را دسته‌بندی کن.", buckets: ["طبیعی", "ساخت انسان"], items: [{ text: "نور خورشید", bucket: 0 }, { text: "برق شهر", bucket: 1 }, { text: "باد", bucket: 0 }, { text: "باتری", bucket: 1 }] },
    { kind: "choice", label: "پیش‌بینی", prompt: "اگر پنجره را در زمستان باز بگذاریم، چه می‌شود؟", options: ["انرژی گرمایی از دست می‌رود", "خانه گرم‌تر می‌شود", "برق بیشتر مصرف می‌شود", "هیچ اتفاقی نمی‌افتد"], correct: 0 },
  ],
  [
    { kind: "choice", label: "اشتباه‌یابی", prompt: "کدام کار خطرناک است؟", options: ["دست خیس به پریز برق زدن", "خاموش کردن لامپ اضافی", "استفاده از لامپ کم‌مصرف", "بستن کلید برق قبل از تعمیر"], correct: 0 },
    { kind: "choice", label: "جای خالی", prompt: "برای روشن شدن لامپ باید مدار ... باشد.", options: ["کامل", "شکسته", "خالی", "باز"], correct: 0 },
    { kind: "match", label: "وصل کردنی", prompt: "وسیله را به کارش وصل کن.", pairs: [{ left: "کلید", right: "قطع و وصل برق" }, { left: "سیم", right: "رساندن برق" }, { left: "لامپ", right: "تولید نور" }] },
    { kind: "categorize", label: "دسته‌بندی", prompt: "کارها را دسته‌بندی کن.", buckets: ["ایمن", "غیرایمن"], items: [{ text: "خشک بودن دست هنگام لمس پریز", bucket: 0 }, { text: "بازی با سیم‌های برق", bucket: 1 }, { text: "خاموش کردن لامپ اضافی", bucket: 0 }, { text: "نشستن روی دستگاه برقی", bucket: 1 }] },
  ],
  [
    { kind: "categorize", label: "دسته‌بندی", prompt: "ناهمواری‌ها را دسته‌بندی کن.", buckets: ["بلندی", "پستی"], items: [{ text: "کوه", bucket: 0 }, { text: "دره", bucket: 1 }, { text: "تپه", bucket: 0 }, { text: "دشت", bucket: 1 }, { text: "دشت ساحلی", bucket: 1 }, { text: "رشته‌کوه", bucket: 0 }] },
    { kind: "choice", label: "سوال از تصویر", visual: "🌋", prompt: "این چه ناهمواری‌ای است؟", options: ["کوه آتشفشان", "دریاچه", "جنگل", "دشت"], correct: 0 },
    { kind: "match", label: "وصل کردنی", prompt: "ناهمواری را به توضیحش وصل کن.", pairs: [{ left: "کوه", right: "بلندترین ناهمواری" }, { left: "دره", right: "زمین پایین‌تر از اطراف" }, { left: "دشت", right: "زمین تقریباً مسطح" }] },
    { kind: "choice", label: "جای خالی", prompt: "زمین‌های پست و هموار اطراف رودخانه را ... می‌گویند.", options: ["دشت", "کوه", "دره", "تپه"], correct: 0 },
  ],
  [
    { kind: "order", label: "مرتب‌سازی", prompt: "مراحل ساختن یک وسیله را مرتب کن.", tokens: ["فکر کردن", "نقشه کشیدن", "ساختن", "آزمایش کردن"] },
    { kind: "choice", label: "پیش‌بینی", prompt: "اگر پایه‌های یک ساختمان مقوایی پهن‌تر باشد چه می‌شود؟", options: ["محکم‌تر می‌ایستد", "زودتر می‌افتد", "سبک‌تر می‌شود", "رنگش عوض می‌شود"], correct: 0 },
    { kind: "categorize", label: "دسته‌بندی", prompt: "وسایل را بر اساس جنس دسته‌بندی کن.", buckets: ["طبیعی", "ساخت انسان"], items: [{ text: "چوب", bucket: 0 }, { text: "پلاستیک", bucket: 1 }, { text: "سنگ", bucket: 0 }, { text: "فلز", bucket: 1 }] },
    { kind: "match", label: "وصل کردنی", prompt: "مهندس را به کاری که می‌کند وصل کن.", pairs: [{ left: "مهندس پل", right: "ساخت پل" }, { left: "مهندس راه", right: "طراحی جاده" }, { left: "مهندس ساختمان", right: "طراحی خانه" }] },
  ],
  [
    { kind: "categorize", label: "دسته‌بندی", prompt: "جانوران را دسته‌بندی کن.", buckets: ["مهره‌دار", "بی‌مهره"], items: [{ text: "ماهی", bucket: 0 }, { text: "کرم خاکی", bucket: 1 }, { text: "گنجشک", bucket: 0 }, { text: "حلزون", bucket: 1 }, { text: "سگ", bucket: 0 }, { text: "عنکبوت", bucket: 1 }] },
    { kind: "match", label: "وصل کردنی", prompt: "هر جانور را به محل زندگی‌اش وصل کن.", pairs: [{ left: "ماهی", right: "آب" }, { left: "شتر", right: "بیابان" }, { left: "خرس قطبی", right: "یخ و برف" }, { left: "قورباغه", right: "نزدیک آب" }] },
    { kind: "choice", label: "جای خالی", prompt: "گیاهان برای غذاسازی به نور ... نیاز دارند.", options: ["خورشید", "لامپ قوه", "ماه", "ستاره"], correct: 0 },
    { kind: "order", label: "مرتب‌سازی", prompt: "نشانه‌های زنده بودن را مرتب کن.", tokens: ["تنفس", "رشد", "تغذیه", "تولیدمثل"] },
    { kind: "choice", label: "سوال از تصویر", visual: "🌱", prompt: "این تصویر نشانه‌ی کدام ویژگی زنده است؟", options: ["رشد", "خواب", "دویدن", "پرواز"], correct: 0 },
  ],
];

export function scienceActivity(chapter: number, rand: () => number): Activity {
  const bank = CH[Math.min(chapter, CH.length - 1)]!;
  return varyDraft(pick(rand, bank), rand);
}
