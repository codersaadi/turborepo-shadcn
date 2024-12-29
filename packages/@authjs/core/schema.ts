import * as z from "zod";
const EmailAddressError = "Please enter a valid email address";
const PasswordError = "Password is too short";
const emailSchema = z.string().email({
  message: EmailAddressError,
});

export const ForgotPasswordSchema = z.object({
  email: emailSchema,
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(7, {
    message: PasswordError,
  }),
  confirmPassword: z.string().min(7, {
    message: PasswordError,
  }),
});

export const LoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, {
    message: PasswordError,
  }),
});

export const SignupSchema = z.object({
  name: z.string(),
  email: emailSchema,
  password: z.string().min(7, { message: PasswordError }),
});
export const MagicSignInSchema = z.object({
  email: emailSchema,
});
export type MagicSignInType = z.infer<typeof MagicSignInSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type SignupSchemaType = z.infer<typeof SignupSchema>;
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
