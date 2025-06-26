export type User = {
  _id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  isActive: boolean;
  role: string;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type RegisterPayload = Pick<User, 'name' | 'email'> & {
  password: string;
};

export type LoginPayload = Pick<User, 'email'> & {
  password: string;
};

// Staff Management Types
export type CreateStaffPayload = {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string | null;
};

export type UpdateStaffPayload = {
  name?: string;
  email?: string;
  avatarUrl?: string | null;
  isActive?: boolean;
};

export type StaffListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
};

export type StaffListResponse = {
  staffs: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};
