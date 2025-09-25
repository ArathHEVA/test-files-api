import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

export async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export function randomToken(bytes = 24) {
  return randomBytes(bytes).toString("hex");
}
