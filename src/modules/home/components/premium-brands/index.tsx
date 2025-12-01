import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/premium-brands/product-rail"

export default async function PremiumBrands({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  const selected = collections.filter(
    (c) => c.handle === "premium-brands"
  )

  return selected.map((collection) => (
    <li key={collection.id}>
      <ProductRail collection={collection} region={region} />
    </li>
  ))
}
