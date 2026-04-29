export type Modality =
  | 'Boxe'
  | 'Muay Thai'
  | 'Jiu-Jitsu'
  | 'MMA'
  | 'Kickboxing'
  | 'Judô'
  | 'Capoeira'
  | 'Luta Livre';

export interface TimeSlot {
  time: string; // "07:00"
  available: boolean;
}

export interface DaySchedule {
  date: string; // ISO YYYY-MM-DD
  weekday: string; // "SEG", "TER"...
  slots: TimeSlot[];
}

export interface Review {
  id: string;
  studentName: string;
  studentPhoto: string;
  rating: number;
  comment: string;
  date: string;
}

export interface RatingPoint {
  month: string; // "JAN", "FEV"
  value: number; // 0..5
}

export interface Trainer {
  id: string;
  name: string;
  photo: string;
  heroPhoto: string;
  modalities: Modality[];
  primaryModality: Modality;
  city: string;
  neighborhood: string;
  distanceKm: number;
  pricePerHour: number;
  experienceYears: number;
  graduation: string;
  rating: number;
  totalLessons: number;
  bio: string;
  isFeatured: boolean;
  rankingPosition: number;
  schedule: DaySchedule[];
  reviews: Review[];
  ratingHistory: RatingPoint[];
  nextAvailable: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  photo: string;
  role: 'student' | 'trainer' | 'admin';
  favoriteTrainerIds: string[];
}

export interface Booking {
  id: string;
  trainerId: string;
  studentId: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  paymentMethod: 'pix' | 'card' | 'subscription';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}
