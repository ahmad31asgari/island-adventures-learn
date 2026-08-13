import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { OSTAD_HAPPY } from "@/lib/characters";
import { usePlayer } from "@/hooks/use-player";
import { createPlayer } from "@/lib/player";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "جزیره‌های یادگیری | بازی آموزشی کلاس سوم" },
      {
        name: "description",
        content:
          "با استاد سبیلو ریاضی، فارسی و علوم کلاس سوم را در جزیره‌های بازی‌گونه یاد بگیر.",
      },
      { property: "og:title", content: "جزیره‌های یادگیری کلاس سوم" },
      {
        property: "og:description",
        content: "ریاضی، فارسی و علوم سوم دبستان با بازی، صدا و شخصیت‌های دوست‌داشتنی.",
      },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const { player, loading, setPlayer } = usePlayer();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && player) void navigate({ to: "/subjects" });
  }, [loading, player, navigate]);

  const start = async () => {
    if (!name.trim() || busy) return;
    setBusy(true);
    try {
      const created = await createPlayer(name.trim());
      setPlayer(created);
      await navigate({ to: "/subjects" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-6">
      <img
        src={OSTAD_HAPPY}
        alt="استاد سبیلو"
        width={768}
        height={768}
        className="animate-bob h-52 w-52 object-contain"
      />
      <h1 className="text-center text-2xl font-extrabold">سلام! من استاد سبیلو هستم</h1>
      <p className="text-center text-sm font-bold text-muted-foreground">
        اسمت رو بنویس تا سفر جزیره‌ها را شروع کنیم.
      </p>
      <form
        className="w-full max-w-sm space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void start();
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم من ..."
          aria-label="نام کودک"
          className="card-3d w-full px-4 py-3 text-center text-lg font-extrabold outline-none"
        />
        <button type="submit" disabled={!name.trim() || busy} className="btn-3d w-full">
          بزن بریم!
        </button>
      </form>
    </main>
  );
}
