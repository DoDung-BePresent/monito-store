import { Category } from './category';

export type Product = {
  _id: string;
  name: string;
  category: Category | string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  images: string[];
  specifications: {
    weight?: string;
    size?: string;
    material?: string;
    color?: string;
    ingredients?: string[];
  };
  stock: number;
  isInStock: boolean;
  tags?: string[];
  gifts?: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProductPayload = {
  name: string;
  category: string; // ObjectId string
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  specifications: {
    weight?: string;
    size?: string;
    material?: string;
    color?: string;
    ingredients?: string[];
  };
  stock: number;
  tags?: string[];
  gifts?: string[];
  isActive?: boolean;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

export type ProductFilters = {
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
};
