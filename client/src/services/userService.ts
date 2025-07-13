import API from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
export interface SummaryResponse {
  totalUsers: {
    count: number;
    percentChange: number;
  };
  activeUsers: {
    count: number;
    percentChange: number;
  };
  suspendedUsers: {
    count: number;
    weeklyChange: number;
  };
  newUsersThisMonth: {
    count: number;
    percentChange: number;
  };
}
export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  phone: string;
  orders: number
  role: "Customer" | "Staff" | "Admin" | string;
  isActive: boolean;
  avatar?: string;
  joinDate: string;
  lastLogin: string;
  totalSpent: number;
}
export type APIResponse<T> = {
  data: T;
  message?: string;
};
export const fetchSummary = async (): Promise<ApiResponse<SummaryResponse>> => {
  const res = await API.get("/user/summary");
  console.log("DATA:", res.data);
  return res.data.data;
};

export const fetchUsers = async (): Promise<ApiResponse<UserResponse[]>> => {
  const res = await API.get("/user");
  console.log("DATA:", res.data.data);
  return res.data.data;
}
export const updateUserStatus = async (userId: string, isActive: boolean): Promise<ApiResponse<UserResponse>> => {
  const res = await API.patch(`/user/${userId}/status`, {
    isActive,
  });
  console.log("DATA:", res.data);
  return res.data;
}