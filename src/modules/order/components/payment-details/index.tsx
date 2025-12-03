"use client"

import { Container, Heading, Text } from "@medusajs/ui"
import { isStripeLike, paymentInfoMap } from "@lib/constants"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const paymentSession =
    order.payment_collections?.[0]?.payment_sessions?.[0]

  const payment = order.payment_collections?.[0]?.payments?.[0]

  // ------------------------------------------------------------
  // DETECT COD ORDER
  // ------------------------------------------------------------
  const isCOD = paymentSession?.provider_id === "pp_system_default"

  // From backend metadata
  const shippingPaidAmount = Number(order.metadata?.shipping_paid_amount ?? 0)

  // Subtotal = COD amount due at delivery
  const codDue = order.subtotal ?? 0

  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
        Payment
      </Heading>

      {/* ------------------------------------------------------------
          COD PAYMENT SUMMARY
      ------------------------------------------------------------ */}
      {isCOD ? (
        <div className="flex items-start gap-x-1 w-full">
          {/* LEFT COLUMN */}
          <div className="flex flex-col w-1/3">
            <Text className="txt-medium-plus text-ui-fg-base mb-1">
              Payment method
            </Text>
            <Text
              className="txt-medium text-ui-fg-subtle"
              data-testid="payment-method"
            >
              Cash on Delivery (COD)
            </Text>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col w-2/3">
            <Text className="txt-medium-plus text-ui-fg-base mb-1">
              Payment details
            </Text>

            <div className="flex flex-col gap-y-1 txt-medium text-ui-fg-subtle">
              <Text>
                Shipping paid online:{" "}
                {convertToLocale({
                  amount: shippingPaidAmount,
                  currency_code: order.currency_code,
                })}
              </Text>

              <Text>
                Amount due on delivery:{" "}
                {convertToLocale({
                  amount: codDue,
                  currency_code: order.currency_code,
                })}
              </Text>
            </div>
          </div>
        </div>
      ) : (
        /* ------------------------------------------------------------
           NORMAL PREPAID PAYMENT FLOW
        ------------------------------------------------------------ */
        payment && (
          <div className="flex items-start gap-x-1 w-full">
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method"
              >
                {paymentInfoMap[payment.provider_id].title}
              </Text>
            </div>

            <div className="flex flex-col w-2/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment details
              </Text>

              <div className="flex gap-2 txt-medium text-ui-fg-subtle items-center">
                <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                  {paymentInfoMap[payment.provider_id].icon}
                </Container>

                <Text data-testid="payment-amount">
                  {isStripeLike(payment.provider_id) &&
                    payment.data?.card_last4
                    ? `**** **** **** ${payment.data.card_last4}`
                    : `${convertToLocale({
                      amount: payment.amount,
                      currency_code: order.currency_code,
                    })} paid at ${new Date(
                      payment.created_at ?? ""
                    ).toLocaleString()}`}
                </Text>
              </div>
            </div>
          </div>
        )
      )}

      <Divider className="mt-8" />
    </div>
  )
}

export default PaymentDetails




// import { Container, Heading, Text } from "@medusajs/ui"

// import { isStripeLike, paymentInfoMap } from "@lib/constants"
// import Divider from "@modules/common/components/divider"
// import { convertToLocale } from "@lib/util/money"
// import { HttpTypes } from "@medusajs/types"

// type PaymentDetailsProps = {
//   order: HttpTypes.StoreOrder
// }

// const PaymentDetails = ({ order }: PaymentDetailsProps) => {
//   const payment = order.payment_collections?.[0].payments?.[0]

//   return (
//     <div>
//       <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
//         Payment
//       </Heading>
//       <div>
//         {payment && (
//           <div className="flex items-start gap-x-1 w-full">
//             <div className="flex flex-col w-1/3">
//               <Text className="txt-medium-plus text-ui-fg-base mb-1">
//                 Payment method
//               </Text>
//               <Text
//                 className="txt-medium text-ui-fg-subtle"
//                 data-testid="payment-method"
//               >
//                 {paymentInfoMap[payment.provider_id].title}
//               </Text>
//             </div>
//             <div className="flex flex-col w-2/3">
//               <Text className="txt-medium-plus text-ui-fg-base mb-1">
//                 Payment details
//               </Text>
//               <div className="flex gap-2 txt-medium text-ui-fg-subtle items-center">
//                 <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
//                   {paymentInfoMap[payment.provider_id].icon}
//                 </Container>
//                 <Text data-testid="payment-amount">
//                   {isStripeLike(payment.provider_id) && payment.data?.card_last4
//                     ? `**** **** **** ${payment.data.card_last4}`
//                     : `${convertToLocale({
//                         amount: payment.amount,
//                         currency_code: order.currency_code,
//                       })} paid at ${new Date(
//                         payment.created_at ?? ""
//                       ).toLocaleString()}`}
//                 </Text>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <Divider className="mt-8" />
//     </div>
//   )
// }

// export default PaymentDetails
