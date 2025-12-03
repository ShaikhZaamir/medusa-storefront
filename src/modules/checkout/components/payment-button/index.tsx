"use client"

import { isManual, isStripeLike } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState } from "react"
import ErrorMessage from "../error-message"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

/* --------------------------------------------------
   Load Razorpay Script
----------------------------------------------------*/
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      return resolve(true)
    }

    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  // ⭐ Detect COD
  const isCOD = paymentSession?.provider_id === "pp_system_default"

  // ⭐ Did user pay the shipping already?
  const shippingPaid =
    cart?.metadata?.shipping_paid === true ||
    cart?.metadata?.shipping_paid === "true"

  if (isCOD) {
    return (
      <CODPaymentButton
        cart={cart}
        notReady={notReady}
        shippingPaid={shippingPaid}
        data-testid={dataTestId}
      />
    )
  }

  if (isStripeLike(paymentSession?.provider_id)) {
    return (
      <StripePaymentButton
        notReady={notReady}
        cart={cart}
        data-testid={dataTestId}
      />
    )
  }

  if (isManual(paymentSession?.provider_id)) {
    return (
      <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
    )
  }

  return <Button disabled>Select a payment method</Button>
}

/* --------------------------------------------------
   COD BUTTON (FINAL VERSION)
----------------------------------------------------*/
const CODPaymentButton = ({
  cart,
  notReady,
  shippingPaid,
  "data-testid": dataTestId,
}: {
  cart: any
  notReady: boolean
  shippingPaid: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handlePlaceOrder = async () => {
    setErrorMessage(null)

    if (submitting) return
    setSubmitting(true)

    try {
      // If shipping already paid → directly place order
      if (shippingPaid) {
        await placeOrder()
        return
      }

      /* --------------------------------------------------
         STEP 1 — Load Razorpay Script
      ----------------------------------------------------*/
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        throw new Error("Failed to load Razorpay script.")
      }

      /* --------------------------------------------------
         STEP 2 — Create Razorpay Order for Shipping Fee
      ----------------------------------------------------*/
      const createOrderRes = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/razorpay-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
          },
          body: JSON.stringify({
            amount: cart.shipping_total * 100, // convert rupees → paise
            currency: "INR",
            cart_id: cart.id,
          }),
        }
      )

      const orderData = await createOrderRes.json()

      if (!orderData || !orderData.order_id) {
        throw new Error("Invalid Razorpay backend response.")
      }

      /* --------------------------------------------------
         STEP 3 — Razorpay Checkout Options
      ----------------------------------------------------*/
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.order_id,
        name: "Runwayy Store",
        description: "Shipping Fee Payment",

        handler: async function (response: any) {
          try {
            /* --------------------------------------------------
               STEP 4 — Verify Payment on Backend
            ----------------------------------------------------*/
            const verifyRes = await fetch(
              `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/partial-cod`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-publishable-api-key":
                    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
                },
                body: JSON.stringify({
                  cart_id: cart.id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  paid_amount: orderData.amount,
                }),
              }
            )

            const verifyData = await verifyRes.json()

            if (!verifyData.signature_valid || !verifyData.amount_matches) {
              throw new Error("Shipping payment verification failed.")
            }

            /* --------------------------------------------------
               STEP 5 — Place the Actual COD Order
            ----------------------------------------------------*/
            await placeOrder()
          } catch (err: any) {
            setErrorMessage(err.message || "Verification failed.")
          }
        },

        prefill: {
          name:
            cart?.billing_address?.first_name +
            " " +
            cart?.billing_address?.last_name,
          email: cart?.email,
          contact: cart?.billing_address?.phone,
        },

        theme: { color: "#000000" },
      }

      /* --------------------------------------------------
         STEP 6 — Open Razorpay Checkout
      ----------------------------------------------------*/
      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (err: any) {
      setErrorMessage(err.message || "Payment failed.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePlaceOrder}
        size="large"
        className="w-full"
        data-testid={dataTestId}
      >
        Pay Shipping & Place Order
      </Button>

      <ErrorMessage error={errorMessage} />
    </>
  )
}

/* --------------------------------------------------
   STRIPE PAYMENT FLOW (unchanged)
----------------------------------------------------*/
const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

/* --------------------------------------------------
   MANUAL TEST (unchanged)
----------------------------------------------------*/
const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)
    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid="submit-order-button"
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton




// "use client"

// import { isManual, isStripeLike } from "@lib/constants"
// import { placeOrder } from "@lib/data/cart"
// import { HttpTypes } from "@medusajs/types"
// import { Button } from "@medusajs/ui"
// import { useElements, useStripe } from "@stripe/react-stripe-js"
// import React, { useState } from "react"
// import ErrorMessage from "../error-message"

