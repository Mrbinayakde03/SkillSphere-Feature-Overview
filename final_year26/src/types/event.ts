export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  college: string;
  eligibility: string[];
  skills: string[];
  maxParticipants: number;
  currentParticipants: number;
  imageUrl?: string;
  registrationDeadline: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
  status: 'registered' | 'attended' | 'cancelled';
}
