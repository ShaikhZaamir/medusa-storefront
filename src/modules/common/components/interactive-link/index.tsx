import { ArrowUpRightMini } from "@medusajs/icons"
import LocalizedClientLink from "../localized-client-link"

type InteractiveLinkProps = {
  href: string
  children: React.ReactNode
  onClick?: () => void
  showIcon?: boolean   // NEW: allows optional arrow
}

const InteractiveLink = ({
  href,
  children,
  onClick,
  showIcon = true,
  ...props
}: InteractiveLinkProps) => {
  return (
    <LocalizedClientLink
      href={href}
      onClick={onClick}
      {...props}
      className="group inline-flex items-center gap-1 text-[16px] font-medium text-[#1A1A1A] hover:text-black transition"
    >
      <span className="relative">
        {children}
        {/* Underline animation */}
        <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-[#1A1A1A] transition-all duration-300 group-hover:w-full"></span>
      </span>

      {showIcon && (
        <ArrowUpRightMini
          className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          color="#1A1A1A"
        />
      )}
    </LocalizedClientLink>
  )
}

export default InteractiveLink
