import jwt, { SignOptions } from "jsonwebtoken";
import { JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES } from "../app/config/env";

export interface AccessTokenPayload {
  userId: string;
  rememberMe: boolean;
}

/** create access token */
export function signAccessToken(payload: AccessTokenPayload) {
  const expiresIn = payload.rememberMe ? "30d" : JWT_ACCESS_EXPIRES;

  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn } as SignOptions);
}

/** verify access token, throws on invalid */
export function verifyAccessToken<T = AccessTokenPayload>(token: string): T {
  return jwt.verify(token, JWT_ACCESS_SECRET) as T;
}
