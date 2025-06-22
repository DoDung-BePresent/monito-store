import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2, AlertCircle, Trash, Edit, Eye, MoreHorizontal } from 'lucide-react';
// Remove toast if not available and use alert instead
import { ProductDataTable } from './components/ProductDataTable';
import { productColumns } from './components/ProductColumns';
import { productService } from '@/services/productService';
import { useDebounce } from '../../../hooks/useDebounce';
import type { Product, ProductFilters } from '@/types/product';
import type { ApiResponse } from '@/types/api';

const ProductsManagement = () => {
  const queryClient = useQueryClient();

  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'name' | 'price' | 'rating'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [category, setCategory] = useState<string>('');  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Fixed value instead of state

  // Debounce search query to prevent excessive API calls
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Get filter options
  const { data: filterOptionsData } = useQuery({
    queryKey: ['productFilterOptions'],
    queryFn: () => productService.getProductFilterOptions(),
  });

  // Fetch products
  const {
    data: productsData,
    isLoading,
    isError,
    error
  } = useQuery<
    ApiResponse<{
      products: Product[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
      appliedFilters?: {
        applied: boolean;
        criteria: Record<string, any>;
      };
    }>,
    Error
  >(  {
    queryKey: ['products', debouncedSearch, sortBy, sortOrder, category, currentPage, itemsPerPage],
    queryFn: async () => {
      // Make sure to ONLY use correctly typed values, not strings
      const filters: ProductFilters = {
        page: currentPage, // Already a number
        limit: itemsPerPage, // Already a number
        sortBy,
        sortOrder,
        isActive: true // Explicitly a boolean
      };
      if (category && category !== 'all') filters.category = category;
      if (debouncedSearch) filters.search = debouncedSearch;

      console.log('Sending filters to API:', filters);
      const response = await productService.filterProducts(filters);
      console.log('API Response:', response);
      return response;
    },
    placeholderData: (previousData) => previousData 
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      alert("Product deleted successfully");
    },
    onError: (err: Error) => {
      alert(`Error: ${err.message || "Failed to delete product"}`);
    }
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle sorting change
  const handleSortChange = (value: 'createdAt' | 'name' | 'price' | 'rating') => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // Handle sort order change
  const handleSortOrderChange = (value: 'asc' | 'desc') => {
    setSortOrder(value);
    setCurrentPage(1);
  };

  // Handle category filter change
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };  // Get columns with enhanced actions
  const columns = useMemo(() => {
    return productColumns.map(col => 
      col.id === 'actions' 
        ? {
            ...col,
            cell: ({ row }: { row: any }) => {
              const product = row.original;
              
              return (
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
                      onClick={() => navigator.clipboard.writeText(product._id)}
                    >
                      Copy product ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/staff/products/${product._id}/edit`} className="flex items-center">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit product
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center text-red-600"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this product?')) {
                          deleteMutation.mutate(product._id);
                        }
                      }}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete product
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }
          }
        : col
    );
  }, [deleteMutation]);

  const categories = filterOptionsData?.data?.categories || [];

  return (
    <div className="container mx-auto p-8 py-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Products Management
        </h1>
        <p className="text-muted-foreground">
          Manage your store products, inventory, and pricing.
        </p>
      </div>

      {/* Search and filters section */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat: any) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={handleSortOrderChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="mb-6 flex items-center gap-2 rounded-md bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p>Error loading products: {(error as Error).message}</p>
        </div>
      )}      {/* Loading state */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading products...</span>
        </div>
      ) : (
        <>
          {/* Debug info - remove in production */}
          {(() => {
            console.log('Products data:', productsData);
            return null;
          })()}
          
          {/* Products table */}          
          <ProductDataTable
            columns={columns}
            data={productsData?.data?.products || []}
            className="rounded-lg bg-white p-6 shadow"
          />

          {/* Pagination */}
          {productsData?.data?.pagination && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, productsData.data.pagination.totalItems)} of{" "}
                {productsData.data.pagination.totalItems} products
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="mx-2">
                  Page {currentPage} of {productsData.data.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= productsData.data.pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsManagement;