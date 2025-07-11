import API from '@/lib/axios';
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
export interface UserResponse  {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders : number
  role: "Customer" | "Staff" | "Admin" | string;
  isActive: boolean;
  avatar?: string; 
  joinDate: string; 
  lastLogin: string;
  totalSpent: number;
}
export const fetchSummary = async (): Promise<SummaryResponse> => {
  const res = await API.get("/user/summary");
  console.log("DATA:", res.data);
   return res.data.data;
};

export const fetchUsers =async () :Promise<UserResponse[]> =>{
  const res = await API.get("/user/getAllUsers");
  console.log("DATA:", res.data.data);
   return res.data.data;
}