# FightLab

Plataforma mobile que conecta alunos a professores de artes marciais para aulas particulares (Personal Fight). Identidade visual inspirada no app oficial da UFC: dark, tipografia condensada, vermelho como acento único.

## Stack

- **React Native 0.74** + **Expo SDK 51**
- **Expo Router 3** (navegação por arquivos com tipagem)
- **React Native Reanimated 3** (animações)
- **Expo Image** (otimização de imagens)
- **AsyncStorage** (persistência local)
- **Expo Haptics** (feedback tátil)
- **TypeScript estrito**

## Estrutura

```
/app                  → telas (Expo Router)
  /(auth)             → login + cadastro
  /(tabs)             → home, busca, agenda, perfil (com BottomTabBar custom)
  /trainer/[id]       → perfil do professor (3 abas)
  /booking/[id]       → fluxo agendamento em 3 passos
  /payment            → PIX, cartão, assinatura
  /confirmation       → check animado pós-pagamento
  /dashboard          → painel do professor
  /chat/[id]          → chat aluno↔professor
  /index              → splash
  /onboarding         → escolha aluno/professor
  /_layout            → root stack

/components           → TrainerCard, TrainerCardFeatured, RankingItem,
                        ScheduleCalendar, TimeSlotPicker, StarRating,
                        BottomTabBar, ModalityChip, RatingChart,
                        Skeleton, PrimaryButton, Input, SectionHeader

/hooks                → useAuth, useTrainers, useBookings, useFonts
/constants            → colors, fonts, spacing
/data                 → mock JSON (8 professores completos), types
```

## Como rodar

```bash
npm install
npx expo start
```

Aperte `w` para web · `a` para Android · `i` para iOS · ou escaneie o QR code com o **Expo Go**.

## Design system

- **Fundo**: `#0A0A0A` · **Surfaces**: `#111111`, `#1A1A1A`
- **Acento**: `#D62828` (apenas em CTAs, badges, ativos)
- **Display**: Bebas Neue · **Body**: DM Sans · **Números**: Barlow
- **Padding tela**: 20px · **Botão primário**: 52px · radius 6px · uppercase bold
- **Linhas**: `rgba(255,255,255,0.06)`

## Fluxos implementados

1. Splash → Onboarding → Cadastro/Login
2. Home aluno → Buscar → Perfil professor → Agendar → Pagar → Confirmar (4 taps)
3. Aba Agenda com histórico e próximas
4. Perfil do aluno com favoritos e histórico
5. Dashboard do professor com métricas, gráfico semanal, próxima aula com timer
6. Chat estilo WhatsApp com tema escuro

## Mock data

8 professores em `data/trainers.ts` com bio, agenda dinâmica (7 dias), avaliações, histórico de rating, fotos placeholder do Unsplash. Estrutura pronta para substituir por API: basta trocar a fonte dos hooks `useTrainers` / `useBookings`.

## Próximos passos

- Configurar ícones reais (`assets/icon.png`, `assets/splash.png`, `adaptive-icon.png`)
- Substituir mocks por API real (JWT auth + endpoints REST)
- Notificações push (`expo-notifications`)
- Pagamentos via Stripe / Mercado Pago
