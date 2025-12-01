import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // edit this function to define your related products logic
  const queryParams: HttpTypes.StoreProductListParams = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  if (product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[]
  }
  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    )
  })

  if (!products.length) {
    return null
  }

  return (
    <section className="mx-auto px-2 md:px-4 lg:px-6 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[22px] md:text-[26px] font-semibold text-[#1A1A1A] tracking-tight">
          You may also like
        </h2>

        {product.collection && (
          <div className="group flex items-center gap-1 text-[14px] font-medium text-[#1A1A1A]">
            <a href={`/collections/${product.collection.handle}`}>
              <span className="transition group-hover:opacity-60">
                View all
              </span>
            </a>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div
        className="
        grid grid-cols-2 
        gap-x-2 gap-y-7
        md:grid-cols-3 md:gap-x-6 md:gap-y-12
        lg:grid-cols-4
      "
      >
        {products.map((related) => (
          <Product
            key={related.id}
            region={region}
            product={related}
            isFeatured
          />
        ))}
      </div>

    </section>
  )

}
