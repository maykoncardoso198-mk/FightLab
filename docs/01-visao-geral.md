# FightLab — Visão Geral do Projeto

> Marketplace de artes marciais que conecta alunos a professores de luta particular.  
> Inspirado no visual da UFC: escuro, vermelho, tipografia impactante.

---

## O que é

Plataforma onde **alunos** encontram, avaliam e agendam aulas com **professores** de modalidades de luta (Boxe, Muay Thai, Jiu-Jitsu, MMA, Kickboxing, Judô, Capoeira, Luta Livre). O professor tem um painel próprio para gerenciar agenda e receita.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React Native 0.74 + Expo SDK 51 |
| Navegação | Expo Router 3 (file-based) |
| Animações | React Native Reanimated 3 |
| Imagens | expo-image |
| Backend | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| Persistência local | AsyncStorage / localStorage (sessão Supabase) |
| Tipagem | TypeScript strict |
| Web / Deploy | Expo static export → Vercel |

---

## Telas implementadas

| Rota | Arquivo | Descrição |
|---|---|---|
| `/` | `app/index.tsx` | Splash com foto hero + gradiente |
| `/onboarding` | `app/onboarding.tsx` | Escolha de perfil: Aluno ou Professor |
| `/(auth)/login` | `app/(auth)/login.tsx` | Login |
| `/(auth)/register` | `app/(auth)/register.tsx` | Cadastro (campos variam por role) |
| `/(admin)/` | `app/(admin)/index.tsx` | Área admin: KPIs, professores, alunos, agendamentos |
| `/(tabs)/` | `app/(tabs)/index.tsx` | Home do aluno: destaque duel, ranking, próximos |
| `/(tabs)/search` | `app/(tabs)/search.tsx` | Busca com filtros de modalidade, cidade e preço |
| `/(tabs)/agenda` | `app/(tabs)/agenda.tsx` | Aulas agendadas e histórico do aluno |
| `/(tabs)/profile` | `app/(tabs)/profile.tsx` | Perfil do aluno com favoritos e configurações |
| `/trainer/[id]` | `app/trainer/[id].tsx` | Perfil do professor (3 abas: Visão, Agenda, Reviews) |
| `/booking/[id]` | `app/booking/[id].tsx` | Agendamento em 3 passos (data → hora → resumo) |
| `/payment` | `app/payment.tsx` | Pagamento: PIX, Cartão ou Assinatura |
| `/confirmation` | `app/confirmation.tsx` | Confirmação animada pós-pagamento |
| `/dashboard` | `app/dashboard.tsx` | Painel do professor (receita, aulas, ranking) |
| `/chat/[id]` | `app/chat/[id].tsx` | Chat aluno ↔ professor |

---

## Arquitetura de pastas

```
app/              → telas (Expo Router — cada arquivo = rota)
  (auth)/         → fluxo de autenticação
  (tabs)/         → abas principais do aluno
  (admin)/        → área administrativa (role admin)
  booking/        → agendamento dinâmico por professor
  trainer/        → perfil dinâmico por professor
  chat/           → chat dinâmico por professor

components/       → componentes reutilizáveis
constants/        → design tokens (cores, fontes, espaçamentos)
data/             → tipos TypeScript + dados mock
hooks/            → lógica de estado (auth, bookings, trainers, fonts)
lib/
  supabase.ts     → cliente Supabase SSR-safe
  api/
    trainers.ts   → fetch de professores + mapper DB→TS
    bookings.ts   → CRUD de agendamentos + mapper DB→TS
docs/             → documentação do projeto
```

---

## Design System

**Cores principais**
- `background` `#0A0A0A` — fundo base (toda a app)
- `surface` `#111111` — cards e painéis
- `red` `#D62828` — único acento colorido (CTAs, seleções, destaque)
- `textPrimary` `#FFFFFF` / `textSecondary` `#A0A0A0`

**Tipografia**
- Display (títulos grandes): `BebasNeue_400Regular`
- Corpo bold: `DMSans_700Bold`
- Corpo regular: `DMSans_400Regular`
- Números: `Barlow_700Bold` / `Barlow_900Black`

**Regra de design:** nunca usar fundo branco/claro. Vermelho só em elementos de ação ou destaque — nunca como fundo de tela.

---

## Dados

O app usa **Supabase como backend** com fallback automático para dados mock quando as variáveis de ambiente não estão configuradas.

| Arquivo | Conteúdo |
|---|---|
| `data/types.ts` | Interfaces: Trainer, User, Booking, ChatMessage, DaySchedule |
| `data/trainers.ts` | 8 professores mock (fallback quando Supabase ausente) |
| `data/user.ts` | mockStudent, mockAdmin, mockStudents (9), mockAllBookings (12) |
| `lib/api/trainers.ts` | Queries reais ao Supabase com mapper PT→EN |
| `lib/api/bookings.ts` | CRUD real de agendamentos com mapper PT→EN |
| `docs/02-supabase-schema.sql` | Schema completo: 6 tabelas + RLS + trigger de auth |

Ver detalhes completos em [03-backend-supabase.md](./03-backend-supabase.md).

---

## Fluxo principal do aluno

```
Splash → Onboarding → Register/Login
  → Home → Buscar professor
  → Perfil do professor → Agendar aula
  → Pagamento → Confirmação → Chat
```

---

## Próximos passos (backend)

| Etapa | O que é |
|---|---|
| ETAPA 2 | Supabase Auth real — login, cadastro, logout, proteção de rotas |
| ETAPA 3 | Upload de foto via expo-image-picker → Supabase Storage |
| ETAPA 4 | Booking real no DB + bloqueio de slots + dashboard real |
| ETAPA 5 | Chat em tempo real com Supabase Realtime + badges |

Outras evoluções futuras:
- Notificações push
- Mapa de professores por localização
- Sistema de assinatura real
- Painel do professor com edição de agenda
- Avaliação pós-aula pelo aluno

---

_Última atualização: 2026-05-03_
