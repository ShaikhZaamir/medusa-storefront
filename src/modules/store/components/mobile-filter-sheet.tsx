"use client"

import { useEffect, useState } from "react"
import RefinementList from "./refinement-list"

export default function MobileFilterSheet() {
    const [open, setOpen] = useState(false)

    // Listen for the event from MobileFilterBar
    useEffect(() => {
        const handler = () => setOpen(true)
        document.addEventListener("toggleFilters", handler)
        return () => document.removeEventListener("toggleFilters", handler)
    }, [])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setOpen(false)}
            />

            {/* Bottom Sheet */}
            <div
                className="
          absolute bottom-0 left-0 right-0
          bg-white rounded-t-2xl 
          p-6 
          shadow-xl
          max-h-[80vh]
          overflow-y-auto
          animate-slide-up
        "
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[18px] font-semibold text-[#1A1A1A]">
                        Filters
                    </h2>

                    <button
                        className="text-[14px] text-[#555]"
                        onClick={() => setOpen(false)}
                    >
                        Close
                    </button>
                </div>

                {/* Filters */}
                <RefinementList sortBy="created_at" />

                {/* Apply Button */}
                <button
                    className="
            w-full mt-6 py-3 rounded-md 
            bg-[#1A1A1A] text-white 
            font-medium text-[15px]
            active:scale-[0.98] transition
          "
                    onClick={() => setOpen(false)}
                >
                    Apply Filters
                </button>
            </div>
        </div>
    )
}
