import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(6, 'Password must be at least 6 characters'),
    new_password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export const updateAccountSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateAccountFormData = z.infer<typeof updateAccountSchema>;
