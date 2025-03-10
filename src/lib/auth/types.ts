
import { User } from '@/lib/types';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  userEmail: string | undefined;
  sendMagicLink: (email: string) => Promise<{ error: Error | null }>;
  isMagicLink: boolean;
  registerWithSchool: (email: string, password: string, username: string, schoolId: string) => Promise<{ error: Error | null }>;
}

// Demo user for demo mode
export const DEMO_USER: User = {
  id: 'demo-user-id',
  username: 'BleacherFan',
  name: 'Demo User',
  school: 'Westview High',
  badges: [{ id: 'badge-1', name: 'Student', type: 'student' }],
  points: 250,
  isAthlete: false,
  createdAt: new Date(),
  email: 'demo@example.com'
};
