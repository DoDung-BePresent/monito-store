import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { petService } from '@/services/petService';
import type { CreatePetPayload, UpdatePetPayload, Pet } from '@/types/pet';
import type { ApiError } from '@/types/api';
import { getErrorMessage } from '@/utils/errorHandler';

export const petKeys = {
  all: ['pets'] as const,
  lists: () => [...petKeys.all, 'list'] as const,
  list: (filters: string) => [...petKeys.lists(), { filters }] as const,
  details: () => [...petKeys.all, 'detail'] as const,
  detail: (id: string) => [...petKeys.details(), id] as const,
};

// Get all pets
export const usePets = () => {
  return useQuery({
    queryKey: petKeys.lists(),
    queryFn: async () => {
      const response = await petService.getPets();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Get single pet by ID
export const usePet = (id: string) => {
  return useQuery({
    queryKey: petKeys.detail(id),
    queryFn: async () => {
      const response = await petService.getPetById(id);
      return response.data || null;
    },
    enabled: !!id,
  });
};

// Create pet mutation
export const useCreatePet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePetPayload) => petService.createPet(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: petKeys.all });
      const newPet = response.data;
      if (newPet) {
        queryClient.setQueryData(petKeys.lists(), (old: Pet[] = []) => [
          newPet,
          ...old,
        ]);
      }
      toast.success('Pet created successfully!');
      return newPet;
    },
    onError: (error: any) => {
      const apiError = error?.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Update pet mutation
export const useUpdatePet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePetPayload }) =>
      petService.updatePet(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: petKeys.all });
      const updatedPet = response.data;
      if (updatedPet) {
        queryClient.setQueryData(petKeys.detail(id), updatedPet);
        queryClient.setQueryData(petKeys.lists(), (old: Pet[] = []) =>
          old.map((pet) => (pet._id === id ? updatedPet : pet)),
        );
      }
      toast.success('Pet updated successfully!');
      return updatedPet;
    },
    onError: (error: any) => {
      const apiError = error?.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Update pet availability
export const useUpdatePetAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      petService.updateAvailability(id, isAvailable),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: petKeys.all });
      const updatedPet = response.data?.pet;
      if (updatedPet) {
        queryClient.setQueryData(petKeys.detail(id), updatedPet);
        queryClient.setQueryData(petKeys.lists(), (old: Pet[] = []) =>
          old.map((pet) => (pet._id === id ? updatedPet : pet)),
        );
      }
      toast.success('Pet availability updated successfully!');
      return updatedPet;
    },
    onError: (error: any) => {
      const apiError = error?.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Delete pet mutation
export const useDeletePet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => petService.deletePet(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(petKeys.lists(), (old: Pet[] = []) =>
        old.filter((pet) => pet._id !== deletedId),
      );
      queryClient.removeQueries({ queryKey: petKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: petKeys.all });
      toast.success('Pet deleted successfully!');
    },
    onError: (error: any) => {
      const apiError = error?.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Bulk operations
export const useBulkDeletePets = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => petService.deletePet(id)));
      return ids;
    },
    onSuccess: (deletedIds) => {
      queryClient.setQueryData(petKeys.lists(), (old: Pet[] = []) =>
        old.filter((pet) => !deletedIds.includes(pet._id)),
      );
      deletedIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: petKeys.detail(id) });
      });
      queryClient.invalidateQueries({ queryKey: petKeys.all });
      toast.success(`${deletedIds.length} pets deleted successfully!`);
    },
    onError: (error: any) => {
      const apiError = error?.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Bulk update availability
export const useBulkUpdatePetAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      ids,
      isAvailable,
    }: {
      ids: string[];
      isAvailable: boolean;
    }) => {
      const results = await Promise.all(
        ids.map((id) => petService.updateAvailability(id, isAvailable)),
      );
      return {
        ids,
        isAvailable,
        pets: results.map((r) => r.data?.pet).filter(Boolean),
      };
    },
    onSuccess: ({ ids, isAvailable, pets }) => {
      queryClient.setQueryData(petKeys.lists(), (old: Pet[] = []) =>
        old.map((pet) => {
          if (ids.includes(pet._id)) {
            return { ...pet, isAvailable };
          }
          return pet;
        }),
      );

      pets.forEach((pet) => {
        if (pet) {
          queryClient.setQueryData(petKeys.detail(pet._id), pet);
        }
      });

      queryClient.invalidateQueries({ queryKey: petKeys.all });

      const action = isAvailable ? 'made available' : 'marked as sold';
      toast.success(`${ids.length} pets ${action} successfully!`);
    },
    onError: (error: any) => {
      const apiError = error?.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};
