import { NextResponse } from "next/server"

/**
 * POST { state: "Maharashtra" }
 * Returns: { zone: "ZONE_A" }  or 404 / { error: "State not found" }
 *
 * This uses the Supabase REST endpoint (no extra libraries).
 * Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.
 */

export async function POST(req: Request) {
    try {
        const { state } = await req.json()

        if (!state) {
            return NextResponse.json({ error: "State missing" }, { status: 400 })
        }

        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/india_states?select=zone_key&state_name=eq.${encodeURIComponent(
            state
        )}&limit=1`

        const res = await fetch(url, {
            headers: {
                apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
                // important for supabase REST
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""}`,
            },
        })

        if (!res.ok) {
            const txt = await res.text()
            return NextResponse.json({ error: "Supabase error", details: txt }, { status: 502 })
        }

        const data = await res.json()

        if (!data || !data.length) {
            return NextResponse.json({ error: "State not found" }, { status: 404 })
        }

        return NextResponse.json({ zone: data[0].zone_key })
    } catch (err: any) {
        return NextResponse.json({ error: String(err) }, { status: 500 })
    }
}
