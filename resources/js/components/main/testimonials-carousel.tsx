import { Link } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import type { ReviewItem } from '@/types/data';
import { Button } from '@/components/ui/button';
import { index as guestBookIndex } from '@/routes/guest-book';
import MainWrapper from '@/layouts/main/main-wrapper';

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    size={14}
                    className={
                        i < rating
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'fill-muted text-muted-foreground/30'
                    }
                />
            ))}
        </div>
    );
}

export default function TestimonialsCarousel({
    reviews,
}: {
    reviews: ReviewItem[];
}) {
    const shuffled = [...reviews]
        .sort(() => {
            return Math.random() - 0.5;
        })
        .slice(0, 12);

    if (shuffled.length === 0) {
        return null;
    }

    return (
        <section className="bg-muted/50 py-18">
            <MainWrapper>
                <div className="mx-auto mb-8 max-w-2xl text-center">
                    <span className="rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 font-mono text-xs font-semibold tracking-widest text-primary uppercase">
                        Our Guest Wall of Love
                    </span>
                    <h3 className="mt-4 font-serif text-2xl font-light text-foreground sm:text-3xl">
                        Highly Rated on The Garden Shed
                    </h3>
                </div>

                <style>{`
                    .testimonials-swiper .swiper-wrapper {
                        align-items: stretch;
                    }
                    .testimonials-swiper .swiper-slide {
                        height: auto;
                        display: flex;
                    }
                `}</style>

                <Swiper
                    modules={[Autoplay]}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    loop={shuffled.length > 4}
                    spaceBetween={16}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 },
                    }}
                    className="testimonials-swiper"
                >
                    {shuffled.map((review) => (
                        <SwiperSlide key={review.id}>
                            <div className="flex w-full flex-col rounded-2xl border border-border bg-card p-6 shadow-md">
                                <div className="mb-3 flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            {review.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {review.country} &middot;{' '}
                                            {review.roomNumber}
                                        </p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <StarRating
                                            rating={review.overallRating}
                                        />
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {review.stayDate}
                                        </p>
                                    </div>
                                </div>

                                <p className="line-clamp-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                                    &ldquo;{review.review}&rdquo;
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="my-6 flex justify-center">
                    <Button
                        asChild
                        className="h-11 cursor-pointer px-8 font-bold uppercase"
                    >
                        <Link prefetch href={guestBookIndex()}>
                            See More Reviews
                        </Link>
                    </Button>
                </div>
            </MainWrapper>
        </section>
    );
}
