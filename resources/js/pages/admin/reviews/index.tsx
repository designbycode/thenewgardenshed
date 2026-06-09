import { Head, router } from '@inertiajs/react';
import { Check, Eye, Search, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';
import { approve, destroy, index, reject, show } from '@/routes/admin/reviews';

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
        status?: string;
    };
}

export default function ReviewIndex({ reviews, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                index().url,
                {
                    ...(search ? { search } : {}),
                    ...(statusFilter ? { status: statusFilter } : {}),
                },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search, statusFilter]);

    const handleApprove = (id: number) => {
        router.post(approve(id).url, {}, { preserveScroll: true });
    };

    const handleReject = (id: number) => {
        router.post(reject(id).url, {}, { preserveScroll: true });
    };

    const handleDelete = (id: number) => {
        router.delete(destroy(id).url, {
            preserveScroll: true,
            onSuccess: () => setDeletingId(null),
        });
    };

    return (
        <>
            <Head title="Manage Reviews" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Reviews"
                        description="Moderate and manage guest reviews"
                    />
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search reviews..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="flex h-9 w-40 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                    >
                        <option value="">All Statuses</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>

                <div className="rounded-xl border">
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
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => router.get(show(review.id).url)}
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4 text-primary" />
                                                </Button>
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
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        setDeletingId(review.id)
                                                    }
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

            <Dialog
                open={deletingId !== null}
                onOpenChange={(open) => {
                    if (!open) setDeletingId(null);
                }}
            >
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
                        <Button
                            variant="destructive"
                            onClick={() =>
                                deletingId && handleDelete(deletingId)
                            }
                        >
                            Delete Review
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

ReviewIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Reviews' },
    ],
};
