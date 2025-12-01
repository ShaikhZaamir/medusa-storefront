import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"

import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>

      {/* ======== MAIN PRODUCT PAGE LAYOUT ======== */}
      <div className="content-container py-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">

          {/* LEFT — IMAGE GALLERY */}
          <div className="w-full">
            <ImageGallery images={images} />
          </div>

          {/* RIGHT — PRODUCT INFO + ACTIONS */}
          <div className="flex flex-col gap-y-8 sticky top-28 h-fit">

            {/* Title, description, collection */}
            <ProductInfo product={product} />

            {/* Add to Cart, variants, price */}
            <Suspense
              fallback={
                <ProductActions
                  disabled={true}
                  product={product}
                  region={region}
                />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>

            {/* Optional CTA for no variants */}
            <ProductOnboardingCta />

            {/* Tabs (Details, Care, Material) */}
            <ProductTabs product={product} />
          </div>
        </div>
      </div>

      {/* ======== RELATED PRODUCTS ======== */}
      <div className="content-container">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>

    </>
  )
}

export default ProductTemplate
