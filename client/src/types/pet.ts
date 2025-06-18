export interface Pet {
  _id: string;
  name: string;
  breed: {
    _id: string;
    name: string;
    description?: string;
  };
  gender: 'Male' | 'Female';
  age: string;
  size: 'Small' | 'Medium' | 'Large';
  color: {
    _id: string;
    name: string;
    hexCode: string;
    description?: string;
  };
  price: number;
  images: string[];
  description?: string;
  isVaccinated: boolean;
  isDewormed: boolean;
  hasCert: boolean;
  hasMicrochip: boolean;
  location: string;
  publishedDate: string;
  additionalInfo?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}
