import { InfiniteScroll } from '@inertiajs/react';
import { MessageCircle, MessageSquareText, Star, ThumbsUp } from 'lucide-react';
import HeadingBlock from '@/components/typography/heading-block';
import MainWrapper from '@/layouts/main/main-wrapper';
import MainLayout from '@/layouts/main-layout';
import type { ReviewItem, ReviewPage, ReviewStats } from '@/types/data';

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: max }, (_, i) => (
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

function RatingRow({ label, rating }: { label: string; rating: number }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">{label}</span>
            <StarRating rating={rating} />
        </div>
    );
}

function ReviewCard({ review }: { review: ReviewItem }) {
    return (
        <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                        {review.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        {review.country} &middot; {review.roomNumber}
                    </p>
                </div>
                <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-foreground">
                            {review.overallRating}
                        </span>
                        <Star
                            size={16}
                            className="fill-yellow-500 text-yellow-500"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {review.stayDate}
                    </p>
                </div>
            </div>

            <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{review.review}&rdquo;
            </p>

            <div className="mb-4 space-y-1.5 border-t border-border pt-4">
                <RatingRow
                    label="Cleanliness"
                    rating={review.cleanlinessRating ?? 0}
                />
                <RatingRow label="Comfort" rating={review.comfortRating ?? 0} />
                <RatingRow label="Service" rating={review.serviceRating ?? 0} />
                <RatingRow
                    label="Location"
                    rating={review.locationRating ?? 0}
                />
                <RatingRow label="Value" rating={review.valueRating ?? 0} />
            </div>

            {review.wouldRecommend && (
                <div className="mt-auto flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
                    <ThumbsUp size={14} />
                    <span>Would recommend to a friend</span>
                </div>
            )}
        </div>
    );
}

const STAT_LABELS: { key: keyof ReviewStats; label: string }[] = [
    { key: 'avg_overall', label: 'Overall' },
    { key: 'avg_cleanliness', label: 'Cleanliness' },
    { key: 'avg_comfort', label: 'Comfort' },
    { key: 'avg_service', label: 'Service' },
    { key: 'avg_location', label: 'Location' },
    { key: 'avg_value', label: 'Value' },
];

function StatBar({ value, label }: { value: number; label: string }) {
    const pct = (value / 5) * 100;
    const starCount = Math.round(value);

    return (
        <div className="flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                    {label}
                </span>
                <StarRating rating={starCount} />
            </div>
            <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full rounded-full bg-linear-to-r from-primary to-primary/75 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

export default function GuestBookIndex({
    reviews,
    stats,
}: {
    reviews: ReviewPage;
    stats: ReviewStats;
}) {
    return (
        <MainWrapper className="py-18">
            <HeadingBlock
                className="mx-auto text-center"
                badge={{ text: 'Our Guest Wall of Love', icon: MessageCircle }}
                heading="What Our Guests Say"
                headingLevel={1}
                description={
                    <>
                        Real stories from real guests who have experienced the
                        warmth and charm of The Garden Shed.
                    </>
                }
            />

            <div className="mb-16 space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-gradient-to-b from-primary/5 to-transparent p-8 shadow-sm">
                        <p className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
                            {stats.total}
                        </p>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MessageSquareText size={16} />
                            <span>Total Reviews</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-gradient-to-b from-primary/5 to-transparent p-8 shadow-sm">
                        <p className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
                            {stats.avg_overall}
                        </p>
                        <StarRating
                            rating={Math.round(Number(stats.avg_overall))}
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-gradient-to-b from-primary/5 to-transparent p-8 shadow-sm">
                        <p className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
                            {stats.recommend_pct}%
                        </p>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <ThumbsUp size={16} />
                            <span>Would Recommend</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {STAT_LABELS.map(({ key, label }) => (
                        <StatBar
                            key={key}
                            label={label}
                            value={stats[key] as number}
                        />
                    ))}
                </div>
            </div>

            <InfiniteScroll
                data="reviews"
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                {reviews.data.map((review: ReviewItem) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </InfiniteScroll>
        </MainWrapper>
    );
}

GuestBookIndex.displayName = 'GuestBookIndex';

GuestBookIndex.layout = (page: any) => (
    <MainLayout
        title={'Guest Book | The New Garden Shed'}
        description={
            'Read what our guests have to say about their stay at The Garden Shed. Real reviews and ratings from happy visitors.'
        }
    >
        {page}
    </MainLayout>
);
