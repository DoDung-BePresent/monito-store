/**
 * Node modules
 */
import { useMemo } from 'react';
import { ArrowRightIcon, Package } from 'lucide-react';

/**
 * Components
 */
import { Button } from '@/components/ui/button';

/**
 * Hooks
 */
import { usePets } from '@/hooks/usePets';
import PetCard from '@/pages/main/pets/components/PetCard';

const PetSection = () => {
  const params = useMemo(() => {
    const p = new URLSearchParams();
    p.append('limit', '8');
    p.append('sortBy', 'createdAt');
    p.append('sortOrder', 'desc');
    p.append('isAvailable', 'true');
    return p;
  }, []);

  const { data, isLoading, error } = usePets(params);
  const pets = data?.pets || [];

  return (
    <section className="bg-white px-8 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm text-gray-600">What's new?</p>
            <h2 className="text-2xl font-bold text-[#003459]">
              Take A Look At Some Of Our Pets
            </h2>
          </div>
          <Button
            variant="outline"
            className="border-[#003459] bg-transparent text-[#003459] hover:bg-[#003459] hover:text-white"
          >
            View more
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>

        {error && (
          <div className="text-center text-red-500">
            Failed to load pets. Please try again later.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <PetCard.Skeleton key={index} />
              ))
            : pets.map((pet) => <PetCard key={pet._id} pet={pet} />)}
        </div>

        {!isLoading && pets.length === 0 && !error && (
          <div className="col-span-full py-12 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No Pets Available
            </h3>
            <p className="text-gray-600">
              There are currently no pets to display. Please check back later!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PetSection;
