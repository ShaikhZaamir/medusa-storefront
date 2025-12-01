import { clx } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  const isSale = selectedPrice.price_type === "sale"

  return (
    <div className="flex flex-col gap-1">

      {/* MAIN PRICE */}
      <span
        className={clx(
          "text-xl font-semibold tracking-tight",
          isSale && "text-black"
        )}
      >
        {!variant && "From "}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
      </span>

      {/* ORIGINAL PRICE + DISCOUNT */}
      {isSale && (
        <div className="flex items-center gap-2">

          {/* Original price */}
          <span
            className="text-sm text-gray-500 line-through"
            data-testid="original-product-price"
            data-value={selectedPrice.original_price_number}
          >
            {selectedPrice.original_price}
          </span>

          {/* Discount badge */}
          <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
            -{selectedPrice.percentage_diff}%
          </span>

        </div>
      )}
    </div>
  )
}



// import { clx } from "@medusajs/ui"

// import { getProductPrice } from "@lib/util/get-product-price"
// import { HttpTypes } from "@medusajs/types"

// export default function ProductPrice({
//   product,
//   variant,
// }: {
//   product: HttpTypes.StoreProduct
//   variant?: HttpTypes.StoreProductVariant
// }) {
//   const { cheapestPrice, variantPrice } = getProductPrice({
//     product,
//     variantId: variant?.id,
//   })

//   const selectedPrice = variant ? variantPrice : cheapestPrice

//   if (!selectedPrice) {
//     return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
//   }

//   return (
//     <div className="flex flex-col text-ui-fg-base">
//       <span
//         className={clx("text-xl-semi", {
//           "text-ui-fg-interactive": selectedPrice.price_type === "sale",
//         })}
//       >
//         {!variant && "From "}
//         <span
//           data-testid="product-price"
//           data-value={selectedPrice.calculated_price_number}
//         >
//           {selectedPrice.calculated_price}
//         </span>
//       </span>
//       {selectedPrice.price_type === "sale" && (
//         <>
//           <p>
//             <span className="text-ui-fg-subtle">Original: </span>
//             <span
//               className="line-through"
//               data-testid="original-product-price"
//               data-value={selectedPrice.original_price_number}
//             >
//               {selectedPrice.original_price}
//             </span>
//           </p>
//           <span className="text-ui-fg-interactive">
//             -{selectedPrice.percentage_diff}%
//           </span>
//         </>
//       )}
//     </div>
//   )
// }
