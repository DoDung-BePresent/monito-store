export type Pet = {
  _id: string;
  sku: string;
  name: string;
  breed: string;
  gender: 'Male' | 'Female';
  age: string;
  size: 'Small' | 'Medium' | 'Large';
  color: string;
  price: number;
  images: string[];
  description?: string;
  isVaccinated: boolean;
  isDewormed: boolean;
  hasCert: boolean;
  hasMicrochip: boolean;
  location: string;
  publishedDate: Date;
  additionalInfo?: string;
  category: 'Dog' | 'Cat' | 'Bird' | 'Fish' | 'Other';
  isAvailable: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePetPayload = Omit<
  Pet,
  '_id' | 'createdAt' | 'updatedAt' | 'createdBy'
>

export type UpdatePetPayload = Partial<CreatePetPayload>;

export type PetFilters = {
  category?: string;
  breed?: string;
  gender?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'publishedDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
};
