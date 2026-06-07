import { useState } from 'react';
import { Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import type { MediaItem } from '@/types/data';

interface RoomImageCarouselProps {
    media: MediaItem[];
    roomType?: string;
    roomName?: string;
}

export default function RoomImageCarousel({
    media,
    roomType,
    roomName,
}: RoomImageCarouselProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

    if (media.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
            <style>{`
                .room-carousel-main .swiper-button-next,
                .room-carousel-main .swiper-button-prev {
                    color: #fff;
                    background: rgba(0,0,0,0.5);
                    width: 36px;
                    height: 36px;
                    border-radius: 9999px;
                    font-size: 12px;
                }
                .room-carousel-main .swiper-button-next::after,
                .room-carousel-main .swiper-button-prev::after {
                    font-size: 14px;
                }
                .room-carousel-main .swiper-button-next {
                    right: 12px;
                }
                .room-carousel-main .swiper-button-prev {
                    left: 12px;
                }
                .room-carousel-thumbs .swiper-slide-thumb-active {
                    border-color: #c5a059;
                }
                .room-carousel-main .swiper-pagination {
                    bottom: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }
                .room-carousel-main .swiper-pagination-bullet {
                    background: rgba(255,255,255,0.4);
                    opacity: 1;
                    width: 8px;
                    height: 8px;
                    border-radius: 9999px;
                    transition: all 0.25s;
                }
                .room-carousel-main .swiper-pagination-bullet-active {
                    background: #c5a059;
                    width: 32px;
                    border-radius: 9999px;
                }
            `}</style>

            <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-border bg-muted shadow-lg">
                <Swiper
                    modules={[Pagination, Thumbs]}
                    thumbs={{ swiper: thumbsSwiper }}
                    pagination={{ clickable: true }}
                    loop={media.length > 1}
                    className="room-carousel-main h-full w-full"
                >
                    {media.map((item) => (
                        <SwiperSlide key={item.id}>
                            <img
                                src={item.url}
                                alt={item.name}
                                className="h-full w-full object-cover select-none"
                                referrerPolicy="no-referrer"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {roomType && (
                    <div className="absolute top-4 left-4 z-10">
                        <div className="rounded border border-white/20 bg-black/60 px-3 py-1 text-[10px] font-semibold tracking-wider text-white capitalize dark:border-[#c5a059]/30 dark:bg-[#c5a059]/20 dark:text-primary">
                            {roomType} Suite
                        </div>
                    </div>
                )}
            </div>

            {media.length > 1 && (
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={Math.min(media.length, 4)}
                    watchSlidesProgress
                    className="room-carousel-thumbs pb-0"
                >
                    {media.map((item) => (
                        <SwiperSlide
                            key={item.id}
                            className="overflow-hidden rounded-lg border-2 border-transparent bg-stone-100 transition-colors dark:bg-black/35"
                        >
                            <img
                                src={item.thumb}
                                alt={item.name}
                                className="h-24 w-full cursor-pointer object-cover"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}
