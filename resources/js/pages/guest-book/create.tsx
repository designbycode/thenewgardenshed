import { Form, usePage } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/core';
import {
    CheckCircle,
    LoaderCircle,
    Lock,
    MessageCircle,
    MessageSquareText,
    Send,
    Star,
    ThumbsUp,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import HeadingBlock from '@/components/typography/heading-block';
import MainWrapper from '@/layouts/main/main-wrapper';
import MainLayout from '@/layouts/main-layout';
import { create, store } from '@/routes/guest-book';

interface CreatePageProps extends PageProps {
    review_authenticated: boolean;
    flash: {
        review_created?: boolean;
    } & PageProps['flash'];
}

const RATING_CATEGORIES = [
    { key: 'overall_rating', label: 'Overall' },
    { key: 'cleanliness_rating', label: 'Cleanliness' },
    { key: 'comfort_rating', label: 'Comfort' },
    { key: 'service_rating', label: 'Service' },
    { key: 'location_rating', label: 'Location' },
    { key: 'value_rating', label: 'Value' },
] as const;

function StarSelect({ name, label, error }: { name: string; label: string; error?: string }) {
    const [hovered, setHovered] = useState(0);
    const [selected, setSelected] = useState(0);

    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="flex flex-row-reverse gap-0.5">
                {[5, 4, 3, 2, 1].map((val) => (
                    <label
                        key={val}
                        className="cursor-pointer p-0.5 transition-transform hover:scale-110"
                        onMouseEnter={() => setHovered(val)}
                        onMouseLeave={() => setHovered(0)}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={val}
                            className="sr-only"
                            onChange={() => setSelected(val)}
                        />
                        <Star
                            size={20}
                            className={
                                val <= (hovered || selected)
                                    ? 'fill-yellow-500 text-yellow-500'
                                    : 'fill-muted text-muted-foreground/30'
                            }
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}

export default function GuestBookCreate() {
    const { review_authenticated, flash } = usePage<CreatePageProps>().props;
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(!review_authenticated);
    const [successDialogOpen, setSuccessDialogOpen] = useState(!!flash?.review_created);
    const [ratings, setRatings] = useState<Record<string, number>>({
        overall_rating: 0,
        cleanliness_rating: 0,
        comfort_rating: 0,
        service_rating: 0,
        location_rating: 0,
        value_rating: 0,
    });

    return (
        <MainWrapper className="py-18">
            <HeadingBlock
                className="mx-auto text-center"
                badge={{ text: 'Share Your Experience', icon: MessageCircle }}
                heading="Leave a Review"
                headingLevel={1}
                description={
                    <>
                        We'd love to hear about your stay at The Garden Shed.
                        Your feedback helps us keep improving.
                    </>
                }
            />

            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Lock size={18} />
                            Review Page Access
                        </DialogTitle>
                        <DialogDescription>
                            Enter the password to access the review form.
                        </DialogDescription>
                    </DialogHeader>
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        onSuccess={() => setPasswordDialogOpen(false)}
                        className="space-y-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <input type="hidden" name="action" value="verify" />
                                <div className="space-y-1.5">
                                    <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground">
                                        Password
                                    </Label>
                                    <Input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="Enter password"
                                    />
                                    <InputError message={errors.password} />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-5.5 text-xs font-semibold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary/90 disabled:opacity-60"
                                >
                                    {processing ? (
                                        <LoaderCircle size={14} className="animate-spin" />
                                    ) : (
                                        <Lock size={14} />
                                    )}
                                    <span>{processing ? 'Verifying...' : 'Enter'}</span>
                                </Button>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>

            {review_authenticated && (
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-md sm:p-8">
                        <h3 className="mb-6 border-b border-border pb-3 font-serif text-xl font-normal text-foreground">
                            Your Review
                        </h3>

                        <Form
                            {...store.form()}
                            className="space-y-6"
                            resetOnSuccess
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground">
                                                Your Name
                                            </Label>
                                            <Input
                                                type="text"
                                                id="name"
                                                name="name"
                                                placeholder="e.g. Jane Doe"
                                            />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
                                                Email Address
                                            </Label>
                                            <Input
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder="e.g. jane@example.com"
                                            />
                                            <InputError message={errors.email} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="country" className="text-xs font-semibold text-muted-foreground">
                                                Country
                                            </Label>
                                            <Input
                                                type="text"
                                                id="country"
                                                name="country"
                                                placeholder="e.g. South Africa"
                                            />
                                            <InputError message={errors.country} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="room_number" className="text-xs font-semibold text-muted-foreground">
                                                Room / Suite
                                            </Label>
                                            <Input
                                                type="text"
                                                id="room_number"
                                                name="room_number"
                                                placeholder="e.g. Suite 3"
                                            />
                                            <InputError message={errors.room_number} />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="stay_date" className="text-xs font-semibold text-muted-foreground">
                                            Stay Date
                                        </Label>
                                        <Input
                                            type="text"
                                            id="stay_date"
                                            name="stay_date"
                                            placeholder="e.g. June 2026"
                                        />
                                        <InputError message={errors.stay_date} />
                                    </div>

                                    <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Ratings
                                        </p>
                                        {RATING_CATEGORIES.map(({ key, label }) => (
                                            <div key={key} className="flex items-center justify-between gap-2">
                                                <span className="text-sm text-muted-foreground">{label}</span>
                                                <div className="flex flex-row-reverse gap-0.5">
                                                    {[5, 4, 3, 2, 1].map((val) => (
                                                        <label
                                                            key={val}
                                                            className="cursor-pointer p-0.5 transition-transform hover:scale-110"
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={key}
                                                                value={val}
                                                                checked={ratings[key] === val}
                                                                className="sr-only"
                                                                onChange={() => setRatings(prev => ({ ...prev, [key]: val }))}
                                                            />
                                                            <Star
                                                                size={20}
                                                                className={
                                                                    val <= ratings[key]
                                                                        ? 'fill-yellow-500 text-yellow-500'
                                                                        : 'fill-muted text-muted-foreground/30'
                                                                }
                                                            />
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        <InputError message={errors.overall_rating} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="review" className="text-xs font-semibold text-muted-foreground">
                                            Your Review
                                        </Label>
                                        <Textarea
                                            id="review"
                                            name="review"
                                            placeholder="Tell us about your experience..."
                                            className="min-h-32"
                                            rows={4}
                                        />
                                        <InputError message={errors.review} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="suggestions" className="text-xs font-semibold text-muted-foreground">
                                            Suggestions <span className="font-normal text-muted-foreground/60">(optional)</span>
                                        </Label>
                                        <Textarea
                                            id="suggestions"
                                            name="suggestions"
                                            placeholder="Any suggestions for improvement..."
                                            className="min-h-24"
                                            rows={3}
                                        />
                                        <InputError message={errors.suggestions} />
                                    </div>

                                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                                        <input
                                            type="checkbox"
                                            name="would_recommend"
                                            value="1"
                                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                        />
                                        <div>
                                            <span className="text-sm font-medium text-foreground">
                                                I would recommend The Garden Shed to a friend
                                            </span>
                                            <ThumbsUp size={14} className="ml-1.5 inline text-primary" />
                                        </div>
                                    </label>
                                    <InputError message={errors.would_recommend} />
                                    <InputError message={errors.password} />

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-5.5 text-xs font-semibold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary/90 disabled:opacity-60"
                                    >
                                        {processing ? (
                                            <LoaderCircle size={14} className="animate-spin" />
                                        ) : (
                                            <Send size={14} />
                                        )}
                                        <span>{processing ? 'Submitting...' : 'Submit Review'}</span>
                                    </Button>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            )}

            <Dialog
                open={successDialogOpen}
                onOpenChange={(open) => {
                    setSuccessDialogOpen(open);
                    if (!open) {
                        window.location.href = create.url();
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <CheckCircle size={32} className="text-primary" />
                        </div>
                        <DialogTitle className="text-center text-xl">
                            Thank You!
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Your review has been submitted successfully. It will appear on our
                            guest wall after moderation.
                        </DialogDescription>
                    </DialogHeader>
                    <Button
                        onClick={() => {
                            setSuccessDialogOpen(false);
                            window.location.href = create.url();
                        }}
                        className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-5.5 text-xs font-semibold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary/90"
                    >
                        <MessageSquareText size={14} />
                        <span>Write Another Review</span>
                    </Button>
                </DialogContent>
            </Dialog>
        </MainWrapper>
    );
}

GuestBookCreate.displayName = 'GuestBookCreate';

GuestBookCreate.layout = (page: any) => (
    <MainLayout
        title={'Leave a Review | The New Garden Shed'}
        description={
            'Share your experience at The Garden Shed. Leave a review and let others know about your stay.'
        }
    >
        {page}
    </MainLayout>
);
