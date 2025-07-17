import { useParams } from 'react-router-dom';
import { useProduct } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import ProductBreadcrumb from './components/detail/ProductBreadcrumb';
import ProductInfo from './components/detail/ProductInfo';
import ProductSpecifications from './components/detail/ProductSpecifications';
import ProductReviews from './components/detail/ProductReviews';
import ImageGallery from '@/components/ImageGallery';
import { EntityNotFound } from '@/components/shared/EntityNotFound';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: product,
    isLoading,
    error,
  } = useProduct(id!, { customerView: true });

  if (isLoading) return <ProductDetailSkeleton />;

  if (error || !product) {
    return (
      <EntityNotFound
        entityName="Product"
        backToUrl="/products"
        backToUrlText="Back to All Products"
      />
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
        
        {/* Product Reviews Section */}
        <div className="mt-12">
          <ProductReviews productId={product._id} />
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
