import API from '@/lib/axios';
import type { Product, ProductFilters, CreateProductPayload, UpdateProductPayload } from '@/types/product';
import type { ApiResponse } from '@/types/api';

export const productService = {
  /**
   * Create a new product
   * @param productData - The product data to create
   * @returns Promise with the created product
   */
  async createProduct(productData: CreateProductPayload): Promise<ApiResponse<{ product: Product }>> {
    const response = await API.post<ApiResponse<{ product: Product }>>(
      '/products', 
      productData
    );
    return response.data;
  },

  /**
   * Get a product by ID
   * @param id - The ID of the product to get
   * @returns Promise with the product
   */
  async getProductById(id: string): Promise<ApiResponse<{ product: Product }>> {
    const response = await API.get<ApiResponse<{ product: Product }>>(`/products/${id}`);
    return response.data;
  },

  /**
   * Update a product
   * @param id - The ID of the product to update
   * @param productData - The product data to update
   * @returns Promise with the updated product
   */
  async updateProduct(
    id: string,
    productData: UpdateProductPayload
  ): Promise<ApiResponse<{ product: Product }>> {
    const response = await API.put<ApiResponse<{ product: Product }>>(
      `/products/${id}`, 
      productData
    );
    return response.data;
  },

  /**
   * Delete a product
   * @param id - The ID of the product to delete
   * @returns Promise with the deleted product
   */
  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    const response = await API.delete<ApiResponse<null>>(`/products/${id}`);
    return response.data;
  },  
  /**
   * Filter products based on criteria
   * @param filters - The filter criteria
   * @returns Promise with filtered products and pagination
   */  async filterProducts(filters: ProductFilters): Promise<ApiResponse<{
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
  }>> {
    console.log('Original filters:', filters);
    
    // Create a simple params object that will properly convert to query string
    const params: Record<string, string | number | boolean> = {
      // Always send page and limit as numbers
      page: Number(filters.page || 1),
      limit: Number(filters.limit || 15),
      // Always include sorting
      sortBy: filters.sortBy || 'createdAt',
      sortOrder: filters.sortOrder || 'desc'
    };
    
    // Add optional filters if defined
    if (filters.category && filters.category !== 'all') params.category = filters.category;
    if (filters.brand) params.brand = filters.brand;
    if (filters.search) params.search = filters.search;
    if (filters.minPrice !== undefined) params.minPrice = Number(filters.minPrice);
    if (filters.maxPrice !== undefined) params.maxPrice = Number(filters.maxPrice);
    
    // Boolean values need special handling
    if (filters.isActive !== undefined) params.isActive = !!filters.isActive;
    if (filters.inStock !== undefined) params.inStock = !!filters.inStock;
    
    console.log('Clean params being sent to API:', params);
    
    // Make direct API call using params object
    const response = await API.get<ApiResponse<{
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
    }>>('/products', { params });
    
    return response.data;
  },/**
   * Get product filter options for dropdowns
   * @returns Promise with filter options
   */  async getProductFilterOptions(): Promise<ApiResponse<{ 
    categories: Array<{_id: string, name: string, description?: string}>;
    brands: string[];
    priceRange: {minPrice: number, maxPrice: number};
  }>> {
    // Use a completely separate path to avoid route conflicts
    const response = await API.get<ApiResponse<{
      categories: Array<{_id: string, name: string, description?: string}>;
      brands: string[];
      priceRange: {minPrice: number, maxPrice: number};
    }>>('/products/options/filters');
    return response.data;
  },

  /**
   * Update product stock
   * @param id - The ID of the product to update stock
   * @param quantity - The quantity to update
   * @param operation - The operation to perform (add or subtract)
   * @returns Promise with the updated product
   */
  async updateStock(
    id: string,
    quantity: number,
    operation: 'add' | 'subtract'
  ): Promise<ApiResponse<{ product: Product }>> {
    const response = await API.patch<ApiResponse<{ product: Product }>>(
      `/products/${id}/stock`,
      { quantity: Number(quantity), operation }
    );
    return response.data;
  }
};