// type PaymentButtonProps = {
//   cart: HttpTypes.StoreCart
//   "data-testid": string
// }

// const PaymentButton: React.FC<PaymentButtonProps> = ({
//   cart,
//   "data-testid": dataTestId,
// }) => {
//   const notReady =
//     !cart ||
//     !cart.shipping_address ||
//     !cart.billing_address ||
//     !cart.email ||
//     (cart.shipping_methods?.length ?? 0) < 1

//   const paymentSession = cart.payment_collection?.payment_sessions?.[0]

//   switch (true) {
//     case isStripeLike(paymentSession?.provider_id):
//       return (
//         <StripePaymentButton
//           notReady={notReady}
//           cart={cart}
//           data-testid={dataTestId}
//         />
//       )
//     case isManual(paymentSession?.provider_id):
//       return (
//         <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
//       )
//     default:
//       return <Button disabled>Select a payment method</Button>
//   }
// }

// const StripePaymentButton = ({
//   cart,
//   notReady,
//   "data-testid": dataTestId,
// }: {
//   cart: HttpTypes.StoreCart
//   notReady: boolean
//   "data-testid"?: string
// }) => {
//   const [submitting, setSubmitting] = useState(false)
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)

//   const onPaymentCompleted = async () => {
//     await placeOrder()
//       .catch((err) => {
//         setErrorMessage(err.message)
//       })
//       .finally(() => {
//         setSubmitting(false)
//       })
//   }

//   const stripe = useStripe()
//   const elements = useElements()
//   const card = elements?.getElement("card")

//   const session = cart.payment_collection?.payment_sessions?.find(
//     (s) => s.status === "pending"
//   )

//   const disabled = !stripe || !elements ? true : false

//   const handlePayment = async () => {
//     setSubmitting(true)

//     if (!stripe || !elements || !card || !cart) {
//       setSubmitting(false)
//       return
//     }

//     await stripe
//       .confirmCardPayment(session?.data.client_secret as string, {
//         payment_method: {
//           card: card,
//           billing_details: {
//             name:
//               cart.billing_address?.first_name +
//               " " +
//               cart.billing_address?.last_name,
//             address: {
//               city: cart.billing_address?.city ?? undefined,
//               country: cart.billing_address?.country_code ?? undefined,
//               line1: cart.billing_address?.address_1 ?? undefined,
//               line2: cart.billing_address?.address_2 ?? undefined,
//               postal_code: cart.billing_address?.postal_code ?? undefined,
//               state: cart.billing_address?.province ?? undefined,
//             },
//             email: cart.email,
//             phone: cart.billing_address?.phone ?? undefined,
//           },
//         },
//       })
//       .then(({ error, paymentIntent }) => {
//         if (error) {
//           const pi = error.payment_intent

//           if (
//             (pi && pi.status === "requires_capture") ||
//             (pi && pi.status === "succeeded")
//           ) {
//             onPaymentCompleted()
//           }

//           setErrorMessage(error.message || null)
//           return
//         }

//         if (
//           (paymentIntent && paymentIntent.status === "requires_capture") ||
//           paymentIntent.status === "succeeded"
//         ) {
//           return onPaymentCompleted()
//         }

//         return
//       })
//   }

//   return (
//     <>
//       <Button
//         disabled={disabled || notReady}
//         onClick={handlePayment}
//         size="large"
//         isLoading={submitting}
//         data-testid={dataTestId}
//       >
//         Place order
//       </Button>
//       <ErrorMessage
//         error={errorMessage}
//         data-testid="stripe-payment-error-message"
//       />
//     </>
//   )
// }

// const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
//   const [submitting, setSubmitting] = useState(false)
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)

//   const onPaymentCompleted = async () => {
//     await placeOrder()
//       .catch((err) => {
//         setErrorMessage(err.message)
//       })
//       .finally(() => {
//         setSubmitting(false)
//       })
//   }

//   const handlePayment = () => {
//     setSubmitting(true)

//     onPaymentCompleted()
//   }

//   return (
//     <>
//       <Button
//         disabled={notReady}
//         isLoading={submitting}
//         onClick={handlePayment}
//         size="large"
//         data-testid="submit-order-button"
//       >
//         Place order
//       </Button>
//       <ErrorMessage
//         error={errorMessage}
//         data-testid="manual-payment-error-message"
//       />
//     </>
//   )
// }

// export default PaymentButton
