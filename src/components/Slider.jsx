import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "swiper/css";
import "swiper/css/pagination";

const sliders = [
  { src: "/slider/slider-1.png", alt: "slider" },
  { src: "/slider/slider-2.png", alt: "slider" },
  { src: "/slider/slider-3.png", alt: "slider" },
  { src: "/slider/slider-4.png", alt: "slider" },
];

const Slider = () => {
  return (
    <Swiper
      modules={[Pagination]}
      slidesPerView={1}
      grabCursor={true}
      pagination={{ clickable: true }}
      style={{
        "--swiper-pagination-color": "#FFF",
        "--swiper-pagination-bullet-inactive-color": "#616161",
        "--swiper-pagination-bullet-inactive-opacity": "1",
        "--swiper-pagination-bullet-size": "14px",
        "--swiper-pagination-bullet-horizontal-gap": "7px",
      }}
    >
      {sliders.map((slide) => (
        <SwiperSlide className="w-full">
          <img src={slide.src} alt={slide.alt} width={1440} height={332} className="w-full"></img>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slider;
