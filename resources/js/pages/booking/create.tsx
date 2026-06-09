import type { PageProps } from '@inertiajs/core';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import BookingForm from '@/components/booking/booking-form';
import BookingPreview from '@/components/booking/booking-preview';
import DateRangePickerCalendar from '@/components/booking/date-range-picker-calendar';
import RoomSelectDropdown from '@/components/booking/room-select-dropdown';
import HeadingBlock from '@/components/typography/heading-block';
import roomsRoute from '@/routes/rooms';
import bookingRoute from '@/routes/booking';
import MainWrapper from '@/layouts/main/main-wrapper';
import MainLayout from '@/layouts/main-layout';
import type { RoomItem } from '@/types/data';

interface BookingCreatePageProps extends PageProps {
    rooms: RoomItem[];
    preselectedRoomId: number | null;
    flash: {
        toast: { type: 'success' | 'error' | 'info'; message: string } | null;
        booking_success?: string | null;
        booked_details?: {
            id: number;
            room_name: string;
            room_type: string;
            check_in: string;
            check_out: string;
            nights: number;
            total_price: number;
            name: string;
            email: string;
            guests: number;
        } | null;
    };
}

export default function BookingCreate() {
    const {
        rooms,
        preselectedRoomId,
        errors: pageErrors,
        flash,
    } = usePage<BookingCreatePageProps>().props;
    const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(
        rooms.find((r) => r.id === preselectedRoomId) ?? null,
    );
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    let nights = 0;
    let totalCost = 0;

    if (checkIn && checkOut && selectedRoom) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const timeDiff = end.getTime() - start.getTime();

        if (timeDiff > 0) {
            nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
            totalCost = nights * selectedRoom.pricePerNight;
        }
    }

    const formatDate = (dateStr: string) => {
        if (!dateStr) {
            return '';
        }

        const d = new Date(dateStr);

        return d.toLocaleDateString('en-ZA', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleDateSelect = (start: string, end: string) => {
        setCheckIn(start);
        setCheckOut(end);
    };

    return (
        <>
            <Head title="Book a Room" />
            <MainWrapper className="py-12">
                {flash?.booking_success && flash?.booked_details ? (
                    <div className="mx-auto max-w-2xl py-8 text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="rounded-full bg-primary/10 p-4 text-primary">
                                <Calendar className="h-12 w-12" />
                            </div>
                        </div>

                        <HeadingBlock
                            heading="Thank You!"
                            headingLevel={1}
                            description="Your booking request has been submitted successfully."
                            className="text-center"
                        />

                        <div className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-6 text-left shadow-md sm:p-8">
                            <h3 className="border-b border-border pb-4 font-serif text-lg font-medium">
                                Booking Summary
                            </h3>

                            <div className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2">
                                <div>
                                    <span className="text-xs tracking-wider text-muted-foreground uppercase">
                                        Room
                                    </span>
                                    <p className="mt-0.5 font-serif text-base font-medium text-foreground">
                                        {flash.booked_details.room_name}
                                    </p>
                                    <p className="text-xs text-muted-foreground capitalize">
                                        {flash.booked_details.room_type} Suite
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs tracking-wider text-muted-foreground uppercase">
                                        Guests
                                    </span>
                                    <p className="mt-0.5 font-medium text-foreground">
                                        {flash.booked_details.guests}{' '}
                                        {flash.booked_details.guests === 1
                                            ? 'Guest'
                                            : 'Guests'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs tracking-wider text-muted-foreground uppercase">
                                        Check-in
                                    </span>
                                    <p className="mt-0.5 font-medium text-foreground">
                                        {formatDate(
                                            flash.booked_details.check_in,
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs tracking-wider text-muted-foreground uppercase">
                                        Check-out
                                    </span>
                                    <p className="mt-0.5 font-medium text-foreground">
                                        {formatDate(
                                            flash.booked_details.check_out,
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs tracking-wider text-muted-foreground uppercase">
                                        Duration
                                    </span>
                                    <p className="mt-0.5 font-medium text-foreground">
                                        {flash.booked_details.nights}{' '}
                                        {flash.booked_details.nights === 1
                                            ? 'night'
                                            : 'nights'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs tracking-wider text-muted-foreground uppercase">
                                        Total Estimate
                                    </span>
                                    <p className="mt-0.5 font-serif text-2xl font-bold text-primary">
                                        R{' '}
                                        {flash.booked_details.total_price.toLocaleString(
                                            'en-ZA',
                                            { minimumFractionDigits: 2 },
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-border/50 bg-muted/50 p-4 text-xs text-muted-foreground">
                                <p className="leading-relaxed">
                                    We have received the request for{' '}
                                    <strong>{flash.booked_details.name}</strong>{' '}
                                    ({flash.booked_details.email}). A team
                                    member will review your request and contact
                                    you shortly to confirm availability and
                                    finalize details.
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                prefetch={true}
                                href={roomsRoute.index()}
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold tracking-wide text-primary-foreground shadow transition-colors hover:bg-primary/90"
                            >
                                Browse Other Rooms
                            </Link>
                            <Link
                                prefetch={true}
                                href={bookingRoute.create()}
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-semibold tracking-wide text-foreground shadow-sm transition-colors hover:bg-muted"
                            >
                                Make Another Booking
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
                        {/* Left column: forms and main headings */}
                        <div className="space-y-12 lg:col-span-2">
                            <HeadingBlock
                                badge={{
                                    text: 'Booking',
                                    icon: Calendar,
                                }}
                                heading="Book a Room"
                                headingLevel={1}
                                description="Select a room and fill in your details to submit a booking request."
                            />

                            <section>
                                <h2 className="mb-6 font-serif text-xl font-normal text-foreground">
                                    Select a Room
                                </h2>
                                <RoomSelectDropdown
                                    rooms={rooms}
                                    selectedRoom={selectedRoom}
                                    onSelectRoom={setSelectedRoom}
                                />
                            </section>

                            {selectedRoom ? (
                                <>
                                    <DateRangePickerCalendar
                                        checkIn={checkIn}
                                        checkOut={checkOut}
                                        selectedRoom={selectedRoom}
                                        pageErrors={pageErrors}
                                        formatDate={formatDate}
                                        nights={nights}
                                        onDateSelect={handleDateSelect}
                                    />

                                    <div>
                                        <h2 className="mb-6 font-serif text-xl font-normal text-foreground">
                                            Your Details
                                        </h2>
                                        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                                            <BookingForm
                                                selectedRoom={selectedRoom}
                                                checkIn={checkIn}
                                                checkOut={checkOut}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-border bg-muted/50 p-12 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        Please select a room above to configure
                                        check-in/check-out dates and fill in
                                        your details.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right column: sticky preview or placeholder */}
                        <div className="space-y-6 lg:sticky lg:top-36">
                            {selectedRoom ? (
                                <BookingPreview
                                    selectedRoom={selectedRoom}
                                    checkIn={checkIn}
                                    checkOut={checkOut}
                                    nights={nights}
                                    totalCost={totalCost}
                                    formatDate={formatDate}
                                />
                            ) : (
                                <div className="overflow-hidden rounded-2xl border border-border bg-card/60 shadow-sm">
                                    <div className="relative flex aspect-16/10 flex-col items-center justify-center border-b border-border bg-muted/40 text-muted-foreground">
                                        <span className="font-serif text-base font-light">
                                            No Room Selected
                                        </span>
                                    </div>
                                    <div className="p-6 text-center text-muted-foreground">
                                        <p className="text-sm">
                                            Choose a room from the selector on
                                            the left to see room details, rates,
                                            and stay summary.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </MainWrapper>
        </>
    );
}

BookingCreate.displayName = 'BookingCreate';

BookingCreate.layout = (page: any) => <MainLayout>{page}</MainLayout>;
