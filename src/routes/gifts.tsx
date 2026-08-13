import { createFileRoute } from "@tanstack/react-router";
import { Gift } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/gifts")({
  head: () => ({
    meta: [
      { title: "هدیه‌ها | جزیره‌های یادگیری" },
      { name: "description", content: "با تمرین روزانه صندوق‌های هدیه را باز کن." },
      { property: "og:title", content: "هدیه‌ها | جزیره‌های یادگیری" },
      { property: "og:description", content: "با تمرین روزانه صندوق‌های هدیه را باز کن." },
    ],
  }),
  component: Gifts,
});

const BOXES = [
  { title: "هدیه‌ی روزانه", hint: "هر روز یک بار" },
  { title: "هدیه‌ی سه‌روزه", hint: "۳ روز پیوسته تمرین کن" },
  { title: "صندوق ستاره‌ها", hint: "۱۰ ستاره جمع کن" },
];

function Gifts() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <main className="flex-1 space-y-3 px-4 py-6">
        <h1 className="flex items-center gap-2 text-xl font-extrabold">
          <Gift className="size-6 text-heart" /> هدیه‌ها
        </h1>
        {BOXES.map((box) => (
          <div key={box.title} className="card-3d flex items-center gap-3 px-4 py-4">
            <span className="text-3xl">🎁</span>
            <span className="flex-1">
              <span className="block font-extrabold">{box.title}</span>
              <span className="block text-xs font-bold text-muted-foreground">{box.hint}</span>
            </span>
          </div>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}
