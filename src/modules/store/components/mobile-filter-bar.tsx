"use client"

export default function MobileFilterBar() {
    return (
        <div
            className="
        flex md:hidden justify-between items-center 
        border-t border-b border-gray-200 
        py-3 mb-5 bg-white sticky top-14 z-30
      "
        >
            <button
                className="w-1/2 text-center font-medium text-[15px]"
                onClick={() => document.dispatchEvent(new CustomEvent("toggleFilters"))}
            >
                Filters
            </button>

            <button
                className="w-1/2 text-center font-medium text-[15px]"
                onClick={() => document.dispatchEvent(new CustomEvent("toggleSort"))}
            >
                Sort
            </button>
        </div>
    )
}
