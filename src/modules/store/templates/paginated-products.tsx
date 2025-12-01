import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: PaginatedProductsParams = { limit: PRODUCT_LIMIT }

  if (collectionId) queryParams.collection_id = [collectionId]
  if (categoryId) queryParams.category_id = [categoryId]
  if (productsIds) queryParams.id = productsIds
  if (sortBy === "created_at") queryParams.order = "created_at"

  const region = await getRegion(countryCode)
  if (!region) return null

  const {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams: {
      ...queryParams,
      fields: "*variants.calculated_price"
    },
    sortBy,
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <section className="mx-auto px-2 md:px-4 lg:px-6 pb-5">

      {/* Product Grid — EXACT MATCH WITH PRODUCT RAIL */}
      <div
        className="
          grid grid-cols-2 
          gap-x-2 gap-y-5
          md:grid-cols-3 md:gap-x-6 md:gap-y-12
          lg:grid-cols-4
        "
        data-testid="products-list"
      >
        {products.map((p) => (
          <ProductPreview key={p.id} product={p} region={region} isFeatured />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          data-testid="product-pagination"
        />
      )}
    </section>
  )
}





// import { listProductsWithSort } from "@lib/data/products"
// import { getRegion } from "@lib/data/regions"
// import ProductPreview from "@modules/products/components/product-preview"
// import { Pagination } from "@modules/store/components/pagination"
// import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

// const PRODUCT_LIMIT = 12

// type PaginatedProductsParams = {
//   limit: number
//   collection_id?: string[]
//   category_id?: string[]
//   id?: string[]
//   order?: string
// }

// export default async function PaginatedProducts({
//   sortBy,
//   page,
//   collectionId,
//   categoryId,
//   productsIds,
//   countryCode,
// }: {
//   sortBy?: SortOptions
//   page: number
//   collectionId?: string
//   categoryId?: string
//   productsIds?: string[]
//   countryCode: string
// }) {
//   const queryParams: PaginatedProductsParams = {
//     limit: 12,
//   }

//   if (collectionId) {
//     queryParams["collection_id"] = [collectionId]
//   }

//   if (categoryId) {
//     queryParams["category_id"] = [categoryId]
//   }

//   if (productsIds) {
//     queryParams["id"] = productsIds
//   }

//   if (sortBy === "created_at") {
//     queryParams["order"] = "created_at"
//   }

//   const region = await getRegion(countryCode)

//   if (!region) {
//     return null
//   }

//   let {
//     response: { products, count },
//   } = await listProductsWithSort({
//     page,
//     queryParams,
//     sortBy,
//     countryCode,
//   })

//   const totalPages = Math.ceil(count / PRODUCT_LIMIT)

//   return (
//     <>
//       <ul
//         className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
//         data-testid="products-list"
//       >
//         {products.map((p) => {
//           return (
//             <li key={p.id}>
//               <ProductPreview product={p} region={region} />
//             </li>
//           )
//         })}
//       </ul>
//       {totalPages > 1 && (
//         <Pagination
//           data-testid="product-pagination"
//           page={page}
//           totalPages={totalPages}
//         />
//       )}
//     </>
//   )
// }
