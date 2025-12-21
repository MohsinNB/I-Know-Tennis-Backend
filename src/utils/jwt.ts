import jwt, { SignOptions } from "jsonwebtoken";
import {
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES,
} from "../app/config/env";

export interface AccessTokenPayload {
  userId: string;
}

export interface RefreshTokenPayload {
  userId: string;
}

/** create access token */
export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES,
  } as SignOptions);
}

/** create refresh token */
export function signRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES,
  } as SignOptions);
}

/** verify access token, throws on invalid */
export function verifyAccessToken<T = AccessTokenPayload>(token: string): T {
  return jwt.verify(token, JWT_ACCESS_SECRET) as T;
}

/** verify refresh token, throws on invalid */
export function verifyRefreshToken<T = RefreshTokenPayload>(token: string): T {
  return jwt.verify(token, JWT_REFRESH_SECRET) as T;
}
