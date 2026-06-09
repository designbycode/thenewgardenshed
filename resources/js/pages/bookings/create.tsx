import { Form, Head, usePage } from '@inertiajs/react';
import {
    CalendarCheck,
    CheckCircle,
    LoaderCircle,
    ArrowLeft,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import HeadingBlock from '@/components/typography/heading-block';
import MainWrapper from '@/layouts/main/main-wrapper';
import MainLayout from '@/layouts/main-layout';
import { store } from '@/routes/bookings';
import { create } from '@/routes/bookings/create';

interface Room {
    id: number;
    name: string;
    price_per_night: number;
    max_guests: number;
}

interface PageProps {
    rooms: Room[];
    selected_room_id?: number;
    flash: {
        booking_success?: string;
    };
}

export default function BookingCreate({ rooms, selected_room_id, flash }: PageProps) {
    const [successDialogOpen, setSuccessDialogOpen] = useState(!!flash?.booking_success);

    useEffect(() => {
        if (flash?.booking_success) {
            setSuccessDialogOpen(true);
        }
    }, [flash]);

    return (
        <MainWrapper className="py-18">
            <HeadingBlock
                className="mx-auto text-center"
                badge={{ text: 'Plan Your Stay', icon: CalendarCheck }}
                heading="Make a Booking"
                headingLevel={1}
                description={
                    <>
                        Ready for a peaceful retreat? Fill out the form below
                        to request your stay at The Garden Shed.
                    </>
                }
            />

            <div className="mx-auto max-w-2xl">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-md sm:p-8">
                    <Form
                        {...store.form()}
                        data={{
                            room_id: selected_room_id || (rooms.length > 0 ? rooms[0].id : 0),
                            guests: 1,
                            name: '',
                            email: '',
                            phone: '',
                            check_in: '',
                            check_out: '',
                        }}
                        className="space-y-6"
                        resetOnSuccess
                    >
                        {({ processing, errors, data, setData }) => (
                            <>
                                <div className="space-y-1.5">
                                    <Label htmlFor="room_id">Select Room</Label>
                                    <Select
                                        defaultValue={String(data.room_id)}
                                        onValueChange={(val) => setData('room_id', parseInt(val))}
                                    >
                                        <SelectTrigger id="room_id">
                                            <SelectValue placeholder="Select a room" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rooms.map((room) => (
                                                <SelectItem key={room.id} value={String(room.id)}>
                                                    {room.name} (R {room.price_per_night} / night)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.room_id} />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name">Your Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="John Doe"
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="john@example.com"
                                            required
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="+27 12 345 6789"
                                        />
                                        <InputError message={errors.phone} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="guests">Number of Guests</Label>
                                        <Input
                                            type="number"
                                            id="guests"
                                            name="guests"
                                            value={data.guests}
                                            onChange={(e) => setData('guests', parseInt(e.target.value) || 0)}
                                            min="1"
                                            max={rooms.find(r => r.id === data.room_id)?.max_guests || 10}
                                            required
                                        />
                                        <InputError message={errors.guests} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="check_in">Check-in Date</Label>
                                        <Input
                                            type="date"
                                            id="check_in"
                                            name="check_in"
                                            value={data.check_in}
                                            onChange={(e) => setData('check_in', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.check_in} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="check_out">Check-out Date</Label>
                                        <Input
                                            type="date"
                                            id="check_out"
                                            name="check_out"
                                            value={data.check_out}
                                            onChange={(e) => setData('check_out', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.check_out} />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-6 text-xs font-semibold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary/90 disabled:opacity-60"
                                >
                                    {processing ? (
                                        <LoaderCircle size={14} className="animate-spin" />
                                    ) : (
                                        <CalendarCheck size={14} />
                                    )}
                                    <span>{processing ? 'Processing...' : 'Request Booking'}</span>
                                </Button>
                            </>
                        )}
                    </Form>
                </div>
            </div>

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
                            Booking Requested!
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            {flash?.booking_success ||
                                'Your booking request has been submitted successfully. We will contact you shortly.'}
                        </DialogDescription>
                    </DialogHeader>
                    <Button
                        onClick={() => {
                            setSuccessDialogOpen(false);
                            window.location.href = create.url();
                        }}
                        className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-5.5 text-xs font-semibold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary/90"
                    >
                        <span>Done</span>
                    </Button>
                </DialogContent>
            </Dialog>
        </MainWrapper>
    );
}

BookingCreate.displayName = 'BookingCreate';

BookingCreate.layout = (page: any) => (
    <MainLayout
        title={'Make a Booking | The New Garden Shed'}
        description={
            'Request your stay at The Garden Shed. Select your room and dates to begin your retreat.'
        }
    >
        {page}
    </MainLayout>
);
