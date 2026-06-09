import { Head, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    X,
    Trash2,
    User,
    Mail,
    Calendar,
    MapPin,
    Home,
    ThumbsUp,
    ThumbsDown,
    Star,
    MessageSquare,
    Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { approve, destroy, index, reject, reply } from '@/routes/admin/reviews';
import { toast } from 'sonner';

interface Review {
    id: number;
    name: string;
    email: string;
    room_number: string | null;
    country: string | null;
    stay_date: string | null;
    overall_rating: number;
    cleanliness_rating: number;
    comfort_rating: number;
    service_rating: number;
    location_rating: number;
    value_rating: number;
    review: string;
    suggestions: string | null;
    would_recommend: boolean;
    is_approved: boolean;
    created_at: string;
}

interface PageProps {
    review: Review;
}

const RatingStars = ({ rating, label }: { rating: number; label: string }) => {
    return (
        <div className="flex items-center justify-between py-2 border-b border-border/50 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={cn(
                            "h-4 w-4",
                            star <= rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-neutral-300 dark:text-neutral-700"
                        )}
                    />
                ))}
                <span className="ml-2 text-xs font-semibold text-muted-foreground">{rating}/5</span>
            </div>
        </div>
    );
};

export default function ReviewShow({ review }: PageProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        subject: `Response to your review at The New Garden Shed`,
        message: '',
    });

    const handleSendReply = (e: React.FormEvent) => {
        e.preventDefault();
        post(reply(review.id).url, {
            onSuccess: () => {
                reset('message');
                toast.success('Reply email sent successfully.');
            },
            onError: () => {
                toast.error('Failed to send reply email. Please verify inputs.');
            }
        });
    };

    const handleApprove = () => {
        router.post(approve(review.id).url, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Review approved successfully.');
            }
        });
    };

    const handleReject = () => {
        router.post(reject(review.id).url, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Review rejected successfully.');
            }
        });
    };

    const handleDelete = () => {
        router.delete(destroy(review.id).url, {
            onSuccess: () => {
                setIsDeleting(false);
                toast.success('Review deleted successfully.');
            }
        });
    };

    return (
        <>
            <Head title={`Review from ${review.name}`} />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <Button
                        variant="ghost"
                        onClick={() => router.get(index().url)}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Reviews
                    </Button>
                    <div className="flex gap-2">
                        {!review.is_approved ? (
                            <Button
                                variant="outline"
                                onClick={handleApprove}
                                className="gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-900/30 dark:text-green-400 dark:hover:bg-green-950/20"
                            >
                                <Check className="h-4 w-4" />
                                Approve Review
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={handleReject}
                                className="gap-2 border-yellow-200 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-800 dark:border-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-950/20"
                            >
                                <X className="h-4 w-4" />
                                Reject Review
                            </Button>
                        )}
                        <Button
                            variant="destructive"
                            onClick={() => setIsDeleting(true)}
                            className="gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-muted/10 border-b border-border/50">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-xl font-bold">Review Comment</CardTitle>
                                        <CardDescription className="mt-1">
                                            Submitted on {new Date(review.created_at).toLocaleString()}
                                        </CardDescription>
                                    </div>
                                    {review.is_approved ? (
                                        <Badge variant="default" className="bg-green-100 text-green-700 border border-green-200 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/30">
                                            Approved & Public
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/30">
                                            Pending Moderation
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="relative bg-muted/20 border border-border/40 rounded-xl p-6">
                                    <MessageSquare className="absolute -top-3 -left-3 size-8 text-muted/30 fill-muted/10" />
                                    <blockquote className="text-base text-foreground leading-relaxed italic whitespace-pre-wrap">
                                        "{review.review}"
                                    </blockquote>
                                </div>

                                {review.suggestions && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                                            <Sparkles className="size-4" />
                                            Suggestions for Improvement
                                        </h4>
                                        <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-yellow-50/30 dark:bg-yellow-950/5 border border-yellow-200/30 rounded-lg p-4">
                                            {review.suggestions}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Stay Details</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <Home className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="text-xs font-medium text-muted-foreground">Room Number</div>
                                        <div className="text-sm font-semibold">{review.room_number || 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="text-xs font-medium text-muted-foreground">Stay Date</div>
                                        <div className="text-sm font-semibold">
                                            {review.stay_date ? new Date(review.stay_date).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                            }) : 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="text-xs font-medium text-muted-foreground">Country</div>
                                        <div className="text-sm font-semibold">{review.country || 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {review.would_recommend ? (
                                        <ThumbsUp className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <ThumbsDown className="h-5 w-5 text-destructive" />
                                    )}
                                    <div>
                                        <div className="text-xs font-medium text-muted-foreground">Would Recommend</div>
                                        <div className="text-sm font-semibold">
                                            {review.would_recommend ? 'Yes, recommends us!' : 'No, does not recommend'}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Email Guest Response
                                </CardTitle>
                                <CardDescription>Send a direct email response to {review.name}.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSendReply} className="space-y-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input
                                            id="subject"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            required
                                        />
                                        {errors.subject && (
                                            <p className="text-sm text-destructive">{errors.subject}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="message">Message Body</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Write your response message here..."
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            rows={5}
                                            required
                                        />
                                        {errors.message && (
                                            <p className="text-sm text-destructive">{errors.message}</p>
                                        )}
                                    </div>
                                    <Button type="submit" disabled={processing} className="gap-2">
                                        <Mail className="h-4 w-4" />
                                        {processing ? 'Sending...' : 'Send Reply Email'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Guest Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="text-xs font-medium text-muted-foreground">Full Name</div>
                                        <div className="text-sm font-semibold">{review.name}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="text-xs font-medium text-muted-foreground">Email Address</div>
                                        <a href={`mailto:${review.email}`} className="text-sm font-semibold text-primary hover:underline">
                                            {review.email}
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Ratings Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                <RatingStars label="Overall Rating" rating={review.overall_rating} />
                                <RatingStars label="Cleanliness" rating={review.cleanliness_rating} />
                                <RatingStars label="Comfort" rating={review.comfort_rating} />
                                <RatingStars label="Service" rating={review.service_rating} />
                                <RatingStars label="Location" rating={review.location_rating} />
                                <RatingStars label="Value" rating={review.value_rating} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Review</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this review? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete Review
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

ReviewShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Reviews', href: index().url },
        { title: 'Review Detail' },
    ],
};
