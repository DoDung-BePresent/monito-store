import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BreedDataTable } from './components/BreedDataTable';
import { breedColumns } from './components/BreedColumns';
import { breedService } from '@/services/breedService';
import type { Breed, CreateBreedPayload, UpdateBreedPayload } from '@/types/breed';

const BreedsManagement = () => {
  const queryClient = useQueryClient();

  // Lấy danh sách breed
  const { data, isLoading } = useQuery({
    queryKey: ['breeds'],
    queryFn: breedService.getBreeds,
  });

  // Thêm breed
  const createBreed = useMutation({
    mutationFn: (payload: CreateBreedPayload) => breedService.createBreed(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['breeds'] }),
  });
  // Sửa breed
  const updateBreed = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBreedPayload }) => breedService.updateBreed(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['breeds'] }),
  });
  // Xóa breed
  const deleteBreed = useMutation({
    mutationFn: (id: string) => breedService.deleteBreed(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['breeds'] }),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-8 py-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Breeds Management</h1>
        <p className="text-muted-foreground">
          Manage pet breeds and classifications for your store.
        </p>
      </div>

      <BreedDataTable
        columns={breedColumns}
        data={data?.data ?? []}
        onCreate={createBreed.mutate}
        onUpdate={updateBreed.mutate}
        onDelete={deleteBreed.mutate}
        className="rounded-lg bg-white p-6 shadow"
      />
    </div>
  );
};

export default BreedsManagement;
