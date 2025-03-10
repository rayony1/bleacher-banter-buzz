
import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(2, { message: 'Username must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  schoolId: z.string({ required_error: 'Please select your school' }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export interface RegisterFormProps {
  onSuccess?: (email: string) => void;
}
