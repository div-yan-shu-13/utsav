"use client";

import * as React from "react";
// 1. Import the autoplay plugin
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // 2. We don't need the buttons anymore
  // CarouselNext,
  // CarouselPrevious,
} from "@/components/ui/carousel";

// Placeholder images - make sure these exist in your public/img/ folder
const images = [
  "/img/event1.jpg",
  "/img/event2.jpg",
  "/img/event3.jpeg",
  "/img/event1.jpg", // Added more for a better loop
  "/img/event2.jpg",
  "/img/event3.jpeg", // Fixed typo here
];

export function EventCarousel() {
  // 2. Set up the plugin
  const plugin = React.useRef(
    Autoplay({
      delay: 2000, // 3 seconds per slide
      stopOnInteraction: false, // Stops when user interacts
    })
  );

  return (
    <Carousel
      // 3. Pass the plugin to the carousel
      plugins={[plugin.current]}
      // 4. Add new options for looping
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full" // <-- Removed max-w-6xl
    >
      <CarouselContent>
        {images.map((src, index) => (
          // 6. Set the basis for multi-item view
          <CarouselItem
            key={index}
            className="basis-full md:basis-1/2 lg:basis-1/3"
          >
            {/* 7. Removed p-1 for a gapless look */}
            <div>
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={src}
                  alt={`Event image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  // Add placeholder in case images are slow to load
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88/GrHgAGagJ3wFhf+wAAAABJRU5ErkJggg=="
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* 8. Removed the previous/next buttons */}
      {/* <CarouselPrevious /> */}
      {/* <CarouselNext /> */}
    </Carousel>
  );
}
