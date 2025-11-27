"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export const listRawShippingOptions = async (cartId: string) => {
    const headers = { ...(await getAuthHeaders()) }

    const res = await sdk.client.fetch<HttpTypes.StoreShippingOptionListResponse>(
        "/store/shipping-options",
        {
            method: "GET",
            query: { cart_id: cartId },
            headers,
        }
    )

    return res.shipping_options 
}
