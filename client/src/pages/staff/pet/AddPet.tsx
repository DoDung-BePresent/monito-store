import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
<<<<<<< Updated upstream
import { Save } from 'lucide-react';
=======
import {
  Save,
  ArrowLeft,
  Package,
  ImageIcon,
  Info,
  Upload,
  X,
  AlertCircle,
} from 'lucide-react';

>>>>>>> Stashed changes
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreatePet } from '@/hooks/usePets';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
<<<<<<< Updated upstream
import { ImageIcon, Package, Info } from 'lucide-react';
=======
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreatePet } from '@/hooks/usePets';
import { useActiveBreeds } from '@/hooks/useBreeds';
import { useActiveColors } from '@/hooks/useColors';
>>>>>>> Stashed changes

const addPetSchema = z.object({
  name: z.string().min(1, 'Pet name is required').max(100),
  breed: z.string().min(1, 'Breed is required'),
  gender: z.enum(['Male', 'Female']),
  age: z.string().min(1, 'Age is required'),
  size: z.enum(['Small', 'Medium', 'Large']),
  color: z.string().min(1, 'Color is required'),
  price: z.number().min(0, 'Price must be positive'),
<<<<<<< Updated upstream
  images: z.array(z.string().url('Must be a valid URL')).min(1, 'At least one image'),
=======
>>>>>>> Stashed changes
  description: z.string().optional(),
  isVaccinated: z.boolean(),
  isDewormed: z.boolean(),
  hasCert: z.boolean(),
  hasMicrochip: z.boolean(),
  location: z.string().min(1, 'Location is required'),
  publishedDate: z.string().min(1, 'Published date is required'),
  additionalInfo: z.string().optional(),
  isAvailable: z.boolean(),
  sku: z.string().min(1, 'SKU is required'),
  publishedDate: z.string().min(1, 'Published date is required'),
});

type AddPetFormValues = z.infer<typeof addPetSchema>;

