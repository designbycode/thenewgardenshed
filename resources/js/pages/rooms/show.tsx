import { Form, Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Bath,
    BedDouble,
    CalendarCheck,
    Check,
    ChevronRight,
    ShieldCheck,
    Sparkles,
    Users,
    LoaderCircle,
    CheckCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import placeholderRoom from '@/../images/placeholder-room.png';
import RoomImageCarousel from '@/components/rooms/room-image-carousel';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import MainWrapper from '@/layouts/main/main-wrapper';
import MainLayout from '@/layouts/main-layout';
import { cn } from '@/lib/utils';
import contactUs from '@/routes/contact-us';
import { index as roomsIndex } from '@/routes/rooms';
import { store as bookingStore } from '@/routes/bookings';
import type { RoomItem } from '@/types/data';

interface PageProps {
    room: RoomItem;
    flash: {
        booking_success?: string;
    };
}

export default function RoomsShow({ room }: PageProps) {
    const { flash } = usePage<PageProps>().props;
    const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(!!flash?.booking_success);

    useEffect(() => {
        if (flash?.booking_success) {
            setSuccessDialogOpen(true);
            setBookingDialogOpen(false);
        }
    }, [flash]);

    useEffect(() => {
        document.title = `${room.name} | The New Garden Shed`;
        const meta = document.querySelector('meta[name="description"]');
        if (meta) {
            meta.setAttribute('content', room.shortDescription);
        }
    }, [room]);

    return (
        <>
            <Head title={room.name}></Head>
            <motion.div
                className={`py-6`}
                key="rooms-show-page"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <MainWrapper>
                    <div className="mb-8 flex items-center gap-2 font-mono text-xs tracking-widest text-primary uppercase">
                        <Link
                            href={roomsIndex()}
                            className="flex cursor-pointer items-center gap-1.5 border-none bg-transparent font-semibold text-foreground transition-colors hover:text-primary"
                        >
                            <ArrowLeft size={14} className="-mt-px" />
                            <span>Back to Our Rooms</span>
                        </Link>
                        <ChevronRight size={12} className="text-foreground" />
                        <span className="max-w-50 truncate font-medium text-foreground sm:max-w-none">
                            {room.name}
                        </span>
                    </div>

                    <div
                        className="grid grid-cols-1 gap-12 lg:grid-cols-12"
                        id="room-detail-container"
                    >
                        {/* LEFT COLUMN: Interactive Photo Gallery */}
                        <div className="space-y-4 lg:col-span-7">
                            {/* Expanded Active Photo Display */}
                            {room.media && room.media.length > 0 ? (
                                <RoomImageCarousel
                                    media={room.media}
                                    roomType={room.type}
                                />
                            ) : (
                                <div className="group relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted shadow-lg">
                                    <img
                                        src={room.imageUrl ?? placeholderRoom}
                                        alt={room.name}
                                        className="h-full w-full object-cover transition-all duration-700 select-none"
                                        referrerPolicy="no-referrer"
                                    />

                                    <div className="absolute top-4 left-4 z-10">
                                        <Badge className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold tracking-wider text-foreground capitalize">
                                            {room.type} Suite
                                        </Badge>
                                    </div>
                                </div>
                            )}

                            {/* Quick trust assurances */}
                            <div className="space-y-3.5 rounded-2xl border border-border bg-card p-5 transition-colors">
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <ShieldCheck
                                        className="text-primary"
                                        size={18}
                                    />
                                    <span>
                                        Exceptional Retreat Cleanliness
                                        Standards
                                    </span>
                                </div>
                                <p className="text-xs leading-relaxed text-muted-foreground">
                                    Sleep at The Garden Shed adheres strictly to
                                    ultra-hygiene hospitality check sheets. All
                                    duvets, cotton wraps, bathroom amenities,
                                    and hard contact points undergo fresh steam
                                    scrubbing and deep cleaning sanitization
                                    processes between and prior to every
                                    arrival.
                                </p>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Summary and Interactive Details */}
                        <div className="flex flex-col justify-between space-y-8 lg:col-span-5">
                            <div className="space-y-6">
                                {/* Heading */}
                                <div>
                                    <div className="mb-1.5 flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider text-primary uppercase">
                                        <Sparkles size={13} />
                                        <span>Luxurious Country Living</span>
                                    </div>
                                    <h1 className="font-serif text-3xl font-light text-foreground sm:text-4xl">
                                        {room.name}
                                    </h1>

                                    {/* Price Display card */}
                                    <div className="mt-4 flex w-fit items-baseline gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-foreground">
                                        <span className="mr-1 border-r border-primary/30 pr-3 font-mono text-xs font-medium tracking-widest text-primary uppercase">
                                            Rate
                                        </span>
                                        <span className="font-serif text-2xl font-light text-primary">
                                            R {room.pricePerNight}
                                        </span>
                                        <span className="font-sans text-xs text-muted-foreground">
                                            ZAR / night
                                        </span>
                                    </div>
                                </div>

                                {/* Specs Bento-Grid Row */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1 rounded-xl border border-border bg-card p-3.5 text-center transition-colors">
                                        <BedDouble
                                            className="mx-auto text-primary"
                                            size={18}
                                        />
                                        <span className="block font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                                            Bed Setup
                                        </span>
                                        <span className="block truncate text-xs font-semibold text-card-foreground">
                                            {room.bedType}
                                        </span>
                                    </div>

                                    <div className="space-y-1 rounded-xl border border-border bg-card p-3.5 text-center transition-colors">
                                        <Bath
                                            className="mx-auto text-primary"
                                            size={18}
                                        />
                                        <span className="block font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                                            Bathroom
                                        </span>
                                        <span className="block truncate text-xs font-semibold text-card-foreground">
                                            {room.type === 'luxury'
                                                ? 'Tub & Rain'
                                                : 'Rain Shower'}
                                        </span>
                                    </div>

                                    <div className="space-y-1 rounded-xl border border-border bg-card p-3.5 text-center transition-colors">
                                        <Users
                                            className="mx-auto text-primary"
                                            size={18}
                                        />
                                        <span className="block font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                                            Capacity
                                        </span>
                                        <span className="block truncate text-xs font-semibold text-card-foreground">
                                            Up to {room.capacity} Pax
                                        </span>
                                    </div>
                                </div>

                                {/* Full Detailed Description */}
                                <div className="space-y-2">
                                    <span className="block font-mono text-[10px] font-semibold tracking-widest text-primary uppercase">
                                        Suite Overview & Experience
                                    </span>
                                    <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                                        {room.description}
                                    </p>
                                    <p className="border-l-2 border-primary/40 pl-3 text-xs leading-relaxed text-muted-foreground italic">
                                        "{room.shortDescription}"
                                    </p>
                                </div>

                                {/* Complete Suite Amenities List with Checks */}
                                <div className="space-y-3.5 pt-2">
                                    <span className="block font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                                        Included In-Room Amenities:
                                    </span>
                                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                        {room.amenities?.map((amenity, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs font-medium text-muted-foreground"
                                            >
                                                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10">
                                                    <Check
                                                        size={10}
                                                        className="text-primary"
                                                        strokeWidth={3.5}
                                                    />
                                                </div>
                                                <span className="truncate">
                                                    {amenity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Direct CTA Block */}
                            <div className="mt-8 border-t border-border pt-6">
                                <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            className={cn(
                                                'flex w-full items-center justify-center gap-2 rounded-xl border-none bg-primary py-6 text-xs font-semibold tracking-widest text-primary-foreground uppercase shadow-lg shadow-primary/20 transition-all duration-300 hover:brightness-110 active:scale-[0.99] sm:text-sm',
                                            )}
                                        >
                                            <CalendarCheck size={16} />
                                            <span>
                                                Select & Book{' '}
                                                {room.name
                                                    .split(' ')
                                                    .slice(-2)
                                                    .join(' ')}
                                            </span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                                        <DialogHeader>
                                            <DialogTitle>Book Your Stay</DialogTitle>
                                            <DialogDescription>
                                                Fill out the form below to request a booking for {room.name}.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <Form
                                            {...bookingStore.form()}
                                            data={{ room_id: room.id, guests: 1, name: '', email: '', phone: '', check_in: '', check_out: '' }}
                                            className="space-y-4 pt-4"
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
                                                                max={room.maxGuests}
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
                                                        className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-6 text-xs font-semibold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary/90 disabled:opacity-60"
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
                                    </DialogContent>
                                </Dialog>

                                <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                                <CheckCircle size={32} className="text-primary" />
                                            </div>
                                            <DialogTitle className="text-center text-xl">Booking Requested!</DialogTitle>
                                            <DialogDescription className="text-center">
                                                {flash?.booking_success || 'Your booking request has been submitted successfully. We will contact you shortly.'}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Button
                                            onClick={() => setSuccessDialogOpen(false)}
                                            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-5.5 text-xs font-semibold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary/90"
                                        >
                                            <span>Close</span>
                                        </Button>
                                    </DialogContent>
                                </Dialog>

                                <span className="mt-2.5 block text-center font-sans text-[10px] text-muted-foreground">
                                    No immediate payment required. Secure
                                    booking estimate submitted instantly.
                                </span>
                            </div>
                        </div>
                    </div>
                </MainWrapper>
            </motion.div>
        </>
    );
}

RoomsShow.displayName = 'RoomsShow';

RoomsShow.layout = (page: any) => <MainLayout>{page}</MainLayout>;
