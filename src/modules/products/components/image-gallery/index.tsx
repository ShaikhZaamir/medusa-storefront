"use client"

import { useState } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

// Swiper (MOBILE ONLY)
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"

// Lightbox (FULL SCREEN)
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import "yet-another-react-lightbox/styles.css"


type Props = {
  images: HttpTypes.StoreProductImage[]
}

export default function ImageGallery({ images }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Change big image on desktop
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="w-full">

      {/* ========== MOBILE SWIPER GALLERY ========== */}
      <div className="lg:hidden relative">
        <Swiper
          modules={[Pagination]}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet bg-black/30",
            bulletActiveClass: "swiper-pagination-bullet-active bg-black",
          }}
          onSlideChange={(s) => setLightboxIndex(s.activeIndex)}
        >
          {images.map((img, i) => (
            <SwiperSlide key={img.id}>
              <div
                className="relative w-full aspect-[29/34] rounded-xl overflow-hidden bg-ui-bg-subtle"
                onClick={() => {
                  setLightboxOpen(true)
                  setLightboxIndex(i)
                }}
              >
                <Image
                  src={img.url}
                  alt={`Product Image ${i + 1}`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>



      {/* ========== DESKTOP LAYOUT (your preferred version) ========== */}
      <div className="hidden lg:flex flex-col gap-y-6">

        {/* MAIN IMAGE (centered with reduced width) */}
        <div className="relative w-full flex items-center justify-center">

          {/* ← LEFT ARROW */}
          <button
            onClick={() => setSelectedIndex((i) => Math.max(i - 1, 0))}
            className="absolute left-[5%] z-10 bg-white shadow-md w-10 h-10 rounded-full 
            flex items-center justify-center text-black hover:bg-gray-100"
            disabled={selectedIndex === 0}
          >
            ‹
          </button>

          {/* MAIN IMAGE */}
          <div
            className="relative w-full max-w-[500px] aspect-[29/34] rounded-xl overflow-hidden bg-ui-bg-subtle cursor-pointer"
            onClick={() => {
              setLightboxOpen(true)
              setLightboxIndex(selectedIndex)
            }}
          >
            <Image
              src={images[selectedIndex].url}
              alt="Selected Image"
              fill
              sizes="600px"
              className="object-cover"
            />
          </div>

          {/* → RIGHT ARROW */}
          <button
            onClick={() => setSelectedIndex((i) => Math.min(i + 1, images.length - 1))}
            className="absolute right-[5%] z-10 bg-white shadow-md w-10 h-10 rounded-full 
            flex items-center justify-center text-black hover:bg-gray-100"
            disabled={selectedIndex === images.length - 1}
          >
            ›
          </button>

        </div>

        {/* THUMBNAILS ROW */}
        <div className="flex gap-x-4 overflow-x-auto pb-2 justify-center">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-32 h-32 rounded-lg overflow-hidden border transition-all ${index === selectedIndex
                ? "border-black"
                : "border-transparent opacity-60 hover:opacity-100"
                }`}
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>



      {/* ========== FULL SCREEN LIGHTBOX ========== */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={images.map((img) => ({
            src: img.url,
            alt: "Product Image",
            width: 1200,
            height: 1600,
          }))}
          plugins={[Zoom]}

          render={{
            buttonZoom: () => null,
            iconZoomIn: () => null,
            iconZoomOut: () => null,
          }}

        />
      )}
    </div>
  )
}




// import { HttpTypes } from "@medusajs/types"
// import { Container } from "@medusajs/ui"
// import Image from "next/image"

// type ImageGalleryProps = {
//   images: HttpTypes.StoreProductImage[]
// }

// const ImageGallery = ({ images }: ImageGalleryProps) => {
//   return (
//     <div className="flex items-start relative">
//       <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
//         {images.map((image, index) => {
//           return (
//             <Container
//               key={image.id}
//               className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle"
//               id={image.id}
//             >
//               {!!image.url && (
//                 <Image
//                   src={image.url}
//                   priority={index <= 2 ? true : false}
//                   className="absolute inset-0 rounded-rounded"
//                   alt={`Product image ${index + 1}`}
//                   fill
//                   sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
//                   style={{
//                     objectFit: "cover",
//                   }}
//                 />
//               )}
//             </Container>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default ImageGallery
