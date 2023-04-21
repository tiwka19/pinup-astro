import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
const Slider = () => {
	return (
		<Swiper
			modules={[Pagination]}
			spaceBetween={50}
			slidesPerView={1}
			grabCursor={true}
			onSlideChange={() => console.log('slide change')}
			onSwiper={swiper => console.log(swiper)}
			pagination={{ clickable: true }}
			style={{
				'--swiper-pagination-color': '#FFF',
				'--swiper-pagination-bullet-inactive-color': '#616161',
				'--swiper-pagination-bullet-inactive-opacity': '1',
				'--swiper-pagination-bullet-size': '14px',
				'--swiper-pagination-bullet-horizontal-gap': '7px',
			}}
		>
			<SwiperSlide className='w-full'>
				<img
					src='/slider/slider-1.png'
					alt='slider image'
					className='w-full h-[340px] object-cover'
				></img>
			</SwiperSlide>
			<SwiperSlide>
				<img
					src='/slider/slider-2.png'
					alt='slider image'
					className='w-full h-[340px] object-cover'
				></img>
			</SwiperSlide>
			<SwiperSlide>
				<img
					src='/slider/slider-3.png'
					alt='slider image'
					className='w-full h-[340px] object-cover'
				></img>
			</SwiperSlide>
			<SwiperSlide>
				<img
					src='/slider/slider-4.png'
					alt='slider image'
					className='w-full h-[340px] object-cover'
				></img>
			</SwiperSlide>
		</Swiper>
	)
}

export default Slider
