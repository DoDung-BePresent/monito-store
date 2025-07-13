import EntityCard from '@/components/shared/EntityCard';
import { Gift } from 'lucide-react';
import type { Product } from '@/types/product';
import { formatPrice } from '@/utils/formatter';

const ProductCard = ({ product }: { product: Product }) => {
  // Business logic trực tiếp trong component
  const subtitle = (
    <div className="flex items-center gap-2 text-gray-600">
      <span>
        Product: <strong>{product.category.name}</strong>
      </span>
      {product.specifications.size && (
        <>
          <span>•</span>
          <span>
            Size: <strong>{product.specifications.size}</strong>
          </span>
        </>
      )}
    </div>
  );

  const price = `${formatPrice(product.price)} VND`;

  const giftContent =
    product.gifts && product.gifts.length > 0 ? (
      <div className="mt-auto flex items-center gap-2 rounded-md bg-[#FFF1E4] p-2 text-xs font-bold text-[#003459]">
        <Gift className="size-4 text-red-500" />
        <span>{product.gifts.join(' & ')}</span>
      </div>
    ) : null;

  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
      <EntityCard
        href={`/products/${product._id}`}
        image={product.images[0] || ''}
        imageAlt={product.name}
        title={product.name}
        subtitle={subtitle}
        price={price}
        extraContent={giftContent}
      />
    </div>
  );

};

ProductCard.Skeleton = EntityCard.Skeleton;

export default ProductCard;
