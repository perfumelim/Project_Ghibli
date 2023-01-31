import { AuthenticationError } from 'apollo-server-express';
import { IncomingHttpHeaders } from 'http';
import jwt from 'jsonwebtoken'
import User from '../entities/User'
import { Response } from 'express';

export const DEFAULT_JWT_SECRET_KEY = 'secret-key';
export const REFRESH_JWT_SECRET_KEY = 'secret-key2';

export interface JwtVerifiedUser {
  userId: User['id'];
}

export const createAccessToken = (user: User): string => {
  const userData: JwtVerifiedUser = { userId: user.id };
  const accessToken = jwt.sign(
    userData,
    process.env.JWT_SECRET_KEY || DEFAULT_JWT_SECRET_KEY,
    { expiresIn: '10m' },
  );
  return accessToken;
};

export const createRefreshToken = (user: User): string => {
  const userData: JwtVerifiedUser = {userId: user.id};
  return jwt.sign(
    userData,
    process.env.JWT_REFRESH_SECRET_KEY || REFRESH_JWT_SECRET_KEY,
    {expiresIn: '14d'}
  )
}

/** 액세스 토큰 검증 */
export const verifyAccessToken = (
  accessToken?: string,
): JwtVerifiedUser | null => {
  if (!accessToken) return null;
  try {
    const verified = jwt.verify(
      accessToken,
      process.env.JWT_SECRET_KEY || DEFAULT_JWT_SECRET_KEY,
    ) as JwtVerifiedUser;
    return verified;
  } catch (err) {
    console.error('access_token expired: ', err.expiredAt);
    throw new AuthenticationError('access token expired');
  }
};
/** req.headers로부터 액세스 토큰 검증 */
export const verifyAccessTokenFromReqHeaders = (
  headers: IncomingHttpHeaders,
): JwtVerifiedUser | null => {
  const { authorization } = headers;
  if (!authorization) return null;

  const accessToken = authorization.split(' ')[1];
  try {
    return verifyAccessToken(accessToken);
  } catch {
    return null;
  }
};

export const setRefreshTokenHeader = (
  res: Response,
  refreshToken: string,
): void => {
  res.cookie('refreshtoken', refreshToken, {
    // 자바스크립트 코드로 접근 불가능하도록
    httpOnly: true,
    // 프로덕션 환경의 경우, https 프로토콜에서만 동작하도록
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}