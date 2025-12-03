"use client"

import { Heading, Text, clx } from "@medusajs/ui"
import PaymentButton from "../payment-button"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useEffect, useCallback } from "react"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  // Debug logs
  console.log("=== REVIEW DEBUG ===")
  console.log("cart.id:", cart?.id)
  console.log("payment_sessions:", cart.payment_collection?.payment_sessions)
  console.log(
    "provider_id:",
    cart.payment_collection?.payment_sessions?.[0]?.provider_id
  )
  console.log("shipping_paid:", cart?.metadata?.shipping_paid)
  console.log("shipping_paid_amount:", cart?.metadata?.shipping_paid_amount)
  console.log("=======================")

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  // Helper checks
  const provider =
    cart?.payment_collection?.payment_sessions?.[0]?.provider_id
  const isCOD = provider === "pp_system_default"
  const shippingPaid =
    cart?.metadata?.shipping_paid === true ||
    cart?.metadata?.shipping_paid === "true"

  const shippingPaidAmount = cart?.metadata?.shipping_paid_amount || 0
  const totalAmount = cart?.total || 0
  const codDueAmount = totalAmount - shippingPaidAmount

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx("flex flex-row text-3xl-regular gap-x-2 items-baseline", {
            "opacity-50 pointer-events-none select-none": !isOpen,
          })}
        >
          Review
        </Heading>
      </div>

      {isOpen && previousStepsCompleted && (
        <>
          {/* ---------------------------------------------- */}
          {/* COD Information BEFORE payment (shipping unpaid) */}
          {/* ---------------------------------------------- */}
          {isCOD && !shippingPaid && (
            <div className="mb-6 p-4 border border-yellow-300 rounded-lg bg-yellow-50">
              <Text className="txt-medium-plus text-ui-fg-base mb-2">
                Cash on Delivery (COD)
              </Text>

              <div className="flex justify-between py-1">
                <Text className="txt-medium text-ui-fg-subtle">
                  Shipping fee (pay now):
                </Text>
                <Text className="txt-medium text-ui-fg-base font-semibold">
                  ₹{(cart.shipping_total).toFixed(2)}
                </Text>
              </div>

              <div className="flex justify-between py-1">
                <Text className="txt-medium text-ui-fg-subtle">
                  Amount due on delivery:
                </Text>
                <Text className="txt-medium text-ui-fg-base">
                  ₹{((cart.total - cart.shipping_total)).toFixed(2)}
                </Text>
              </div>

              <Text className="mt-2 txt-small text-ui-fg-subtle">
                You will pay only the shipping fee now to confirm your COD order.
                The remaining amount will be collected in cash upon delivery.
              </Text>
            </div>
          )}


          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  )
}

export default Review







// "use client"

// import { Heading, Text, clx } from "@medusajs/ui"

// import PaymentButton from "../payment-button"
// import { useSearchParams } from "next/navigation"

// const Review = ({ cart }: { cart: any }) => {
//   const searchParams = useSearchParams()

//   const isOpen = searchParams.get("step") === "review"

//   const paidByGiftcard =
//     cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

//   const previousStepsCompleted =
//     cart.shipping_address &&
//     cart.shipping_methods.length > 0 &&
//     (cart.payment_collection || paidByGiftcard)

//   return (
//     <div className="bg-white">
//       <div className="flex flex-row items-center justify-between mb-6">
//         <Heading
//           level="h2"
//           className={clx(
//             "flex flex-row text-3xl-regular gap-x-2 items-baseline",
//             {
//               "opacity-50 pointer-events-none select-none": !isOpen,
//             }
//           )}
//         >
//           Review
//         </Heading>
//       </div>
//       {isOpen && previousStepsCompleted && (
//         <>
//           <div className="flex items-start gap-x-1 w-full mb-6">
//             <div className="w-full">
//               <Text className="txt-medium-plus text-ui-fg-base mb-1">
//                 By clicking the Place Order button, you confirm that you have
//                 read, understand and accept our Terms of Use, Terms of Sale and
//                 Returns Policy and acknowledge that you have read Medusa
//                 Store&apos;s Privacy Policy.
//               </Text>
//             </div>
//           </div>
//           <PaymentButton cart={cart} data-testid="submit-order-button" />
//         </>
//       )}
//     </div>
//   )
// }

// export default Review
