-- ══════════════════════════════════════════════════════════════════
--  FightLab — Schema Supabase
--  Execute este SQL no Supabase SQL Editor:
--  Dashboard → SQL Editor → New query → Cole e clique em Run
-- ══════════════════════════════════════════════════════════════════

-- Extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────────────────────────
--  TABELAS
-- ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.users (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  tipo       TEXT NOT NULL DEFAULT 'aluno'
               CHECK (tipo IN ('aluno', 'professor', 'admin')),
  cidade     TEXT,
  foto_url   TEXT,
  criado_em  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.trainers (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID REFERENCES public.users(id) ON DELETE CASCADE,
  bio                TEXT,
  modalidades        TEXT[]    DEFAULT '{}',
  modalidade_principal TEXT,
  anos_experiencia   INTEGER   DEFAULT 0,
  graduacao          TEXT,
  preco_hora         NUMERIC(10,2) DEFAULT 0,
  bairro             TEXT,
  latitude           NUMERIC(10,8),
  longitude          NUMERIC(11,8),
  em_destaque        BOOLEAN   DEFAULT FALSE,
  posicao_ranking    INTEGER,
  criado_em          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.availability (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id      UUID REFERENCES public.trainers(id) ON DELETE CASCADE,
  dia_semana      TEXT NOT NULL
                    CHECK (dia_semana IN ('SEG','TER','QUA','QUI','SEX','SAB','DOM')),
  horario_inicio  TIME NOT NULL,
  horario_fim     TIME NOT NULL,
  disponivel      BOOLEAN DEFAULT TRUE,
  criado_em       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id          UUID REFERENCES public.users(id)    ON DELETE CASCADE,
  trainer_id        UUID REFERENCES public.trainers(id) ON DELETE CASCADE,
  data              DATE    NOT NULL,
  horario           TIME    NOT NULL,
  duracao           INTEGER DEFAULT 60,
  status            TEXT    NOT NULL DEFAULT 'pendente'
                      CHECK (status IN ('pendente','confirmado','cancelado','concluido')),
  valor_total       NUMERIC(10,2) NOT NULL,
  metodo_pagamento  TEXT DEFAULT 'pix'
                      CHECK (metodo_pagamento IN ('pix','cartao','assinatura')),
  criado_em         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id  UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  aluno_id    UUID REFERENCES public.users(id)    ON DELETE CASCADE,
  trainer_id  UUID REFERENCES public.trainers(id) ON DELETE CASCADE,
  nota        INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario  TEXT,
  criado_em   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (booking_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id    UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  remetente_id  UUID REFERENCES public.users(id)   ON DELETE CASCADE,
  texto         TEXT    NOT NULL,
  lido          BOOLEAN DEFAULT FALSE,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────────
--  TRIGGER — cria linha em users ao registrar no Supabase Auth
-- ──────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nome, tipo)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'tipo', 'aluno')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ──────────────────────────────────────────────────────────────────
--  ROW LEVEL SECURITY
-- ──────────────────────────────────────────────────────────────────

ALTER TABLE public.users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages     ENABLE ROW LEVEL SECURITY;

-- users: cada um acessa apenas o próprio registro
CREATE POLICY "users_select_own"   ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_insert_own"   ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_own"   ON public.users FOR UPDATE USING (auth.uid() = id);

-- trainers: leitura pública; escrita apenas pelo dono
CREATE POLICY "trainers_select_all"  ON public.trainers FOR SELECT USING (true);
CREATE POLICY "trainers_insert_own"  ON public.trainers FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trainers_update_own"  ON public.trainers FOR UPDATE
  USING (auth.uid() = user_id);

-- availability: leitura pública; escrita pelo professor dono
CREATE POLICY "availability_select_all" ON public.availability FOR SELECT USING (true);
CREATE POLICY "availability_manage_own" ON public.availability FOR ALL
  USING (
    auth.uid() = (SELECT user_id FROM public.trainers WHERE id = trainer_id)
  );

-- bookings: aluno vê as suas; professor vê as do seu perfil
CREATE POLICY "bookings_select_aluno"   ON public.bookings FOR SELECT
  USING (auth.uid() = aluno_id);
CREATE POLICY "bookings_select_trainer" ON public.bookings FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM public.trainers WHERE id = trainer_id));
CREATE POLICY "bookings_insert_aluno"   ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = aluno_id);
CREATE POLICY "bookings_update_trainer" ON public.bookings FOR UPDATE
  USING (auth.uid() = (SELECT user_id FROM public.trainers WHERE id = trainer_id));
CREATE POLICY "bookings_update_aluno"   ON public.bookings FOR UPDATE
  USING (auth.uid() = aluno_id);

-- reviews: leitura pública; aluno insere a própria
CREATE POLICY "reviews_select_all"  ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_own"  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = aluno_id);
CREATE POLICY "reviews_update_own"  ON public.reviews FOR UPDATE
  USING (auth.uid() = aluno_id);

-- messages: apenas participantes da booking
CREATE POLICY "messages_select_participant" ON public.messages FOR SELECT
  USING (
    auth.uid() = remetente_id
    OR auth.uid() = (SELECT aluno_id FROM public.bookings WHERE id = booking_id)
    OR auth.uid() = (
      SELECT t.user_id FROM public.trainers t
      JOIN public.bookings b ON b.trainer_id = t.id
      WHERE b.id = booking_id
    )
  );
CREATE POLICY "messages_insert_participant" ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = remetente_id);
CREATE POLICY "messages_update_read" ON public.messages FOR UPDATE
  USING (
    auth.uid() != remetente_id
    AND (
      auth.uid() = (SELECT aluno_id FROM public.bookings WHERE id = booking_id)
      OR auth.uid() = (
        SELECT t.user_id FROM public.trainers t
        JOIN public.bookings b ON b.trainer_id = t.id
        WHERE b.id = booking_id
      )
    )
  );

-- ──────────────────────────────────────────────────────────────────
--  REALTIME (para chat — ETAPA 5)
-- ──────────────────────────────────────────────────────────────────
-- No Supabase Dashboard → Database → Replication
-- Habilite as tabelas: messages, bookings
