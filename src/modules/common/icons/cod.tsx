import React from "react"

const CODIcon = () => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* Note rectangle */}
            <rect x="3" y="6" width="18" height="10" rx="2" />

            {/* Realistic cash details */}
            <circle cx="12" cy="11" r="2.2" />
            <path d="M3 9c2 0 2 4 4 4 2 0 2-4 4-4s2 4 4 4 2-4 4-4 2 4 4 4" strokeWidth="1" />
        </svg>
    )
}

export default CODIcon
