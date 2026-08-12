import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchPlayer, savePlayer, touchStreak, type Player } from "@/lib/player";

interface PlayerCtx {
  player: Player | null;
  loading: boolean;
  setPlayer: (p: Player | null) => void;
  patch: (patch: Partial<Player>) => Promise<void>;
  reload: () => Promise<void>;
}

const Ctx = createContext<PlayerCtx>({
  player: null,
  loading: true,
  setPlayer: () => {},
  patch: async () => {},
  reload: async () => {},
});

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const found = await fetchPlayer();
      setPlayer(found ? await touchStreak(found) : null);
    } catch {
      setPlayer(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const value = useMemo<PlayerCtx>(
    () => ({
      player,
      loading,
      setPlayer,
      patch: async (patch) => {
        if (!player) return;
        setPlayer({ ...player, ...patch });
        try {
          const saved = await savePlayer(player.id, patch);
          setPlayer(saved);
        } catch {
          /* offline-tolerant */
        }
      },
      reload: load,
    }),
    [player, loading],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlayer() {
  return useContext(Ctx);
}