const AddPet = () => {
  const navigate = useNavigate();
  const createPet = useCreatePet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<AddPetFormValues>({
    resolver: zodResolver(addPetSchema),
    defaultValues: {
      name: '',
      breed: '',
      gender: 'Male',
      age: '',
      size: 'Small',
      color: '',
      price: 0,
      description: '',
      isVaccinated: false,
      isDewormed: false,
      hasCert: false,
      hasMicrochip: false,
      location: '',
      publishedDate: '',
      additionalInfo: '',
      isAvailable: true,
      sku: '',
      publishedDate: new Date().toISOString().split('T')[0], // Default to today
    },
  });

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter((file) =>
        file.type.startsWith('image/'),
      );

      if (imageFiles.length === 0) return;

      const newImages = [...images, ...imageFiles].slice(0, 5); // Max 5 images
      setImages(newImages);

      // Generate previews for new images
      const newPreviews = [...imagePreviews];
      imageFiles.slice(0, 5 - imagePreviews.length).forEach((file) => {
        newPreviews.push(URL.createObjectURL(file));
      });
      setImagePreviews(newPreviews);
    },
    [images, imagePreviews],
  );

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
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
  };

  const onSubmit = async (data: AddPetFormValues) => {
    if (images.length === 0) {
      alert('Please add at least one pet image.');
      return;
    }

    setIsSubmitting(true);
    try {
<<<<<<< Updated upstream
      await createPet.mutateAsync(data);
      alert('Pet has been added successfully!');
      navigate('/staff/pets');
    } catch (error: unknown) {
      const err = error as { message?: string };
      alert(err?.message || 'Failed to add pet. Please try again.');
=======
      // In a real app, you'd upload `images` (File objects) to a server/CDN
      // and get back URLs. For this example, we'll use the local preview URLs.
      const payload = { ...data, images: imagePreviews };
      await createPet.mutateAsync(payload);
      navigate('/staff/pets');
    } catch (error: unknown) {
      console.error('Failed to add pet:', error);
>>>>>>> Stashed changes
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Pet</h1>
              <p className="text-sm text-gray-500">Create a new pet listing for your store</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-blue-600 shadow-md hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Adding Pet...' : 'Add Pet'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
<<<<<<< Updated upstream
            {/* Pet Information */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                  Pet Information
                </CardTitle>
                <CardDescription>
                  Enter the basic details about your pet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Max" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Breed *</FormLabel>
                        <FormControl>
                          <Input placeholder="Breed ID or name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color *</FormLabel>
                        <FormControl>
                          <Input placeholder="Color ID or name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender *</FormLabel>
                        <FormControl>
                          <select {...field} className="w-full border rounded h-10 px-2">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2 months" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size *</FormLabel>
                        <FormControl>
                          <select {...field} className="w-full border rounded h-10 px-2">
                            <option value="Small">Small</option>
                            <option value="Medium">Medium</option>
                            <option value="Large">Large</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price *</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} />
                        </FormControl>
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Pet Images */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon className="h-5 w-5 text-green-600" />
                  Pet Images
                </CardTitle>
                <CardDescription>
                  Add high-quality images. The first image will be the main pet image.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URLs *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter image URLs, one per line" value={field.value.join('\n')} onChange={e => field.onChange(e.target.value.split('\n').filter(Boolean))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Image Previews */}
                {form.watch('images').length > 0 && (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                    {form.watch('images').map((url, index) => (
                      <div key={index} className="group relative">
                        <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100">
                          {url ? (
                            <img
                              src={url}
                              alt={`Pet ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pet Specifications */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5 text-purple-600" />
                  Pet Specifications
                </CardTitle>
                <CardDescription>
                  Add health, availability, and other details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <FormField
                    control={form.control}
                    name="isVaccinated"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Vaccinated</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isDewormed"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Dewormed</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hasCert"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Certificate</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hasMicrochip"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Microchip</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Available</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Hanoi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publishedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Published Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Info</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any extra info..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
=======
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left Column */}
              <div className="space-y-6 lg:col-span-2">
                {/* Pet Information */}
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="h-5 w-5 text-blue-600" />
                      Pet Information
                    </CardTitle>
                    <CardDescription>
                      Enter the basic details about your pet
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pet Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Max, Bella" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="breed"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Breed *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select breed" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {breeds.map((breed) => (
                                  <SelectItem
                                    key={breed._id}
                                    value={breed._id}
                                  >
                                    {breed.name}
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
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select color" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {colors.map((color) => (
                                  <SelectItem
                                    key={color._id}
                                    value={color._id}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <div
                                        className="h-4 w-4 rounded-full border"
                                        style={{
                                          backgroundColor: color.hexCode,
                                        }}
                                      />
                                      <span>{color.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 2 months, 1 year"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Size *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Small">Small</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Large">Large</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (VND) *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Ho Chi Minh City"
                                {...field}
                              />
                            </FormControl>
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
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the pet's personality, special features..."
                              className="min-h-[100px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Pet Images */}
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ImageIcon className="h-5 w-5 text-green-600" />
                      Pet Images
                    </CardTitle>
                    <CardDescription>
                      Add up to 5 high-quality images. The first image will be
                      the main pet image.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                            PNG, JPG, GIF (max 5 images)
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
                              <img
                                src={preview}
                                alt={`Pet preview ${index + 1}`}
                                className="h-full w-full object-cover"
                                onLoad={() => URL.revokeObjectURL(preview)}
                              />
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
                              <div className="absolute bottom-2 left-2 rounded-full bg-blue-600 px-2 py-1 text-xs text-white">
                                Main
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {images.length === 0 && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          At least one pet image is required.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
              {/* Right Column */}
              <div className="space-y-6">
                {/* Pet Health & Specifications */}
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Info className="h-5 w-5 text-purple-600" />
                      Health & Specifications
                    </CardTitle>
                    <CardDescription>
                      Add health records and availability status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., DOG-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="publishedDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Published Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="isVaccinated"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Vaccinated</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isDewormed"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Dewormed</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasCert"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Certificate</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasMicrochip"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Microchip</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="isAvailable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Available for Sale</FormLabel>
                            <FormDescription>
                              Check if this pet is currently available for
                              purchase
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any additional notes about the pet..."
                              className="min-h-[80px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
>>>>>>> Stashed changes
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddPet; 