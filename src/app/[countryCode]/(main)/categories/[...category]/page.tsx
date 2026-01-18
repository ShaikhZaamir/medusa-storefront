export const dynamic = "force-dynamic"

import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle } from "@lib/data/categories"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

/**
 * Metadata is generated at runtime
 * Safe for dynamic rendering
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params

  try {
    const productCategory = await getCategoryByHandle(params.category)

    if (!productCategory) {
      return {}
    }

    const title = `${productCategory.name} | Medusa Store`
    const description =
      productCategory.description ?? `${productCategory.name} category`

    return {
      title,
      description,
      alternates: {
        canonical: `/${params.countryCode}/categories/${params.category.join(
          "/"
        )}`,
      },
    }
  } catch {
    return {}
  }
}

export default async function CategoryPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams

  const { sortBy, page } = searchParams

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  return (
    <CategoryTemplate
      category={productCategory}
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
