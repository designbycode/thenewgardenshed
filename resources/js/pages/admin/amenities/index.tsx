import { Head, Link, router } from '@inertiajs/react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dashboard } from '@/routes';

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

const columns = [
    columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row, getValue }) => (
            <Link
                href={`/admin/amenities/${row.original.slug}/edit`}
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
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
    }),
    columnHelper.display({
        id: 'actions',
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/amenities/${row.original.slug}/edit`}>
                        <Pencil className="size-4" />
                    </Link>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        if (confirm('Delete this amenity?')) {
                            router.delete(`/admin/amenities/${row.original.slug}`);
                        }
                    }}
                >
                    <Trash2 className="size-4 text-destructive" />
                </Button>
            </div>
        ),
    }),
];

export default function AdminAmenitiesIndex({
    amenities,
    filters,
}: {
    amenities: PaginatedAmenities;
    filters: { search?: string };
}) {
    const [search, setSearch] = useState(filters.search ?? '');
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

            <div className="flex flex-col gap-6 p-4 pt-0">
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
