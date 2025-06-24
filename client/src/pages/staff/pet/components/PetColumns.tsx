import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Pet } from '@/types/pet';
import { useDeletePet, useUpdatePetAvailability } from '@/hooks/usePets';

export const petColumns: ColumnDef<Pet>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'images',
    header: 'Image',
    cell: ({ row }) => {
      const images = row.getValue('images') as string[];
      const name = row.getValue('name') as string;
      return (
        <div className="flex items-center">
          {images && images.length > 0 ? (
            <img
              src={images[0]}
              alt={name}
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
              <span className="text-xs text-gray-400">No img</span>
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const pet = row.original;
      return (
        <div className="max-w-[200px]">
          <div className="font-medium">{row.getValue('name')}</div>
          <div className="text-sm text-gray-500">
            {pet.gender} • {pet.age}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'breed',
    header: 'Breed',
    cell: ({ row }) => {
      const breed = row.getValue('breed') as Pet['breed'];
      return <Badge variant="secondary">{breed?.name}</Badge>;
    },
    filterFn: (row, id, value) => {
      if (value === 'all') return true;
      const breed = row.getValue(id) as Pet['breed'];
      return breed.name === value;
    },
  },
  {
    accessorKey: 'color',
    header: 'Color',
    cell: ({ row }) => {
      const color = row.getValue('color') as Pet['color'];
      return (
        <div className="flex items-center space-x-2">
          <div
            className="h-4 w-4 rounded-full border"
            style={{ backgroundColor: color.hexCode }}
          />
          <span className="text-sm">{color.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'size',
    header: 'Size',
    cell: ({ row }) => {
      const size = row.getValue('size') as string;
      const variant =
        size === 'Large'
          ? 'default'
          : size === 'Medium'
            ? 'secondary'
            : 'outline';
      return <Badge variant={variant}>{size}</Badge>;
    },
    filterFn: (row, id, value) => {
      if (value === 'all') return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      return (
        <div className="text-right font-medium">
          {price.toLocaleString('vi-VN')} ₫
        </div>
      );
    },
  },
  {
    accessorKey: 'health',
    header: 'Health',
    cell: ({ row }) => {
      const pet = row.original;
      const healthScore = [
        pet.isVaccinated,
        pet.isDewormed,
        pet.hasCert,
        pet.hasMicrochip,
      ].filter(Boolean).length;

      return (
        <div className="text-center">
          <div className="text-sm font-medium">{healthScore}/4</div>
          <div className="text-xs text-gray-500">
            {pet.isVaccinated && '💉'} {pet.isDewormed && '🪱'}
            {pet.hasCert && '📋'} {pet.hasMicrochip && '🔗'}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue('location')}</div>;
    },
  },
  {
    accessorKey: 'isAvailable',
    header: 'Status',
    cell: ({ row }) => {
      const isAvailable = row.getValue('isAvailable') as boolean;
      return (
        <Badge variant={isAvailable ? 'default' : 'destructive'}>
          {isAvailable ? 'Available' : 'Sold'}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || value === 'all') {
        return true;
      }
      const isAvailable = row.getValue(id) as boolean;
      return isAvailable === (value === 'available');
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return (
        <div className="text-sm">
          <div>{date.toLocaleDateString('vi-VN')}</div>
          <div className="text-xs text-gray-500">
            {date.toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const pet = row.original;
      return <PetActionsCell pet={pet} />;
    },
  },
];

// Separate component for actions to handle hooks properly
function PetActionsCell({ pet }: { pet: Pet }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deletePet = useDeletePet();
  const updateAvailability = useUpdatePetAvailability();

  const handleToggleAvailability = async () => {
    try {
      await updateAvailability.mutateAsync({
        id: pet._id,
        isAvailable: !pet.isAvailable,
      });
    } catch (error) {
      // Error handled in mutation
    }
  };

  const handleDelete = async () => {
    try {
      await deletePet.mutateAsync(pet._id);
      setDeleteDialogOpen(false);
    } catch (error) {
      // Error handled in mutation
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(pet._id)}
          >
            Copy pet ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={`/staff/pets/${pet._id}`} className="flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              View details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to={`/staff/pets/${pet._id}/edit`}
              className="flex items-center"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit pet
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleToggleAvailability}
            disabled={updateAvailability.isPending}
          >
            {pet.isAvailable ? (
              <>
                <ToggleLeft className="mr-2 h-4 w-4" />
                Mark as Sold
              </>
            ) : (
              <>
                <ToggleRight className="mr-2 h-4 w-4" />
                Mark as Available
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete pet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{pet.name}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deletePet.isPending}
            >
              {deletePet.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
