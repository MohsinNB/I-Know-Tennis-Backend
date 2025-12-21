import dotenv from "dotenv";
dotenv.config();

const get = (k: string, fallback?: string): string => {
  const v = process.env[k];
  if (v === undefined) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${k}`);
  }
  return v;
};

export const PORT: number = Number(get("PORT", "3000")); // Example of another conversion
export const DB_URL = get("DB_URL");
export const JWT_ACCESS_SECRET = get("JWT_ACCESS_SECRET");
export const JWT_ACCESS_EXPIRES = get("JWT_ACCESS_EXPIRES", "1d");
export const JWT_REFRESH_SECRET = get("JWT_REFRESH_SECRET");
export const JWT_REFRESH_EXPIRES = get("JWT_REFRESH_EXPIRES", "30d");
export const BCRYPT_SALT_ROUND: number = Number(get("BCRYPT_SALT_ROUND", "10"));
export const EMAIL_USER = get("EMAIL_USER");
export const EMAIL_PASS = get("EMAIL_PASS");
