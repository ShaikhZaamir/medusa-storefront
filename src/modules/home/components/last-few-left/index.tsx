import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/last-few-left/product-rail"

export default async function LastFewLeft({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  const selected = collections.filter(
    (c) => c.handle === "last-few-left"
  )

  return selected.map((collection) => (
    <li key={collection.id}>
      <ProductRail collection={collection} region={region} />
    </li>
  ))
}
