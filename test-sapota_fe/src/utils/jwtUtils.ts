import { jwtDecode } from 'jwt-decode';
import type { JwtPayload, User } from '../types';

export const decodeJwtToken = (token: string): JwtPayload => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    throw new Error('Invalid token format');
  }
};

export const extractUserFromToken = (token: string): User => {
  const payload = decodeJwtToken(token);
  
  return {
    id: payload.nameid,
    email: payload.email,
    name: payload.unique_name,
  };
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeJwtToken(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

export const isTokenCloseToExpiry = (token: string, minutesBeforeExpiry: number = 5): boolean => {
  try {
    const payload = decodeJwtToken(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = minutesBeforeExpiry * 60;
    return payload.exp < (currentTime + bufferTime);
  } catch {
    return true;
  }
};
