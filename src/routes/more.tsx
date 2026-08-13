import { createFileRoute, Link } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { CHARACTERS } from "@/lib/characters";

export const Route = createFileRoute("/more")({
  head: () => ({
    meta: [
      { title: "بیشتر | جزیره‌های یادگیری" },
      { name: "description", content: "شخصیت‌های بازی و بخش‌های دیگر اپلیکیشن." },
      { property: "og:title", content: "بیشتر | جزیره‌های یادگیری" },
      { property: "og:description", content: "شخصیت‌های بازی و بخش‌های دیگر اپلیکیشن." },
    ],
  }),
  component: More,
});

function More() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <main className="flex-1 space-y-4 px-4 py-6">
        <h1 className="text-xl font-extrabold">دوستان تو</h1>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(CHARACTERS).map((char) => (
            <div key={char.id} className="card-3d flex flex-col items-center gap-2 p-3">
              <img
                src={char.image}
                alt={char.name}
                loading="lazy"
                width={768}
                height={768}
                className="h-24 w-24 object-contain"
              />
              <span className="text-sm font-extrabold">{char.name}</span>
            </div>
          ))}
        </div>
        <Link to="/subjects" className="btn-3d block text-center">
          تغییر درس
        </Link>
      </main>
      <BottomNav />
    </div>
  );
}
