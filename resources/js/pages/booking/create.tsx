import { Form, Head, usePage } from '@inertiajs/react';
import { CalendarCheck, LoaderCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import placeholderRoom from '@/../images/placeholder-room.png';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import InputError from '@/components/input-error';
import MainWrapper from '@/layouts/main/main-wrapper';
import MainLayout from '@/layouts/main-layout';
import { store as bookingStore } from '@/routes/bookings';
import type { RoomItem } from '@/types/data';

interface BookingCreatePageProps {
    rooms: RoomItem[];
    preselectedRoomId: number | null;
}

export default function BookingCreate() {
    const { rooms, preselectedRoomId } = usePage<BookingCreatePageProps>().props;
    const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(
        rooms.find((r) => r.id === preselectedRoomId) ?? null,
    );

    useEffect(() => {
        document.title = 'Book a Room | The New Garden Shed';
    }, []);

    return (
        <>
            <Head title="Book a Room" />
            <MainWrapper className="py-12">
                <div className="mb-10">
                    <h1 className="font-serif text-3xl font-light text-foreground sm:text-4xl">
                        Book a Room
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Select a room and fill in your details to submit a booking request.
                    </p>
                </div>

                <section className="mb-12">
                    <h2 className="mb-6 font-serif text-xl font-normal text-foreground">
                        Select a Room
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {rooms.map((room) => (
                            <Card
                                key={room.id}
                                className={`cursor-pointer overflow-hidden py-0 transition-all duration-200 hover:shadow-lg ${
                                    selectedRoom?.id === room.id
                                        ? 'ring-2 ring-primary ring-offset-2'
                                        : 'ring-1 ring-transparent hover:ring-1 hover:ring-border'
                                }`}
                                onClick={() => setSelectedRoom(room)}
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={room.cardImage ?? room.thumbnail ?? placeholderRoom}
                                        alt={room.name}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <Badge className="rounded-md border-border bg-background/80 px-2.5 py-1 text-[10px] font-bold tracking-wider text-foreground uppercase shadow-sm backdrop-blur-md">
                                            {room.type} Suite
                                        </Badge>
                                    </div>
                                    <div className="absolute right-3 bottom-3 rounded-lg border border-border bg-card/90 px-3 py-1.5 text-base font-semibold text-primary shadow-sm backdrop-blur-md">
                                        R {room.pricePerNight}{' '}
                                        <span className="text-xs font-normal text-muted-foreground">/ night</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-serif text-lg font-normal text-foreground">
                                        {room.name}
                                    </h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Up to {room.capacity} guests • {room.bedType}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="mb-6 font-serif text-xl font-normal text-foreground">
                        Your Details
                    </h2>
                    {selectedRoom ? (
                        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                            <div className="mb-6 flex items-center gap-4 border-b border-border pb-4">
                                <img
                                    src={selectedRoom.cardImage ?? selectedRoom.thumbnail ?? placeholderRoom}
                                    alt={selectedRoom.name}
                                    className="h-16 w-24 rounded-lg object-cover"
                                />
                                <div>
                                    <p className="font-serif text-lg font-medium text-foreground">
                                        {selectedRoom.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        R {selectedRoom.pricePerNight} / night • Up to {selectedRoom.maxGuests} guests
                                    </p>
                                </div>
                            </div>

                            <Form
                                {...bookingStore.form()}
                                data={{
                                    room_id: selectedRoom.id,
                                    name: '',
                                    email: '',
                                    phone: '',
                                    guests: 1,
                                    check_in: '',
                                    check_out: '',
                                    notes: '',
                                }}
                                className="space-y-4"
                            >
                                {({ processing, errors, data, setData }) => (
                                    <>
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
                                                    max={selectedRoom.maxGuests}
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

                                        <div className="space-y-1.5">
                                            <Label htmlFor="notes">Dietary Needs or Questions (Optional)</Label>
                                            <Textarea
                                                id="notes"
                                                name="notes"
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                placeholder="Let us know about any dietary requirements, allergies, or special requests..."
                                                rows={3}
                                            />
                                            <InputError message={errors.notes} />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-6 text-xs font-semibold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary/90 disabled:opacity-60"
                                        >
                                            {processing ? (
                                                <LoaderCircle size={14} className="animate-spin" />
                                            ) : (
                                                <CalendarCheck size={14} />
                                            )}
                                            <span>{processing ? 'Processing...' : 'Submit Booking Request'}</span>
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-border bg-muted/50 p-12 text-center">
                            <p className="text-sm text-muted-foreground">
                                Select a room above to start your booking.
                            </p>
                        </div>
                    )}
                </section>
            </MainWrapper>
        </>
    );
}

BookingCreate.displayName = 'BookingCreate';

BookingCreate.layout = (page: any) => <MainLayout>{page}</MainLayout>;
