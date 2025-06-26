import API from '../lib/axios';

export interface Staff {
  _id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  isActive: boolean;
  role: string;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string | null;
}

export interface UpdateStaffPayload {
  name?: string;
  email?: string;
  avatarUrl?: string | null;
  isActive?: boolean;
}

export interface StaffListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface StaffListResponse {
  staffs: Staff[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const staffService = {
  // Get all staff members
  getStaffs: async (query: StaffListQuery = {}): Promise<StaffListResponse> => {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.search) params.append('search', query.search);
    if (query.isActive !== undefined) params.append('isActive', query.isActive.toString());

    const response = await API.get(`/staff-management?${params.toString()}`);
    return response.data.data;
  },

  // Get staff by ID
  getStaffById: async (id: string): Promise<Staff> => {
    const response = await API.get(`/staff-management/${id}`);
    return response.data.data.staff;
  },

  // Create new staff
  createStaff: async (payload: CreateStaffPayload): Promise<Staff> => {
    const response = await API.post('/staff-management', payload);
    return response.data.data.staff;
  },

  // Update staff
  updateStaff: async (id: string, payload: UpdateStaffPayload): Promise<Staff> => {
    const response = await API.put(`/staff-management/${id}`, payload);
    return response.data.data.staff;
  },

  // Soft delete staff (deactivate)
  deleteStaff: async (id: string): Promise<void> => {
    await API.delete(`/staff-management/${id}`);
  },

  // Permanently delete staff
  permanentDeleteStaff: async (id: string): Promise<void> => {
    await API.delete(`/staff-management/${id}/permanent`);
  },

  // Activate staff
  activateStaff: async (id: string): Promise<Staff> => {
    const response = await API.patch(`/staff-management/${id}/activate`);
    return response.data.data.staff;
  },
};
