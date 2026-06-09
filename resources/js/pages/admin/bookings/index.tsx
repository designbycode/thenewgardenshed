import { Head, Link, router } from '@inertiajs/react';
import { Eye, Search, Calendar, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
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
import { dashboard } from '@/routes';
import { index, show, calendar, create } from '@/routes/admin/bookings';

interface Booking {
    id: number;
    name: string;
    email: string;
    check_in: string;
    check_out: string;
    status: string;
    total_price: string;
    room: {
        name: string;
    };
}

interface RoomItem {
    id: number;
    name: string;
}

interface PageProps {
    bookings: {
        data: Booking[];
        links: any[];
    };
    rooms: RoomItem[];
    filters: {
        search?: string;
        status?: string;
        room_id?: string;
    };
}

export default function BookingIndex({ bookings, rooms, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [roomFilter, setRoomFilter] = useState(filters.room_id || '');
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
                    ...(roomFilter ? { room_id: roomFilter } : {}),
                },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search, statusFilter, roomFilter]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Confirmed</Badge>;
            case 'cancelled':
                return <Badge variant="destructive">Cancelled</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
        }
    };

    return (
        <>
            <Head title="Manage Bookings" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Bookings"
                        description="Track and manage room reservations"
                    />
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild className="gap-2">
                            <Link href={calendar().url}>
                                <Calendar className="h-4 w-4" />
                                Calendar View
                            </Link>
                        </Button>
                        <Button asChild className="gap-2">
                            <Link href={create().url}>
                                <Plus className="h-4 w-4" />
                                Create Booking
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search bookings..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    
                    <select
                        value={roomFilter}
                        onChange={(e) => setRoomFilter(e.target.value)}
                        className="flex h-9 w-48 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                    >
                        <option value="">All Rooms</option>
                        {rooms.map(room => (
                            <option key={room.id} value={room.id.toString()}>{room.name}</option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="flex h-9 w-40 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Guest</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead>Dates</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.data.length > 0 ? (
                                bookings.data.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell>
                                            <div className="font-medium">{booking.name}</div>
                                            <div className="text-xs text-muted-foreground">{booking.email}</div>
                                        </TableCell>
                                        <TableCell>{booking.room.name}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm font-medium">R {booking.total_price}</TableCell>
                                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                asChild
                                            >
                                                <Link
                                                    href={show(booking.id).url}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No bookings found.
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

BookingIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Bookings' },
    ],
};
