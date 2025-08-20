import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { FavoriteMusicRequest, GoogleLoginRequest } from '../types';
import { isTokenCloseToExpiry } from '../utils/jwtUtils';

class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  private constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (token) {
          if (isTokenCloseToExpiry(token, 5) && refreshToken) {
            try {
              console.log('Token is close to expiry, refreshing...');
              const response = await this.refreshToken(refreshToken);
              localStorage.setItem('accessToken', response.data.accessToken);
              localStorage.setItem('refreshToken', response.data.refreshToken);
              
              config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            } catch (error) {
              console.error('Failed to refresh token:', error);
              config.headers.Authorization = `Bearer ${token}`;
            }
          } else {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        if (error.response?.status === 401) {
          if (error.response?.data?.message) {
            return Promise.reject(error);
          }
          
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const response = await this.refreshToken(refreshToken);
              localStorage.setItem('accessToken', response.data.accessToken);
              localStorage.setItem('refreshToken', response.data.refreshToken);
              
              const originalRequest = error.config;
              originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
              return this.api(originalRequest);
            } catch {
              this.logout();
              window.location.href = '/login';
            }
          } else {
            this.logout();
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  private logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  public getApi(): AxiosInstance {
    return this.api;
  }

  public async login(email: string, password: string) {
    return this.api.post('/api/Auth/login', { email, password });
  }

  public async register(email: string, password: string, name: string) {
    return this.api.post('/api/Auth/register', { email, password, name });
  }

  public async googleLogin(req: GoogleLoginRequest) {
    return this.api.post('/api/Auth/google-login', req);
  }

  public async refreshToken(refreshToken: string) {
    return this.api.post('/api/Auth/refresh-token', { refreshToken });
  }

  public async revokeToken(refreshToken: string) {
    return this.api.post('/api/Auth/revoke-token', { refreshToken });
  }

  public async logoutAllDevices() {
    return this.api.post('/api/Auth/logout-all-devices');
  }

  public async getFavoriteMusic() {
    return this.api.get('/api/FavoriteMusic');
  }

  public async createFavoriteMusic(music: FavoriteMusicRequest) {
    return this.api.post('/api/FavoriteMusic', music);
  }

  public async getFavoriteMusicPaged(page: number = 1, pageSize: number = 10) {
    return this.api.get(`/api/FavoriteMusic/paged?pageNumber=${page}&pageSize=${pageSize}`);
  }

  public async searchFavoriteMusic(query: string) {
    return this.api.get(`/api/FavoriteMusic/search?searchTerm=${encodeURIComponent(query)}`);
  }

  public async getFavoriteMusicById(id: string) {
    return this.api.get(`/api/FavoriteMusic/${id}`);
  }

  public async updateFavoriteMusic(id: string, music: FavoriteMusicRequest) {
    return this.api.put(`/api/FavoriteMusic/${id}`, music);
  }

  public async deleteFavoriteMusic(id: string) {
    return this.api.delete(`/api/FavoriteMusic/${id}`);
  }
}

export default ApiService.getInstance();
