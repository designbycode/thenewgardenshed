import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Check, Trash2, X, MessageSquare, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { index, approve, reject, destroy } from '@/routes/admin/reviews';

interface Review {
    id: number;
    name: string;
    email: string;
    review: string;
    is_approved: boolean;
    created_at: string;
}

interface PageProps {
    reviews: {
        data: Review[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function ReviewIndex({ reviews, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                router.get(
                    index().url,
                    { search },
                    { preserveState: true, preserveScroll: true, replace: true }
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const handleApprove = (id: number) => {
        router.post(approve(id).url, {}, { preserveScroll: true });
    };

    const handleReject = (id: number) => {
        router.post(reject(id).url, {}, { preserveScroll: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this review?')) {
            router.delete(destroy(id).url, { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Reviews', href: index().url }]}>
            <Head title="Manage Reviews" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Reviews</h1>
                        <p className="text-sm text-muted-foreground">
                            Moderate and manage guest reviews.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search reviews..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Guest</TableHead>
                                <TableHead>Review</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reviews.data.length > 0 ? (
                                reviews.data.map((review) => (
                                    <TableRow key={review.id}>
                                        <TableCell>
                                            <div className="font-medium">{review.name}</div>
                                            <div className="text-xs text-muted-foreground">{review.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-md truncate text-sm" title={review.review}>
                                                {review.review}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {review.is_approved ? (
                                                <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
                                                    Approved
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                                                    Pending
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {!review.is_approved ? (
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleApprove(review.id)}
                                                        title="Approve"
                                                    >
                                                        <Check className="h-4 w-4 text-green-600" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleReject(review.id)}
                                                        title="Reject"
                                                    >
                                                        <X className="h-4 w-4 text-yellow-600" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleDelete(review.id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No reviews found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
