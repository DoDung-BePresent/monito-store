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

const ColorsManagement = () => {
  // @ts-ignore
  const [colors, setColors] = useState([
    { id: 1, name: 'Black', hex: '#000000', usageCount: 25 },
    { id: 2, name: 'White', hex: '#FFFFFF', usageCount: 18 },
    { id: 3, name: 'Brown', hex: '#8B4513', usageCount: 22 },
    { id: 4, name: 'Golden', hex: '#FFD700', usageCount: 15 },
    { id: 5, name: 'Gray', hex: '#808080', usageCount: 12 },
    { id: 6, name: 'Orange', hex: '#FFA500', usageCount: 8 },
  ]);

  return (
    <div className="container mx-auto p-8 py-0">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Colors</h1>
          <p className="text-gray-600">Manage pet colors for classification</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add Color
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Color List</CardTitle>
          <CardDescription>{colors.length} colors available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {colors.map((color) => (
              <div
                key={color.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="h-8 w-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <p className="font-medium">{color.name}</p>
                    <p className="text-sm text-gray-600">{color.hex}</p>
                    <p className="text-xs text-gray-500">
                      {color.usageCount} pets
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorsManagement;
