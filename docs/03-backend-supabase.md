# FightLab — Backend Supabase (ETAPA 1)

> Integração da camada de dados com Supabase (PostgreSQL + Auth + Storage + Realtime).  
> O app mantém fallback para dados mock quando as env vars não estão configuradas.

---

## Stack de backend

| Serviço | Uso |
|---|---|
| Supabase PostgreSQL | Banco de dados principal (6 tabelas) |
| Supabase Auth | Login / cadastro com email e senha |
| Supabase Storage | Upload de fotos de perfil (bucket `avatars`) |
| Supabase Realtime | Chat em tempo real (tabela `messages`) |
| Row Level Security | Controle de acesso por usuário (RLS) |

---

## Variáveis de ambiente

Arquivo `.env.local` na raiz (nunca commitado):

```env
EXPO_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>
```

- Prefixo `EXPO_PUBLIC_` obrigatório para o Expo expor a variável no bundle do cliente.
- Apenas a chave `anon` vai no app — a `service_role` fica exclusivamente em scripts server-side.

---

## Cliente Supabase — `lib/supabase.ts`

```
lib/
  supabase.ts       → cliente central + flag isSupabaseConfigured
  api/
    trainers.ts     → fetch, filtros, mapper DB→TS
    bookings.ts     → CRUD de agendamentos, mapper DB→TS
```

### Padrão SSR-safe

O `AsyncStorage` trava com `window is not defined` no SSR do Expo Router web.  
Solução: storage adapter com detecção de ambiente em runtime:

| Ambiente | Storage usado |
|---|---|
| SSR (server-side render) | `undefined` — sem persistência, sem crash |
| Web browser | `localStorage` |
| iOS / Android native | `AsyncStorage` (carregado via `require()` dinâmico) |

---

## Schema do banco — `docs/02-supabase-schema.sql`

Execute no Supabase Dashboard → SQL Editor → Run.

### Tabelas

| Tabela | Descrição |
|---|---|
| `users` | Perfil de todos os usuários (alunos, professores, admin) |
| `trainers` | Dados profissionais do professor (ligado a `users`) |
| `availability` | Disponibilidade por dia da semana e horário |
| `bookings` | Agendamentos entre aluno e professor |
| `reviews` | Avaliações pós-aula (1 por booking) |
| `messages` | Mensagens do chat por booking |

### Trigger de auth

Ao registrar no Supabase Auth, um trigger cria automaticamente a linha correspondente em `public.users`:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nome, tipo)
  VALUES (NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'tipo', 'aluno'))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### RLS (Row Level Security)

| Tabela | Regra |
|---|---|
| `users` | Cada usuário acessa apenas o próprio registro |
| `trainers` | Leitura pública; escrita apenas pelo dono (`user_id`) |
| `availability` | Leitura pública; escrita apenas pelo professor dono |
| `bookings` | Aluno vê as suas; professor vê as do seu perfil |
| `reviews` | Leitura pública; aluno insere/edita a própria |
| `messages` | Apenas participantes da booking (aluno ou professor) |

---

## Mapeamento de colunas (PT ↔ EN)

O banco usa nomes em português (padrão do projeto). As API functions mapeiam para os tipos TypeScript em inglês:

| DB (português) | TypeScript (inglês) |
|---|---|
| `aluno_id` | `studentId` |
| `trainer_id` | `trainerId` |
| `data` | `date` |
| `horario` | `time` |
| `duracao` | `duration` |
| `valor_total` | `price` |
| `metodo_pagamento` | `paymentMethod` |
| `pendente / confirmado / cancelado / concluido` | `pending / confirmed / cancelled / completed` |
| `pix / cartao / assinatura` | `pix / card / subscription` |

---

## Padrão mock-with-fallback

Os hooks inicializam com dados mock (evita flash vazio) e atualizam com dados reais quando o Supabase está configurado:

```typescript
// hooks/useTrainers.ts
const [data, setData] = useState<Trainer[]>(() => mockTrainers.filter(/* filtros */));

useEffect(() => {
  if (!isSupabaseConfigured) return; // continua com mock
  fetchTrainers(filters).then(setData);
}, [filters.*]);
```

Resultado: app 100% funcional sem `.env.local` (só mock), e com dados reais quando as env vars estão preenchidas.

---

## Hooks atualizados

| Hook | O que mudou |
|---|---|
| `hooks/useTrainers.ts` | Busca do Supabase com fallback mock |
| `hooks/useBookings.ts` | CRUD via `lib/api/bookings.ts`, sem mais AsyncStorage direto |

---

## ETAPAs do backend (roadmap)

| # | Etapa | Status |
|---|---|---|
| 1 | Integração de dados (trainers, bookings) | ✅ Concluído |
| 2 | Supabase Auth real (login, cadastro, logout, proteção de rotas) | ⏳ Pendente |
| 3 | Upload de foto via expo-image-picker → Storage bucket `avatars` | ⏳ Pendente |
| 4 | Booking real no DB + bloqueio de slots + dashboard real | ⏳ Pendente |
| 5 | Chat em tempo real com Supabase Realtime + badges de não lidos | ⏳ Pendente |

---

_Última atualização: 2026-05-03_
