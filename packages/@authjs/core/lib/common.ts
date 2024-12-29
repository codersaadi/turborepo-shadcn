"use server";
import bcrypt from "bcryptjs";
export const hashMyPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};
