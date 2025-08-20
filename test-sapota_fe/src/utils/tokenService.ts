import { extractUserFromToken } from './jwtUtils';
import type { User } from '../types';

class TokenService {
  private refreshTimer: number | null = null;
  private isRefreshing = false;
  private onTokenRefresh: ((userData: User | null) => void) | null = null;

  public setTokenRefreshCallback(callback: (userData: User | null) => void) {
    this.onTokenRefresh = callback;
  }

  public startAutomaticRefresh() {
    this.scheduleNextRefresh();
  }

  public stopAutomaticRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private scheduleNextRefresh() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      return;
    }

    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;
      
      const refreshTime = Math.max(timeUntilExpiry - (5 * 60 * 1000), 30000);

      if (refreshTime > 0) {
        this.refreshTimer = setTimeout(() => {
          this.performRefresh();
        }, refreshTime) as unknown as number;
      } else {
        this.performRefresh();
      }
    } catch (error) {
      console.error('Error scheduling token refresh:', error);
    }
  }

  private async performRefresh() {
    if (this.isRefreshing) {
      return;
    }

    this.isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('http://localhost:5000/api/Auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`Refresh failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      const userData = extractUserFromToken(data.accessToken);
      
      if (this.onTokenRefresh) {
        this.onTokenRefresh(userData);
      }
      
      this.scheduleNextRefresh();

    } catch (error) {
      console.error('Automatic token refresh failed:', error);
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      if (this.onTokenRefresh) {
        this.onTokenRefresh(null);
      }
    } finally {
      this.isRefreshing = false;
    }
  }

  public forceRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    this.performRefresh();
  }
}

export const tokenService = new TokenService();
