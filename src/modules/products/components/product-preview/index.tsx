import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"
import { Badge } from "components/ui/badge"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({ product })

  const badge = product.tags?.[0]?.value?.toUpperCase() ?? null

  const description =
    product.subtitle || product.description || "Explore premium men's styles."

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="block group"
    >
      <div className="
        border border-[#ffffff] rounded-xl bg-white overflow-hidden 
        hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] 
        transition-all duration-300 h-full flex flex-col relative cursor-pointer
        sm:rounded-xl
      ">
        <div className="relative overflow-hidden">
          <div className="transition-transform duration-300 group-hover:scale-105">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
              isFeatured={isFeatured}
            />
          </div>

          {badge && (
            <Badge
              size="sm"
              className="absolute top-0 left-0 bg-[#1A1A1A] text-white 
                         rounded-none rounded-br-md shadow-sm tracking-wide"
            >
              {badge}
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="
          px-1 py-2 sm:p-4 flex flex-col flex-grow
          space-y-1 sm:space-y-1.5
        ">

          {/* Title */}
          <h3 className="
            font-medium text-[14.5px] sm:text-[15px] 
            text-[#1A1A1A] leading-snug line-clamp-2 
            group-hover:opacity-70 transition
          ">
            {product.title}
          </h3>

          {/* Description */}
          <p className="
            text-[13px] sm:text-[13px] text-[#666] 
            line-clamp-1 leading-tight mb-1
          ">
            {description}
          </p>

          {/* Divider */}
          {/* <div className="h-[1px] bg-[#f5f5f5] my-2 sm:my-1"></div> */}

          {/* Price Row */}
          <div className="
            flex items-center gap-2 
            mt-auto 
            pt-1 sm:pt-1
          ">

            {/* MRP */}
            {cheapestPrice?.price_type === "sale" && (
              <span className="line-through text-gray-400 text-[15px] sm:text-[15px]">
                {cheapestPrice.original_price}
              </span>
            )}

            {/* Final Price */}
            <span className="
              text-[18px] sm:text-[19px] 
              font-semibold text-[#111]
            ">
              {cheapestPrice?.calculated_price || cheapestPrice?.original_price}
            </span>

            {/* Discount */}
            {cheapestPrice?.price_type === "sale" && (
              <span className="text-green-600 text-[14px] font-medium">
                -{cheapestPrice.percentage_diff}%
              </span>
            )}
          </div>
        </div>

      </div>
    </LocalizedClientLink>
  )
}
