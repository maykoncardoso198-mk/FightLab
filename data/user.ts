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

export const mockAdmin: User = {
  id: 'admin1',
  name: 'Admin FightLab',
  email: 'admin@fightlab.com',
  city: 'São Paulo',
  photo: 'https://i.pravatar.cc/300?img=70',
  role: 'admin',
  favoriteTrainerIds: [],
};

export const mockStudents: User[] = [
  { id: 'u3',  name: 'Carlos Menezes',    email: 'carlos.m@fightlab.com',   city: 'São Paulo',      photo: 'https://i.pravatar.cc/300?img=12', role: 'student', favoriteTrainerIds: ['t1'] },
  { id: 'u4',  name: 'Juliana Torres',    email: 'juliana.t@fightlab.com',   city: 'São Paulo',      photo: 'https://i.pravatar.cc/300?img=45', role: 'student', favoriteTrainerIds: ['t2', 't5'] },
  { id: 'u5',  name: 'Pedro Rocha',       email: 'pedro.r@fightlab.com',     city: 'Rio de Janeiro', photo: 'https://i.pravatar.cc/300?img=33', role: 'student', favoriteTrainerIds: ['t3'] },
  { id: 'u6',  name: 'Marina Lima',       email: 'marina.l@fightlab.com',    city: 'São Paulo',      photo: 'https://i.pravatar.cc/300?img=20', role: 'student', favoriteTrainerIds: ['t2'] },
  { id: 'u7',  name: 'Fernando Alves',    email: 'fernando.a@fightlab.com',  city: 'Belo Horizonte', photo: 'https://i.pravatar.cc/300?img=53', role: 'student', favoriteTrainerIds: ['t5'] },
  { id: 'u8',  name: 'Camila Sousa',      email: 'camila.s@fightlab.com',    city: 'Belo Horizonte', photo: 'https://i.pravatar.cc/300?img=47', role: 'student', favoriteTrainerIds: ['t5', 't6'] },
  { id: 'u9',  name: 'André Vieira',      email: 'andre.v@fightlab.com',     city: 'Curitiba',       photo: 'https://i.pravatar.cc/300?img=15', role: 'student', favoriteTrainerIds: ['t4'] },
  { id: 'u10', name: 'Patricia Oliveira', email: 'patricia.o@fightlab.com',  city: 'Salvador',       photo: 'https://i.pravatar.cc/300?img=49', role: 'student', favoriteTrainerIds: ['t7'] },
];

export const allStudents: User[] = [mockStudent, ...mockStudents];

export const mockAllBookings: Booking[] = [
  ...mockBookings,
  { id: 'b4',  trainerId: 't1', studentId: 'u3',  date: '2026-04-28', time: '07:00', duration: 60, price: 180, status: 'completed',  paymentMethod: 'pix' },
  { id: 'b5',  trainerId: 't2', studentId: 'u4',  date: '2026-05-03', time: '09:00', duration: 60, price: 200, status: 'confirmed',   paymentMethod: 'card' },
  { id: 'b6',  trainerId: 't3', studentId: 'u5',  date: '2026-04-25', time: '07:00', duration: 60, price: 220, status: 'completed',   paymentMethod: 'pix' },
  { id: 'b7',  trainerId: 't4', studentId: 'u9',  date: '2026-05-05', time: '18:00', duration: 60, price: 250, status: 'confirmed',   paymentMethod: 'card' },
  { id: 'b8',  trainerId: 't5', studentId: 'u7',  date: '2026-04-20', time: '09:00', duration: 60, price: 170, status: 'cancelled',   paymentMethod: 'pix' },
  { id: 'b9',  trainerId: 't6', studentId: 'u8',  date: '2026-04-22', time: '16:00', duration: 60, price: 190, status: 'completed',   paymentMethod: 'subscription' },
  { id: 'b10', trainerId: 't7', studentId: 'u10', date: '2026-05-01', time: '17:00', duration: 60, price: 130, status: 'confirmed',   paymentMethod: 'pix' },
  { id: 'b11', trainerId: 't8', studentId: 'u5',  date: '2026-04-15', time: '21:00', duration: 60, price: 210, status: 'completed',   paymentMethod: 'card' },
  { id: 'b12', trainerId: 't1', studentId: 'u6',  date: '2026-04-10', time: '19:00', duration: 60, price: 180, status: 'cancelled',   paymentMethod: 'pix' },
];

export const mockAdminStats = {
  totalStudents: 9,
  activeTrainers: 8,
  totalBookings: 12,
  monthlyRevenue: 9420,
  weeklyBookings: [2, 1, 3, 2, 1, 2, 1],
  weekDays: ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'],
  topModalities: [
    { modality: 'Judô',      count: 421 },
    { modality: 'Capoeira',  count: 268 },
    { modality: 'Muay Thai', count: 256 },
  ],
};

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
