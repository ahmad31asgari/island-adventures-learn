CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  current_subject TEXT,
  xp INTEGER NOT NULL DEFAULT 0,
  hearts INTEGER NOT NULL DEFAULT 5,
  streak INTEGER NOT NULL DEFAULT 1,
  last_active_date DATE NOT NULL DEFAULT current_date,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.island_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  island_index INTEGER NOT NULL,
  stars INTEGER NOT NULL DEFAULT 0,
  completions INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (player_id, subject, island_index)
);

CREATE INDEX island_progress_player_subject_idx ON public.island_progress (player_id, subject);

GRANT SELECT, INSERT, UPDATE ON public.players TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.island_progress TO anon, authenticated;
GRANT ALL ON public.players TO service_role;
GRANT ALL ON public.island_progress TO service_role;

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.island_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "players readable" ON public.players FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "players insertable" ON public.players FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "players updatable" ON public.players FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "progress readable" ON public.island_progress FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "progress insertable" ON public.island_progress FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "progress updatable" ON public.island_progress FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON public.players
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();