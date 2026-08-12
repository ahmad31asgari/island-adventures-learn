import { supabase } from "@/integrations/supabase/client";
import type { SubjectId } from "./types";

const KEY = "jazireha.playerId";

export interface Player {
  id: string;
  name: string;
  current_subject: string | null;
  xp: number;
  hearts: number;
  streak: number;
  last_active_date: string;
}

export function storedPlayerId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function storePlayerId(id: string) {
  window.localStorage.setItem(KEY, id);
}

export function clearPlayer() {
  window.localStorage.removeItem(KEY);
}

export async function createPlayer(name: string): Promise<Player> {
  const { data, error } = await supabase
    .from("players")
    .insert({ name })
    .select()
    .single();
  if (error) throw error;
  storePlayerId(data.id);
  return data as Player;
}

export async function fetchPlayer(): Promise<Player | null> {
  const id = storedPlayerId();
  if (!id) return null;
  const { data, error } = await supabase.from("players").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return data as Player;
}

export async function savePlayer(id: string, patch: Partial<Player>) {
  const { data, error } = await supabase.from("players").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data as Player;
}

export interface IslandProgressRow {
  subject: string;
  island_index: number;
  stars: number;
  completions: number;
}

export async function fetchProgress(playerId: string, subject: SubjectId) {
  const { data, error } = await supabase
    .from("island_progress")
    .select("subject, island_index, stars, completions")
    .eq("player_id", playerId)
    .eq("subject", subject);
  if (error) throw error;
  return (data ?? []) as IslandProgressRow[];
}

export async function completeIsland(
  playerId: string,
  subject: SubjectId,
  islandIndex: number,
  stars: number,
) {
  const { data: existing } = await supabase
    .from("island_progress")
    .select("id, stars, completions")
    .eq("player_id", playerId)
    .eq("subject", subject)
    .eq("island_index", islandIndex)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("island_progress")
      .update({
        stars: Math.max(existing.stars, stars),
        completions: existing.completions + 1,
        completed_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    return;
  }

  await supabase
    .from("island_progress")
    .insert({ player_id: playerId, subject, island_index: islandIndex, stars, completions: 1 });
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/** Keeps the daily streak fresh when the child opens the app. */
export async function touchStreak(player: Player): Promise<Player> {
  const today = todayStr();
  if (player.last_active_date === today) return player;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const streak = player.last_active_date === yesterday ? player.streak + 1 : 1;
  return savePlayer(player.id, { last_active_date: today, streak, hearts: 5 });
}
