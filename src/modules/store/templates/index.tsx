import { Suspense } from "react"

import MobileFilterSheet from "@modules/store/components/mobile-filter-sheet"
import MobileFilterBar from "@modules/store/components/mobile-filter-bar"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <section className="w-full">

      {/* Mobile Sticky Filters */}
      <div className="md:hidden sticky top-[64px] z-40 bg-white">
        <MobileFilterBar />
      </div>

      <div className="md:px-6 md:pt-10 pb-10 flex flex-col md:flex-row gap-10" data-testid="category-container">

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-[260px] sticky top-24 flex-shrink-0">
          <RefinementList sortBy={sort} />
        </aside>

        {/* Main Section */}
        <div className="w-full flex-1">

          {/* Page Title */}
          <header className="px-2 md:mt-0 mb-5 md:mb-8">
            <h1 className="text-[22px] md:text-[30px] font-semibold tracking-tight text-[#1A1A1A]">
              All Products
            </h1>
            <div className="h-[3px] w-14 bg-[#1A1A1A] rounded-full mt-2 opacity-10 md:opacity-20" />
          </header>

          {/* Product Grid */}
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts sortBy={sort} page={pageNumber} countryCode={countryCode} />
          </Suspense>

        </div>
      </div>

      <MobileFilterSheet />
    </section>
  )
}

export default StoreTemplate




// import { Suspense } from "react"

// import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
// import RefinementList from "@modules/store/components/refinement-list"
// import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

// import PaginatedProducts from "./paginated-products"

// const StoreTemplate = ({
//   sortBy,
//   page,
//   countryCode,
// }: {
//   sortBy?: SortOptions
//   page?: string
//   countryCode: string
// }) => {
//   const pageNumber = page ? parseInt(page) : 1
//   const sort = sortBy || "created_at"

//   return (
//     <div
//       className="flex flex-col small:flex-row small:items-start py-6 content-container"
//       data-testid="category-container"
//     >
//       <RefinementList sortBy={sort} />
//       <div className="w-full">
//         <div className="mb-8 text-2xl-semi">
//           <h1 data-testid="store-page-title">All products</h1>
//         </div>
//         <Suspense fallback={<SkeletonProductGrid />}>
//           <PaginatedProducts
//             sortBy={sort}
//             page={pageNumber}
//             countryCode={countryCode}
//           />
//         </Suspense>
//       </div>
//     </div>
//   )
// }

// export default StoreTemplate
