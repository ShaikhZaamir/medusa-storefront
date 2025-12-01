import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 bg-white border-b border-[#F2F2F2]">
      <header className="h-16 flex items-center">
        <nav className="content-container w-full flex items-center justify-between">

          {/* LEFT — BRAND NAME */}
          <div className="flex items-center flex-1">
            <LocalizedClientLink
              href="/"
              className="font-semibold tracking-wide text-[18px] hover:opacity-80 transition uppercase"
            >
              RUNWAYY CLOTHING
            </LocalizedClientLink>
          </div>

          {/* CENTER — NAV LINKS */}
          <div className="hidden md:flex items-center gap-10 text-[14px] text-[#1A1A1A]">
            <LocalizedClientLink href="/store" className="hover:text-black transition">
              Store
            </LocalizedClientLink>

            <LocalizedClientLink href="/contact" className="hover:text-black transition">
              Contact
            </LocalizedClientLink>

            <LocalizedClientLink href="/about" className="hover:text-black transition">
              About
            </LocalizedClientLink>
          </div>

          {/* RIGHT — ACCOUNT + CART */}
          <div className="flex items-center gap-6 flex-1 justify-end">

            {/* ACCOUNT */}
            <LocalizedClientLink
              className="hidden md:block hover:text-black transition text-[14px]"
              href="/account"
            >
              Account
            </LocalizedClientLink>

            {/* CART BUTTON (Suspense) */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-black flex gap-1 text-[14px]"
                  href="/cart"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>

            {/* MOBILE MENU */}
            <div className="md:hidden">
              <SideMenu regions={regions} />
            </div>
          </div>

        </nav>
      </header>
    </div>
  )
}



// import { Suspense } from "react"

// import { listRegions } from "@lib/data/regions"
// import { StoreRegion } from "@medusajs/types"
// import LocalizedClientLink from "@modules/common/components/localized-client-link"
// import CartButton from "@modules/layout/components/cart-button"
// import SideMenu from "@modules/layout/components/side-menu"

// export default async function Nav() {
//   const regions = await listRegions().then((regions: StoreRegion[]) => regions)

//   return (
//     <div className="sticky top-0 inset-x-0 z-50 group">
//       <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
//         <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
//           <div className="flex-1 basis-0 h-full flex items-center">
//             <div className="h-full">
//               <SideMenu regions={regions} />
//             </div>
//           </div>

//           <div className="flex items-center h-full">
//             <LocalizedClientLink
//               href="/"
//               className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
//               data-testid="nav-store-link"
//             >
//               Medusa Store
//             </LocalizedClientLink>
//           </div>

//           <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
//             <div className="hidden small:flex items-center gap-x-6 h-full">
//               <LocalizedClientLink
//                 className="hover:text-ui-fg-base"
//                 href="/account"
//                 data-testid="nav-account-link"
//               >
//                 Account
//               </LocalizedClientLink>
//             </div>
//             <Suspense
//               fallback={
//                 <LocalizedClientLink
//                   className="hover:text-ui-fg-base flex gap-2"
//                   href="/cart"
//                   data-testid="nav-cart-link"
//                 >
//                   Cart (0)
//                 </LocalizedClientLink>
//               }
//             >
//               <CartButton />
//             </Suspense>
//           </div>
//         </nav>
//       </header>
//     </div>
//   )
// }
