export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface GoogleLoginRequest {
  GoogleToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expires: string;
}

export interface JwtPayload {
  nameid: string;
  unique_name: string;
  email: string;
  nbf: number;
  exp: number;
  iat: number;
  iss: string;
  aud: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAllDevices: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
}

export interface FavoriteMusic {
  id: string;
  title: string;
  artist: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FavoriteMusicRequest {
  title: string;
  artist: string;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
