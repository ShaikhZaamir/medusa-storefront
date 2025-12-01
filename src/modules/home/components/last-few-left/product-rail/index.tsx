import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <section className="mx-auto px-2 md:px-4 lg:px-6 pb-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[22px] md:text-[26px] font-semibold text-[#1A1A1A] tracking-tight">
          {collection.title}
        </h2>

        <div className="group flex items-center gap-1 text-[14px] font-medium text-[#1A1A1A]">
          <InteractiveLink href={`/collections/${collection.handle}`}>
            <span className="transition group-hover:opacity-60">View all</span>
          </InteractiveLink>
        </div>

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
        {pricedProducts.map((product) => (
          <ProductPreview key={product.id} product={product} region={region} isFeatured />
        ))}
      </div>

    </section>
  )
}


