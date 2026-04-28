import { User, Booking, ChatMessage } from './types';

export const mockStudent: User = {
  id: 'u1',
  name: 'Mateus Silva',
  email: 'mateus.silva@fightlab.com',
  city: 'São Paulo',
  photo: 'https://i.pravatar.cc/300?img=68',
  role: 'student',
  favoriteTrainerIds: ['t1', 't2'],
};

export const mockTrainerUser: User = {
  id: 'u2',
  name: 'Rafael Santos',
  email: 'rafael.santos@fightlab.com',
  city: 'São Paulo',
  photo: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80',
  role: 'trainer',
  favoriteTrainerIds: [],
};

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    trainerId: 't1',
    studentId: 'u1',
    date: '2026-05-02',
    time: '19:00',
    duration: 60,
    price: 180,
    status: 'confirmed',
    paymentMethod: 'pix',
  },
  {
    id: 'b2',
    trainerId: 't2',
    studentId: 'u1',
    date: '2026-04-26',
    time: '20:00',
    duration: 60,
    price: 200,
    status: 'completed',
    paymentMethod: 'card',
  },
  {
    id: 'b3',
    trainerId: 't3',
    studentId: 'u1',
    date: '2026-04-18',
    time: '07:00',
    duration: 60,
    price: 220,
    status: 'completed',
    paymentMethod: 'card',
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'm1',
    senderId: 't1',
    text: 'Fala campeão! Tudo certo para a aula de amanhã?',
    timestamp: '09:14',
  },
  {
    id: 'm2',
    senderId: 'u1',
    text: 'Tudo certo, professor! Pode trazer luvas extras?',
    timestamp: '09:18',
  },
  {
    id: 'm3',
    senderId: 't1',
    text: 'Levo sim. Treino vai ser pesado, prepara o cardio.',
    timestamp: '09:20',
  },
  {
    id: 'm4',
    senderId: 'u1',
    text: 'Bora! Tô pronto.',
    timestamp: '09:21',
  },
  {
    id: 'm5',
    senderId: 't1',
    text: 'Até amanhã às 19h. Não atrasa.',
    timestamp: '09:22',
  },
];

export const mockTeacherStats = {
  monthRevenue: 8420,
  totalLessonsThisMonth: 47,
  averageRating: 4.9,
  weeklyRevenue: [820, 1100, 950, 1320, 880, 1240, 410],
  weekDays: ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'],
  todayLessons: [
    { time: '07:00', studentName: 'Carlos M.', modality: 'Boxe', status: 'completed' },
    { time: '11:00', studentName: 'Juliana T.', modality: 'Boxe', status: 'completed' },
    { time: '18:00', studentName: 'Pedro R.', modality: 'Kickboxing', status: 'next' },
    { time: '20:00', studentName: 'Marina L.', modality: 'Boxe', status: 'upcoming' },
  ],
};
