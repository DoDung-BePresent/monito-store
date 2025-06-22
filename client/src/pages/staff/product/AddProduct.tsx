import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Save,
  Eye,
  Tag,
  Gift,
  Package,
  DollarSign,
  Upload,
  X,
  ImageIcon,
  Plus,
  AlertCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mockCategories, mockBrands } from '@/data/mockProducts';

// Validation schema
const addProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Name too long'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required').max(100, 'Brand name too long'),
  price: z.number().min(1, 'Price must be greater than 0'),
  originalPrice: z.number().optional(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description too long'),
  specifications: z.object({
    weight: z.string().optional(),
    size: z.string().optional(),
    material: z.string().optional(),
    color: z.string().optional(),
  }),
  stock: z.number().min(0, 'Stock cannot be negative'),
  isActive: z.boolean(),
});

type AddProductFormValues = z.infer<typeof addProductSchema>;

const AddProduct = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [gifts, setGifts] = useState<string[]>([]);
  const [currentGift, setCurrentGift] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: '',
      category: '',
      brand: '',
      price: 0,
      originalPrice: undefined,
      description: '',
      specifications: {
        weight: '',
        size: '',
        material: '',
        color: '',
      },
      stock: 0,
      isActive: true,
    },
  });

  // Handle file upload
  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter((file) =>
        file.type.startsWith('image/'),
      );

      if (imageFiles.length === 0) {
        alert('Please select valid image files');
        return;
      }

      const newImages = [...images, ...imageFiles].slice(0, 5); // Max 5 images
      setImages(newImages);

      // Generate previews
      const newPreviews: string[] = [];
      newImages.forEach((file, index) => {
        if (index < imagePreviews.length) {
          newPreviews.push(imagePreviews[index]);
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreviews((prev) => {
              const updated = [...prev];
              updated[index] = e.target?.result as string;
              return updated;
            });
          };
          reader.readAsDataURL(file);
          newPreviews.push(''); // Placeholder
        }
      });
      setImagePreviews(newPreviews);
    },
    [images, imagePreviews],
  );

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const onSubmit = async (data: AddProductFormValues) => {
    if (images.length === 0) {
      alert('Please add at least one product image.');
      return;
    }

    setIsSubmitting(true);

    try {
      // In real app, you would upload images to server/cloud storage first
      // For demo, we'll use the preview URLs
      const imageUrls = imagePreviews.filter((preview) => preview !== '');

      // Calculate discount
      let discount = undefined;
      if (data.originalPrice && data.originalPrice > data.price) {
        discount = Math.round(
          ((data.originalPrice - data.price) / data.originalPrice) * 100,
        );
      }

      const selectedCategory = mockCategories.find(
        (cat) => cat._id === data.category,
      );

      const productData = {
        ...data,
        _id: `product_${Date.now()}`,
        category: selectedCategory || { _id: data.category, name: 'Unknown' },
        discount,
        images: imageUrls,
        tags,
        gifts,
        specifications: {
          ...data.specifications,
          ingredients: ingredients.length > 0 ? ingredients : undefined,
        },
        isInStock: data.stock > 0,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Adding product:', productData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const existingProducts = JSON.parse(
        localStorage.getItem('newProducts') || '[]',
      );
      localStorage.setItem(
        'newProducts',
        JSON.stringify([productData, ...existingProducts]),
      );

      alert('Product has been added successfully!');
      navigate('/staff/products');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (
      currentTag.trim() &&
      !tags.includes(currentTag.trim()) &&
      tags.length < 10
    ) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addGift = () => {
    if (
      currentGift.trim() &&
      !gifts.includes(currentGift.trim()) &&
      gifts.length < 5
    ) {
      setGifts([...gifts, currentGift.trim()]);
      setCurrentGift('');
    }
  };

  const removeGift = (giftToRemove: string) => {
    setGifts(gifts.filter((gift) => gift !== giftToRemove));
  };

  const addIngredient = () => {
    if (
      currentIngredient.trim() &&
      !ingredients.includes(currentIngredient.trim()) &&
      ingredients.length < 20
    ) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients(
      ingredients.filter((ingredient) => ingredient !== ingredientToRemove),
    );
  };

  const calculateDiscount = () => {
    const price = form.watch('price');
    const originalPrice = form.watch('originalPrice');
    if (originalPrice && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Add New Product
              </h1>
              <p className="text-sm text-gray-500">
                Create a new product for your store
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                disabled={isSubmitting}
                className="hidden sm:flex"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-blue-600 shadow-md hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Adding Product...' : 'Add Product'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left Column - Main Content */}
              <div className="space-y-6 lg:col-span-2">
                {/* Basic Information */}
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="h-5 w-5 text-blue-600" />
                      Product Information
                    </CardTitle>
                    <CardDescription>
                      Enter the basic details about your product
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Product Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter a descriptive product name"
                              className="h-11 border-gray-300 text-base focus:border-blue-500 focus:ring-blue-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Category *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {mockCategories.map((category) => (
                                  <SelectItem
                                    key={category._id}
                                    value={category._id}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Brand *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500">
                                  <SelectValue placeholder="Select a brand" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {mockBrands.map((brand) => (
                                  <SelectItem key={brand} value={brand}>
                                    {brand}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Description *
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your product in detail. Include features, benefits, and what makes it special..."
                              className="min-h-[120px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="flex justify-between">
                            <span>
                              Be descriptive to help customers understand your
                              product
                            </span>
                            <span className="text-xs">
                              {field.value?.length || 0}/2000
                            </span>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Product Images */}
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ImageIcon className="h-5 w-5 text-green-600" />
                      Product Images
                    </CardTitle>
                    <CardDescription>
                      Add up to 5 high-quality images. The first image will be
                      the main product image.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Upload Area */}
                    <div
                      className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                        dragActive
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileInput}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                      <div className="space-y-4">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                          <Upload className="h-full w-full" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-700">
                            Drag & drop images here, or click to select
                          </p>
                          <p className="text-sm text-gray-500">
                            PNG, JPG, GIF up to 10MB each (max 5 images)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="group relative">
                            <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100">
                              {preview ? (
                                <img
                                  src={preview}
                                  alt={`Product ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                                </div>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            {index === 0 && (
                              <Badge className="absolute bottom-2 left-2 bg-blue-600 text-xs">
                                Main
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {images.length === 0 && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          At least one product image is required to create a
                          product.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Specifications */}
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Product Specifications
                    </CardTitle>
                    <CardDescription>
                      Add detailed specifications and ingredients
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="specifications.weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 3kg, 500g"
                                className="border-gray-300"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="specifications.size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Size</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Large, Medium, Small"
                                className="border-gray-300"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="specifications.material"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Material</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Stainless Steel, Cotton"
                                className="border-gray-300"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="specifications.color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Black, Blue, Mixed"
                                className="border-gray-300"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    {/* Ingredients */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FormLabel className="text-sm font-medium">
                          Ingredients (for food products)
                        </FormLabel>
                        <Badge variant="secondary" className="text-xs">
                          {ingredients.length}/20
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add ingredient"
                          value={currentIngredient}
                          onChange={(e) => setCurrentIngredient(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === 'Enter' &&
                            (e.preventDefault(), addIngredient())
                          }
                          className="flex-1 border-gray-300"
                        />
                        <Button
                          type="button"
                          onClick={addIngredient}
                          variant="outline"
                          size="sm"
                          disabled={ingredients.length >= 20}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {ingredients.map((ingredient, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="cursor-pointer transition-colors hover:bg-red-100"
                              onClick={() => removeIngredient(ingredient)}
                            >
                              {ingredient}
                              <X className="ml-1 h-3 w-3" />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Pricing & Stock */}
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      Pricing & Stock
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Selling Price (VND) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              className="border-gray-300 text-lg font-semibold focus:border-green-500"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="originalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Original Price (VND)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              className="border-gray-300"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            For discount calculation
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {calculateDiscount() > 0 && (
                      <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                        <p className="text-sm font-medium text-green-800">
                          Discount: {calculateDiscount()}% OFF
                        </p>
                        <p className="text-xs text-green-600">
                          Customers will see this as a deal!
                        </p>
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock Quantity *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              className="border-gray-300"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-gray-300"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">
                              Active Product
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Product will be visible to customers
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Tag className="h-4 w-4 text-purple-600" />
                      Tags
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {tags.length}/10
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' && (e.preventDefault(), addTag())
                        }
                        className="flex-1 border-gray-300"
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        variant="outline"
                        size="sm"
                        disabled={tags.length >= 10}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer transition-colors hover:bg-red-50"
                            onClick={() => removeTag(tag)}
                          >
                            {tag}
                            <X className="ml-1 h-3 w-3" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Free Gifts */}
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Gift className="h-4 w-4 text-pink-600" />
                      Free Gifts
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {gifts.length}/5
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add gift"
                        value={currentGift}
                        onChange={(e) => setCurrentGift(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' && (e.preventDefault(), addGift())
                        }
                        className="flex-1 border-gray-300"
                      />
                      <Button
                        type="button"
                        onClick={addGift}
                        variant="outline"
                        size="sm"
                        disabled={gifts.length >= 5}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {gifts.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {gifts.map((gift, index) => (
                          <Badge
                            key={index}
                            className="cursor-pointer bg-pink-600 transition-colors hover:bg-red-100"
                            onClick={() => removeGift(gift)}
                          >
                            {gift}
                            <X className="ml-1 h-3 w-3" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddProduct;
