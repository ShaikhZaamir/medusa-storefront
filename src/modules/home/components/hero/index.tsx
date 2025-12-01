import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section
      className="
        w-full 
        py-24 
        bg-[radial-gradient(circle_at_top,rgba(26,26,26,0.15),rgba(255,255,255,1))]
        border-b border-[#F2F2F2]
      "
    >
      <div className="content-container mx-auto text-center max-w-2xl">

        <h1 className="text-[26px] md:text-[34px] font-semibold text-[#1A1A1A] leading-tight">
          Feel Good. Look Better.
        </h1>

        {/* Accent bar */}
        <div className="mx-auto mt-4 mb-8 h-[3px] w-16 bg-[#FF4D4D] rounded-full"></div>

        <LocalizedClientLink
          href="/store"
          className="
            inline-block
            px-8 py-3 
            text-white 
            bg-[#1A1A1A]
            rounded-md 
            text-[15px] 
            font-medium
            hover:opacity-90
            transition
          "
        >
          Shop Now
        </LocalizedClientLink>

      </div>
    </section>
  )
}

export default Hero
