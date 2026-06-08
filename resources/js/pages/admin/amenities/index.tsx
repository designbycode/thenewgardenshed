import { Head, Link, router } from '@inertiajs/react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dashboard } from '@/routes';

type AmenityRow = {
    id: number;
    slug: string;
    name: string;
    icon: string;
    display_order: number;
};

type PaginatedAmenities = {
    data: AmenityRow[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

const columnHelper = createColumnHelper<AmenityRow>();

const columns = [
    columnHelper.accessor('icon', {
        header: 'Icon',
        cell: ({ getValue }) => <span className="text-xl">{getValue()}</span>,
    }),
    columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    }),
    columnHelper.accessor('display_order', {
        header: 'Order',
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

    const table = useReactTable({
        data: amenities.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (filters.search ?? '')) {
                router.get(
                    '/admin/amenities',
                    { search },
                    { preserveState: true, preserveScroll: true },
                );
            }
        }, 300);
        return () => clearTimeout(timeout);
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
                                            {flexRender(
                                                header.column.columnDef.header,
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
