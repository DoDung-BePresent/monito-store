import { useParams } from 'react-router-dom';
import { useProduct } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import ProductBreadcrumb from './components/detail/ProductBreadcrumb';
import ProductInfo from './components/detail/ProductInfo';
import ProductSpecifications from './components/detail/ProductSpecifications';
import ImageGallery from '@/components/ImageGallery';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(id!);

  if (isLoading) return <ProductDetailSkeleton />;

  if (error || !product) {
    return (
      <div className="container mx-auto py-12">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Could not find the product. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto">
        <ProductBreadcrumb product={product} />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Column */}
          <div>
            <ImageGallery images={product.images} name={product.name} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ProductInfo product={product} />
            <ProductSpecifications product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetailSkeleton = () => (
  <div className="container mx-auto py-8">
    <Skeleton className="mb-6 h-5 w-1/3" />
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-12 w-full" />
        <div className="space-y-3 border-t pt-6">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetailPage;
