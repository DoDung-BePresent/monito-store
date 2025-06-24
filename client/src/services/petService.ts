/**
 * Lib
 */
import API from '@/lib/axios';

/**
 * Types
 */
import type { ApiResponse } from '@/types/api';
import type { Pet, CreatePetPayload, UpdatePetPayload } from '@/types/pet';

export const petService = {
  // Get all pets
  async getPets(): Promise<ApiResponse<Pet[]>> {
    const response = await API.get<ApiResponse<{ pets: Pet[] }>>('/pets');
    return {
      ...response.data,
      data: response.data.data?.pets || [],
    };
  },

  // Get pet by ID
  async getPetById(id: string): Promise<ApiResponse<Pet>> {
    const response = await API.get<ApiResponse<{ pet: Pet }>>(`/pets/${id}`);
    return {
      ...response.data,
      data: response.data.data?.pet,
    };
  },

  // Create new pet
  async createPet(data: CreatePetPayload): Promise<ApiResponse<Pet>> {
    const response = await API.post<ApiResponse<{ pet: Pet }>>('/pets', data);
    return {
      ...response.data,
      data: response.data.data?.pet,
    };
  },

  // Update pet by ID
  async updatePet(
    id: string,
    data: UpdatePetPayload,
  ): Promise<ApiResponse<Pet>> {
    const response = await API.patch<ApiResponse<{ pet: Pet }>>(
      `/pets/${id}`,
      data,
    );
    return {
      ...response.data,
      data: response.data.data?.pet,
    };
  },

  // Update pet availability
  async updateAvailability(
    id: string,
    isAvailable: boolean,
  ): Promise<ApiResponse<{ pet: Pet }>> {
    const response = await API.patch<ApiResponse<{ pet: Pet }>>(
      `/pets/${id}/availability`,
      { isAvailable },
    );
    return response.data;
  },

  // Delete pet by ID
  async deletePet(id: string): Promise<ApiResponse<null>> {
    const response = await API.delete<ApiResponse<null>>(`/pets/${id}`);
    return response.data;
  },

  // Upload image
  async uploadImage(file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    const formData = new FormData();
    formData.append('image', file);
    const response = await API.post<ApiResponse<{ imageUrl: string }>>(
      '/files/upload',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  },
};
