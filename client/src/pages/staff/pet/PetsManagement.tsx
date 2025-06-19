import { useEffect, useState } from 'react';
import { mockPets } from '@/data/mockPets';
import { PetDataTable } from './components/PetDataTable';
import { petColumns } from './components/PetColumns';
import type { Pet } from '@/types/pet';

const PetsManagement = () => {
  const [data, setData] = useState<Pet[]>(mockPets);

  useEffect(() => {
    const newPets = JSON.parse(localStorage.getItem('newPets') || '[]');
    if (newPets.length > 0) {
      setData([...newPets, ...mockPets]);
    }
  }, []);

  return (
    <div className="container mx-auto p-8 py-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pets Management</h1>
        <p className="text-muted-foreground">
          Manage pet listings, health records, and availability.
        </p>
      </div>
      <PetDataTable
        columns={petColumns}
        data={data}
        className="rounded-lg bg-white p-6 shadow"
        setData={setData}
      />
    </div>
  );
};

export default PetsManagement;
