export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionByHandle } from "@lib/data/collections"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { StoreCollection } from "@medusajs/types"

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
  }>
}

export const PRODUCT_LIMIT = 12

/**
 * Runtime metadata (safe for dynamic pages)
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params

  try {
    const collection = await getCollectionByHandle(params.handle)

    if (!collection) {
      return {}
    }

    return {
      title: `${collection.title} | Medusa Store`,
      description: `${collection.title} collection`,
      alternates: {
        canonical: `/${params.countryCode}/collections/${params.handle}`,
      },
    }
  } catch {
    return {}
  }
}

export default async function CollectionPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams

  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  return (
    <CollectionTemplate
      collection={collection as StoreCollection}
      page={page}
      sortBy={sortBy}
      countryCode={params.countryCode}
    />
  )
}
