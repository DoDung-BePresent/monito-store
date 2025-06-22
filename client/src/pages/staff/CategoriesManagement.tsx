import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';

const CategoriesManagement = () => {
  // @ts-ignore
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Food',
      description: 'Pet food and treats',
      productCount: 45,
    },
    {
      id: 2,
      name: 'Toys',
      description: 'Pet toys and entertainment',
      productCount: 32,
    },
    {
      id: 3,
      name: 'Accessories',
      description: 'Collars, leashes, and accessories',
      productCount: 28,
    },
    {
      id: 4,
      name: 'Health',
      description: 'Health and wellness products',
      productCount: 15,
    },
  ]);

  return (
    <div className="container mx-auto p-8 py-0">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage product categories</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {category.name}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {category.productCount}
              </p>
              <p className="text-sm text-gray-600">Products in category</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoriesManagement;
