export type Product = {
  _id: string;
  name: string;
  category: string | { _id: string; name: string; description?: string };
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  specifications: {
    ageGroup?: string;
    petType?: string[] | string;
    ingredients?: string[];
    [key: string]: any;
  };
  stock: number;
  isInStock: boolean;
  tags: string[];
  gifts?: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  discount?: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateProductPayload = Omit<
  Product,
  '_id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'
>;

export type UpdateProductPayload = Partial<CreateProductPayload>;

export type ProductFilters = {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  petType?: string;
  inStock?: boolean;
  isActive?: boolean;
  search?: string; 
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
};

export type ProductsResponse = {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};