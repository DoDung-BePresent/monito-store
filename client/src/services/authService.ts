/**
 * Lib
 */
import API from '@/lib/axios';

/**
 * Types
 */
import type { ApiResponse } from '@/types/api';
import type {
  LoginPayload,
  RegisterPayload,
  User,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '@/types/user';

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

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await API.put<ApiResponse<{ user: User }>>(
      '/user/profile',
      data,
    );
    return response.data.data.user;
  },

  async getCurrentUser(): Promise<User> {
    const response =
      await API.get<ApiResponse<{ user: User }>>('/user/current-user');
    return response.data.data.user;
  },

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await API.put('/user/change-password', data);
  },

  async forgotPassword(data: ForgotPasswordPayload): Promise<ApiResponse> {
    const response = await API.post<ApiResponse>('/auth/forgot-password', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordPayload): Promise<ApiResponse> {
    const response = await API.post<ApiResponse>('/auth/reset-password', data);
    return response.data;
  },

  async isSameName(name: string): Promise<boolean> {
    const response =
      await API.get<ApiResponse<{ user: User }>>('/user/current-user');
    const currentUser = response.data.data?.user;
    if (!currentUser) return false;
    return currentUser.name === name;
  },
};
