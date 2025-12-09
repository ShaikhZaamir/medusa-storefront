import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { CategoryGrid } from "@modules/home/components/category-grid"
import PremiumBrands from "@modules/home/components/premium-brands"
import LastFewLeft from "@modules/home/components/last-few-left"

export const metadata: Metadata = {
  title: "Runwayy Clothing | Home",
  description:
    "Discover the latest trends in fashion at Runwayy Clothing. Explore our curated collections and find your perfect style today.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />

      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <PremiumBrands collections={collections} region={region} />
        </ul>
      </div>

      <CategoryGrid />

      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <LastFewLeft collections={collections} region={region} />
        </ul>
      </div>


    </>
  )
}
