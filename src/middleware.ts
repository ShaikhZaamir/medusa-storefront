import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: 0,
}

/**
 * Fetch and cache region map
 * MUST NEVER throw
 */
async function getRegionMap(cacheId: string) {
  if (!BACKEND_URL || !PUBLISHABLE_API_KEY) {
    console.error("[middleware] Missing env vars")
    return null
  }

  const isCacheEmpty = regionMapCache.regionMap.size === 0
  const isCacheStale =
    regionMapCache.regionMapUpdated < Date.now() - 3600 * 1000

  if (isCacheEmpty || isCacheStale) {
    try {
      const res = await fetch(`${BACKEND_URL}/store/regions`, {
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY,
        },
        cache: "force-cache",
      })

      if (!res.ok) {
        console.error("[middleware] Region fetch failed", res.status)
        return null
      }

      const json = await res.json()
      const regions = json?.regions

      if (!regions?.length) return null

      regionMapCache.regionMap.clear()

      regions.forEach((region: HttpTypes.StoreRegion) => {
        region.countries?.forEach((c) => {
          if (c.iso_2) {
            regionMapCache.regionMap.set(
              c.iso_2.toLowerCase(),
              region
            )
          }
        })
      })

      regionMapCache.regionMapUpdated = Date.now()
    } catch (e) {
      console.error("[middleware] Region fetch crashed", e)
      return null
    }
  }

  return regionMapCache.regionMap
}

/**
 * Resolve country code safely
 */
function resolveCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion>
) {
  const pathCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()
  if (pathCode && regionMap.has(pathCode)) return pathCode

  const vercelCode = request.headers
    .get("x-vercel-ip-country")
    ?.toLowerCase()
  if (vercelCode && regionMap.has(vercelCode)) return vercelCode

  if (regionMap.has(DEFAULT_REGION)) return DEFAULT_REGION

  return regionMap.keys().next().value
}

/**
 * MAIN MIDDLEWARE
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 🔴 HARD SKIPS — MUST BE FIRST
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/server-unavailable" ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  const cacheId =
    request.cookies.get("_medusa_cache_id")?.value ??
    crypto.randomUUID()

  const regionMap = await getRegionMap(cacheId)

  // 🔴 Backend down → fallback page
  if (!regionMap) {
    const url = request.nextUrl.clone()
    url.pathname = "/server-unavailable"
    url.search = ""
    return NextResponse.redirect(url, 307)
  }

  const countryCode = resolveCountryCode(request, regionMap)

  if (!countryCode) {
    return NextResponse.next()
  }

  const hasCountry =
    pathname.split("/")[1]?.toLowerCase() === countryCode

  // Already correct → continue
  if (hasCountry) {
    const res = NextResponse.next()
    if (!request.cookies.has("_medusa_cache_id")) {
      res.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      })
    }
    return res
  }

  // Redirect ONLY when needed
  const url = request.nextUrl.clone()
  url.pathname =
    pathname === "/"
      ? `/${countryCode}`
      : `/${countryCode}${pathname}`

  return NextResponse.redirect(url, 307)
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico).*)",
  ],
}
