import { cva, VariantProps } from "class-variance-authority"
import { cn } from "lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full font-medium text-[11px] px-2.5 py-[3px] uppercase tracking-wide select-none",
    {
        variants: {
            variant: {
                default: "bg-[#1A1A1A] text-white",          // Charcoal (Brand)
                accent: "bg-[#FF4D4D] text-white",           // Accent Red
                outline: "border border-[#1A1A1A] text-[#1A1A1A] bg-transparent", // Clean outline
                muted: "bg-[#EDEDED] text-[#333]",           // Soft grey
            },
            size: {
                default: "",
                sm: "text-[10px] px-2 py-[2px]",
                lg: "text-[12px] px-3 py-[4px]",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> { }

export function Badge({ className, variant, size, ...props }: BadgeProps) {
    return (
        <span
            {...props}
            className={cn(badgeVariants({ variant, size }), className)}
        />
    )
}
