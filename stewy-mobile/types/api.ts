export type UserRole = 'ADMIN' | 'VOLUNTEER';
export type UserStatus = 'PENDING' | 'ACTIVE';

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  status: UserStatus;
}

export interface AuthResponse {
  token: string;
  user: UserDto;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export type GameStatus = 'CREATE' | 'OPEN' | 'CLOSED';

export type ParticipationStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'INVITED' | 'CANCELLED' | 'WITHDRAWN';

export type ClubStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ClubDto {
  id: string;
  clubName: string;
}

export interface GameDto {
  id: string;
  game: string;
  appointment: string;
  deadline: string;
  status: GameStatus;
  location: string;
  accessibility: string;
  homeTeam: ClubDto;
  awayTeam: ClubDto;
  participants: unknown[];
}

export interface VolunteerProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  club: ClubDto | null;
  kbvbId: string;
  profileStatus: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  clubStatus: ClubStatus | null;
}

export interface VolunteerGameEntry {
  volunteerId: string;
  volunteerName: string;
  status: ParticipationStatus;
}
