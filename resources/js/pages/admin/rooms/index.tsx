import { Head, Link, router } from '@inertiajs/react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dashboard } from '@/routes';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';

type RoomRow = {
    id: number;
    slug: string;
    name: string;
    type: 'luxury' | 'standard' | 'cozy';
    price_per_night: number;
    capacity: number;
    bed_type: string;
    bathroom_type: string;
    short_description: string;
    thumbnail: string;
    images_count: number;
    created_at: string;
};

type PaginatedRooms = {
    data: RoomRow[];
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

const columnHelper = createColumnHelper<RoomRow>();

export default function AdminRoomsIndex({
    rooms,
    filters,
}: {
    rooms: PaginatedRooms;
    filters: { search?: string; type?: string; capacity?: string };
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [typeFilter, setTypeFilter] = useState(filters.type ?? '');
    const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
    const isFirstRender = useRef(true);

    const columns = [
        columnHelper.accessor('thumbnail', {
            header: '',
            cell: ({ getValue }) =>
                getValue() ? (
                    <img
                        src={getValue()}
                        alt=""
                        className="size-10 rounded object-cover"
                    />
                ) : (
                    <div className="size-10 rounded bg-muted" />
                ),
        }),
        columnHelper.accessor('name', {
            header: 'Name',
            cell: ({ row, getValue }) => (
                <Link
                    href={`/admin/rooms/${row.original.slug}`}
                    className="font-medium underline-offset-2 hover:underline"
                >
                    {getValue()}
                </Link>
            ),
        }),
        columnHelper.accessor('type', {
            header: 'Type',
            cell: ({ getValue }) => {
                const map: Record<string, string> = {
                    luxury: 'Luxury',
                    standard: 'Standard',
                    cozy: 'Cozy',
                };

                return (
                    <Badge variant="outline">
                        {map[getValue()] ?? getValue()}
                    </Badge>
                );
            },
        }),
        columnHelper.accessor('price_per_night', {
            header: 'Price / Night',
            cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`,
        }),
        columnHelper.accessor('capacity', {
            header: 'Capacity',
            cell: ({ getValue }) => `${getValue()} guests`,
        }),
        columnHelper.accessor('bed_type', {
            header: 'Bed',
        }),
        columnHelper.accessor('bathroom_type', {
            header: 'Bathroom',
        }),
        columnHelper.accessor('images_count', {
            header: 'Images',
            cell: ({ getValue }) => getValue(),
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
                        <Link href={`/admin/rooms/${row.original.slug}`}>
                            <Pencil className="size-4" />
                        </Link>
                    </Button>
                    <Dialog
                        open={deletingSlug === row.original.slug}
                        onOpenChange={(open) => {
                            if (!open) setDeletingSlug(null);
                        }}
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
                            <DialogHeader>
                                <DialogTitle>Delete room</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete{' '}
                                    <strong>{row.original.name}</strong>? This
                                    action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="secondary">Cancel</Button>
                                </DialogClose>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        router.delete(
                                            `/admin/rooms/${row.original.slug}`,
                                        );
                                        setDeletingSlug(null);
                                    }}
                                >
                                    Delete room
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            ),
        }),
    ];

    const table = useReactTable({
        data: rooms.data,
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
                '/admin/rooms',
                {
                    ...(search ? { search } : {}),
                    ...(typeFilter ? { type: typeFilter } : {}),
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search, typeFilter]);

    return (
        <>
            <Head title="Admin Rooms" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Rooms"
                        description="Manage your room inventory"
                    />
                    <Button asChild>
                        <Link href="/admin/rooms/create">
                            <Plus className="size-4" />
                            Create Room
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search rooms..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="flex h-9 w-40 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                    >
                        <option value="">All types</option>
                        <option value="luxury">Luxury</option>
                        <option value="standard">Standard</option>
                        <option value="cozy">Cozy</option>
                    </select>
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
                                        No rooms found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {rooms.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {rooms.links.map(
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

AdminRoomsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Rooms' },
    ],
};
