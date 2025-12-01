import Link from "next/link"
import { listCategories } from "@lib/data/categories"
import { Card, CardContent } from "components/ui/card"

export async function CategoryGrid() {
    const categories = await listCategories()

    if (!categories || categories.length === 0) return null

    return (
        <section className="py-12 bg-[#FAFAFA] border-b border-[#F2F2F2]">
            <div className="content-container">

                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-[28px] md:text-[34px] font-semibold text-[#1A1A1A]">
                        Shop by Category
                    </h2>

                    <p className="text-[#666] text-[15px] max-w-xl mx-auto mt-2">
                        Browse through our top categories
                    </p>

                    <div className="h-[3px] w-16 bg-[#FF4D4D] mx-auto rounded-full mt-4"></div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/store?category=${category.handle}`}
                            className="group"
                        >
                            <Card className="overflow-hidden bg-white hover:shadow-md transition-all duration-300 rounded-xl h-40 flex items-center justify-center">
                                <CardContent className="p-0 flex items-center justify-center h-full text-center">

                                    {/* Name Only */}
                                    <h3 className="font-semibold text-[18px] text-[#1A1A1A] group-hover:opacity-70 transition">
                                        {category.name}
                                    </h3>

                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    )
}
