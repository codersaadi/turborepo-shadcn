import bcrypt from "bcryptjs";
// import { EmailService } from "../services/mail.sender";
// export async function sendEmailVerification(email: string, token: string) {
//     const verificationLink = `http://localhost:3000/auth/email_verify?token=${token}`;
//     const sender = new EmailService();
//     await sender.sendVerificationEmail(email, verificationLink);
//   }

export const hashMyPassword = async (password: string) => {
	return await bcrypt.hash(password, 10);
};

// export async function sendResetPasswordEmail(email: string, token : string) {
//   const sender = new EmailService()
//   const link = `http://localhost:3000/auth/new-password?token=${token}`
//   await sender.sendResetPasswordEmail(email, link)
// }
