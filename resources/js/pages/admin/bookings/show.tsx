import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, User, Phone, Mail, Home, CreditCard, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { index, update, destroy } from '@/routes/admin/bookings';

interface Booking {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    check_in: string;
    check_out: string;
    guests: number;
    total_price: string;
    status: string;
    created_at: string;
    room: {
        name: string;
        price_per_night: string;
    };
}

interface PageProps {
    booking: Booking;
}

export default function BookingShow({ booking }: PageProps) {
    const handleStatusChange = (status: string) => {
        router.put(update(booking.id).url, { status });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this booking?')) {
            router.delete(destroy(booking.id).url);
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Bookings', href: index().url },
            { title: `Booking #${booking.id}`, href: '' }
        ]}>
            <Head title={`Booking #${booking.id}`} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => router.get(index().url)} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Bookings
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete Booking
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Guest Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="text-sm font-medium">Full Name</div>
                                        <div>{booking.name}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="text-sm font-medium">Email Address</div>
                                        <div>{booking.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="text-sm font-medium">Phone Number</div>
                                        <div>{booking.phone || 'Not provided'}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Stay Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex items-center gap-3">
                                        <Home className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <div className="text-sm font-medium">Room</div>
                                            <div>{booking.room.name}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <div className="text-sm font-medium">Guests</div>
                                            <div>{booking.guests} Guests</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <div className="text-sm font-medium">Check-in</div>
                                            <div>{new Date(booking.check_in).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <div className="text-sm font-medium">Check-out</div>
                                            <div>{new Date(booking.check_out).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Booking Status</CardTitle>
                                <CardDescription>Update the current status of this reservation.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Select defaultValue={booking.status} onValueChange={handleStatusChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Financial Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <span className="text-muted-foreground">Rate per night</span>
                                    <span>R {booking.room.price_per_night}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <span className="font-semibold">Total Price</span>
                                    <span className="text-lg font-bold text-primary">R {booking.total_price}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
