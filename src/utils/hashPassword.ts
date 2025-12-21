import bcrypt from "bcryptjs";
import { BCRYPT_SALT_ROUND } from "../app/config/env";

export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUND);
  return bcrypt.hash(plain, salt);
}

export async function comparePassword(plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed);
}
