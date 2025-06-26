import API from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/user';

export const userService = {
  async getUsers(): Promise<ApiResponse<User[]>> {
    const res = await API.get<ApiResponse<User[]>>('/user');
    return res.data;
  },
  async createUser(data: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    const res = await API.post<ApiResponse<{ user: User }>>('/user', data);
    return res.data;
  },
  async updateUser(id: string, data: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    const res = await API.patch<ApiResponse<{ user: User }>>(`/user/${id}`, data);
    return res.data;
  },
  async deleteUser(id: string): Promise<ApiResponse> {
    const res = await API.delete<ApiResponse>(`/user/${id}`);
    return res.data;
  },
}; 