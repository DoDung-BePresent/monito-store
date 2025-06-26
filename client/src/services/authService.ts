/**
 * Lib
 */
import API from '@/lib/axios';

/**
 * Types
 */
import type { ApiResponse } from '@/types/api';
import type { LoginPayload, RegisterPayload, User } from '@/types/user';

export const authService = {
  async register(data: RegisterPayload): Promise<ApiResponse> {
    const response = await API.post<ApiResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginPayload): Promise<ApiResponse<{ user: User }>> {
    const response = await API.post<ApiResponse<{ user: User }>>(
      '/auth/login',
      data,
    );
    return response.data;
  },

  async logout(): Promise<ApiResponse> {
    const response = await API.post<ApiResponse>('/auth/logout');
    return response.data;
  },

  async refreshToken(): Promise<ApiResponse> {
    const response = await API.post<ApiResponse>('/auth/refresh-token');
    return response.data;
  },

  async getCurrentUser(): Promise<ApiResponse<{ user: User | null }>> {
    const response = await API.get<ApiResponse<{ user: User }>>('/user/current-user');
    if (response.data && typeof response.data === 'object' && 'user' in response.data) {
      return { data: { user: response.data.user as User | null } };
    }
    return { data: { user: null } };
  },
};
