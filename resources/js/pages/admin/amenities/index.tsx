import { Head, Link, router } from '@inertiajs/react';

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
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
import { destroy, edit } from '@/routes/admin/amenities';

type AmenityRow = {
    id: number;
    slug: string;
    name: string;
    icon: string | null;
    display_order: number;
    created_at: string;
};

type PaginatedAmenities = {
    data: AmenityRow[];
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

const columnHelper = createColumnHelper<AmenityRow>();

export default function AdminAmenitiesIndex({
    amenities,
    filters,
}: {
    amenities: PaginatedAmenities;
    filters: { search?: string };
}) {
    const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');

    const columns = [
        columnHelper.accessor('name', {
            header: 'Name',
            cell: ({ row, getValue }) => (
                <Link
                    prefetch={true}
                    href={edit(row.original.slug)}
                    className="font-medium underline-offset-2 hover:underline"
                >
                    {getValue()}
                </Link>
            ),
        }),
        columnHelper.accessor('slug', {
            header: 'Slug',
        }),
        columnHelper.accessor('icon', {
            header: 'Icon',
        }),
        columnHelper.accessor('display_order', {
            header: 'Order',
        }),
        columnHelper.accessor('created_at', {
            header: 'Created',
            cell: ({ getValue }) =>
                new Date(getValue()).toLocaleDateString('en-US'),
        }),
        columnHelper.display({
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" asChild>
                        <Link prefetch={true} href={edit(row.original.slug)}>
                            <Pencil className="size-4" />
                        </Link>
                    </Button>
                    <Dialog
                        open={deletingSlug === row.original.slug}
                        onOpenChange={(open) => !open && setDeletingSlug(null)}
                    >
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    setDeletingSlug(row.original.slug)
                                }
                            >
                                <Trash2 className="size-4 text-destructive" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Delete amenity</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete "
                                {row.original.name}"? This action cannot be
                                undone.
                            </DialogDescription>
                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button variant="secondary">Cancel</Button>
                                </DialogClose>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        router.delete(
                                            destroy(row.original.slug).url,
                                        );
                                        setDeletingSlug(null);
                                    }}
                                >
                                    Delete amenity
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            ),
        }),
    ];
    const isFirstRender = useRef(true);

    const table = useReactTable({
        data: amenities.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        const timer = setTimeout(() => {
            router.get(
                '/admin/amenities',
                {
                    ...(search ? { search } : {}),
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <>
            <Head title="Admin Amenities" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Amenities"
                        description="Manage room amenities"
                    />
                    <Button asChild>
                        <Link href="/admin/amenities/create">
                            <Plus className="size-4" />
                            Create Amenity
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search amenities..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No amenities found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {amenities.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {amenities.links.map(
                            (link: {
                                url: string | null;
                                label: string;
                                active: boolean;
                            }) => (
                                <Button
                                    key={link.label}
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    disabled={!link.url}
                                    asChild
                                >
                                    <Link
                                        href={link.url ?? '#'}
                                        preserveScroll
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                </Button>
                            ),
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

AdminAmenitiesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Amenities' },
    ],
};
