export type Product = {
  _id: string;
  name: string;
  category: 'Food' | 'Toy' | 'Accessory' | 'Healthcare' | 'Grooming' | 'Other';
  subcategory?: string;
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
    ageGroup?: string;
    petType?: string[];
    ingredients?: string[];
  };
  stock: number;
  isInStock: boolean;
  tags: string[];
  gifts?: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProductPayload = Omit<
  Product,
  '_id' | 'createdAt' | 'updatedAt' | 'isInStock' | 'discount' | 'createdBy' | 'rating' | 'reviewCount'
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
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
};
