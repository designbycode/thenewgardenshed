import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Sparkles, AlertCircle, CheckCircle, Percent, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import { index } from '@/routes/admin/bookings';
import DateRangePickerCalendar from '@/components/booking/date-range-picker-calendar';

interface BookingData {
    check_in: string;
    check_out: string;
}

interface RoomItem {
    id: number;
    slug: string;
    name: string;
    type: string;
    pricePerNight: number;
    capacity: number;
    maxGuests: number;
    bedType: string;
    thumbnail: string | null;
    cardImage: string | null;
    bookings: BookingData[];
}

interface PageProps {
    rooms: RoomItem[];
    preselectedRoomId: number | null;
}

export default function BookingCreate({ rooms, preselectedRoomId }: PageProps) {
    const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(
        rooms.find((r) => r.id === preselectedRoomId) ?? null
    );
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

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

    const { data, setData, post, processing, errors } = useForm({
        room_id: preselectedRoomId || '',
        name: '',
        email: '',
        phone: '',
        check_in: '',
        check_out: '',
        guests: 1,
        notes: '',
        discount_type: null as 'fixed' | 'percentage' | null,
        discount_value: 0,
    });

    // Handle date changes
    useEffect(() => {
        setData((prev) => ({
            ...prev,
            check_in: checkIn,
            check_out: checkOut,
        }));
    }, [checkIn, checkOut]);

    // Handle room selection change
    const handleRoomSelect = (room: RoomItem) => {
        setSelectedRoom(room);
        setData('room_id', room.id);
    };

    // Calculate nights
    let nights = 0;
    if (checkIn && checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const timeDiff = end.getTime() - start.getTime();
        if (timeDiff > 0) {
            nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        }
    }

    // Helper to check room availability for checkIn/checkOut
    const checkAvailability = (room: RoomItem, startStr: string, endStr: string) => {
        if (!startStr || !endStr) return { available: true };
        
        const hasOverlap = room.bookings.some((booking) => {
            return (
                (startStr >= booking.check_in && startStr < booking.check_out) ||
                (endStr > booking.check_in && endStr <= booking.check_out) ||
                (startStr <= booking.check_in && endStr >= booking.check_out)
            );
        });

        return { available: !hasOverlap };
    };

    // Recalculate prices
    const baseRate = selectedRoom ? selectedRoom.pricePerNight : 0;
    const originalTotal = nights * baseRate;
    let discountAmount = 0;

    if (data.discount_type === 'percentage' && data.discount_value > 0) {
        discountAmount = originalTotal * (data.discount_value / 100);
    } else if (data.discount_type === 'fixed' && data.discount_value > 0) {
        discountAmount = Math.min(data.discount_value, originalTotal);
    }

    const finalTotal = Math.max(0, originalTotal - discountAmount);

    // Filter available and premium upgrade rooms
    const getPremiumUpgrades = () => {
        if (!selectedRoom || !checkIn || !checkOut) return [];

        return rooms
            .filter((room) => {
                // Must be a different room
                if (room.id === selectedRoom.id) return false;
                
                // Must be available
                const { available } = checkAvailability(room, checkIn, checkOut);
                if (!available) return false;

                // Must be premium (higher price or larger capacity)
                return room.pricePerNight > selectedRoom.pricePerNight || room.maxGuests > selectedRoom.maxGuests;
            })
            .sort((a, b) => a.pricePerNight - b.pricePerNight)
            .slice(0, 2); // Show top 2 suggestions
    };

    const premiumUpgrades = getPremiumUpgrades();

    // Submit form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/bookings');
    };

    return (
        <>
            <Head title="Create Booking" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild size="icon">
                        <Link href={index().url}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Create New Booking</h1>
                        <p className="text-sm text-muted-foreground">Log a telephone booking or create a reservation from the backend</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        {/* 1. Stay Configuration */}
                        <Card className="border border-border/80 shadow-xs">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Stay Dates
                                </CardTitle>
                                <CardDescription>Select the arrival and departure dates to check room availability.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="check_in">Check-in Date</Label>
                                        <Input
                                            id="check_in"
                                            type="text"
                                            value={checkIn ? formatDate(checkIn) : 'Not selected'}
                                            readOnly
                                            className="bg-muted/30 cursor-not-allowed font-medium"
                                        />
                                        {errors.check_in && <p className="text-xs text-destructive">{errors.check_in}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="check_out">Check-out Date</Label>
                                        <Input
                                            id="check_out"
                                            type="text"
                                            value={checkOut ? formatDate(checkOut) : 'Not selected'}
                                            readOnly
                                            className="bg-muted/30 cursor-not-allowed font-medium"
                                        />
                                        {errors.check_out && <p className="text-xs text-destructive">{errors.check_out}</p>}
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <DateRangePickerCalendar
                                        checkIn={checkIn}
                                        checkOut={checkOut}
                                        selectedRoom={selectedRoom as any}
                                        pageErrors={errors}
                                        formatDate={formatDate}
                                        nights={nights}
                                        onDateSelect={handleDateSelect}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Room Selection & Live Availability Grid */}
                        <Card className="border border-border/80 shadow-xs">
                            <CardHeader>
                                <CardTitle className="text-lg">Room Selection</CardTitle>
                                <CardDescription>
                                    {!checkIn || !checkOut 
                                        ? "Choose a room from our active catalog."
                                        : "See available rooms below for your selected stay window."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {rooms.map((room) => {
                                        const { available } = checkAvailability(room, checkIn, checkOut);
                                        const isSelected = selectedRoom?.id === room.id;

                                        return (
                                            <div
                                                key={room.id}
                                                onClick={() => available && handleRoomSelect(room)}
                                                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                                                    isSelected
                                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                        : !available
                                                        ? 'border-border bg-muted/40 opacity-60 cursor-not-allowed'
                                                        : 'border-border bg-card hover:border-foreground/20'
                                                }`}
                                            >
                                                <div>
                                                    <div className="flex justify-between items-start gap-2 mb-2">
                                                        <h4 className="font-medium text-foreground text-sm leading-snug">{room.name}</h4>
                                                        {checkIn && checkOut ? (
                                                            available ? (
                                                                <Badge className="bg-emerald-100 hover:bg-emerald-100 text-emerald-700 text-[10px] font-semibold border-emerald-200 py-0 px-2">
                                                                    Available
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="destructive" className="text-[10px] font-semibold py-0 px-2">
                                                                    Booked
                                                                </Badge>
                                                            )
                                                        ) : null}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground capitalize mb-3">
                                                        {room.type} Suite • Max {room.maxGuests} Guests
                                                    </p>
                                                </div>

                                                <div className="flex justify-between items-baseline mt-2 pt-2 border-t border-border/40">
                                                    <span className="text-xs text-muted-foreground">Price per night</span>
                                                    <span className="text-sm font-semibold text-foreground">R {room.pricePerNight}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {errors.room_id && <p className="text-xs text-destructive mt-2">{errors.room_id}</p>}
                            </CardContent>
                        </Card>

                        {/* 3. Guest Details */}
                        <Card className="border border-border/80 shadow-xs">
                            <CardHeader>
                                <CardTitle className="text-lg">Guest Information</CardTitle>
                                <CardDescription>Enter guest contact info and stay specifications.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Guest Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Jane Smith"
                                            required
                                        />
                                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="jane.smith@example.com"
                                            required
                                        />
                                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="+27 82 123 4567"
                                        />
                                        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="guests">Number of Guests</Label>
                                        <Input
                                            id="guests"
                                            type="number"
                                            min="1"
                                            max={selectedRoom?.maxGuests || 10}
                                            value={data.guests}
                                            onChange={(e) => setData('guests', parseInt(e.target.value))}
                                            required
                                        />
                                        {errors.guests && <p className="text-xs text-destructive">{errors.guests}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Dietary & Stay Notes (Optional)</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Allergies, preferences, special arrival requests..."
                                        rows={3}
                                    />
                                    {errors.notes && <p className="text-xs text-destructive">{errors.notes}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Sticky Summary & Upgrade Recommendations Column */}
                    <div className="space-y-6">
                        {/* 4. Financial Summary Card */}
                        <Card className="border border-border/80 shadow-md sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Booking Summary</CardTitle>
                                <CardDescription>Calculated pricing and breakdown details.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {selectedRoom ? (
                                    <div className="space-y-4">
                                        <div className="border-b pb-3 space-y-1">
                                            <p className="font-medium text-sm">{selectedRoom.name}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{selectedRoom.type} Suite</p>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Nightly Rate</span>
                                                <span>R {selectedRoom.pricePerNight.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Duration</span>
                                                <span>{nights} {nights === 1 ? 'night' : 'nights'}</span>
                                            </div>
                                            <div className="flex justify-between font-medium border-t border-border/40 pt-2">
                                                <span>Base Total</span>
                                                <span>R {originalTotal.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        {/* Discounts Manager */}
                                        <div className="space-y-3 pt-3 border-t border-border/40">
                                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Applied Discount</Label>
                                            <div className="flex gap-2">
                                                <Select value={data.discount_type ?? 'none'} onValueChange={(val: any) => setData('discount_type', val === 'none' ? null : val)}>
                                                    <SelectTrigger className="w-[120px] text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">None</SelectItem>
                                                        <SelectItem value="percentage">Percent (%)</SelectItem>
                                                        <SelectItem value="fixed">Fixed (R)</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                {data.discount_type && (
                                                    <div className="relative flex-1">
                                                        {data.discount_type === 'percentage' ? (
                                                            <Percent className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                                        ) : (
                                                            <span className="absolute left-2.5 top-2.5 text-xs text-muted-foreground font-semibold">R</span>
                                                        )}
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={data.discount_value}
                                                            onChange={(e) => setData('discount_value', Math.max(0, parseFloat(e.target.value) || 0))}
                                                            className="pl-8 text-xs h-9"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            {errors.discount_value && (
                                                <p className="text-xs text-destructive">{errors.discount_value}</p>
                                            )}

                                            {discountAmount > 0 && (
                                                <div className="flex justify-between text-xs text-green-600 font-medium bg-green-500/5 p-2 rounded-lg border border-green-500/10">
                                                    <span>Savings</span>
                                                    <span>- R {discountAmount.toFixed(2)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Final Price */}
                                        <div className="flex justify-between items-baseline pt-4 border-t border-border">
                                            <span className="font-semibold text-sm">Final Estimate</span>
                                            <span className="text-xl font-bold text-primary">R {finalTotal.toFixed(2)}</span>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={processing || !checkIn || !checkOut}
                                            className="w-full mt-4"
                                        >
                                            Create Booking
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-muted-foreground text-sm border border-dashed rounded-lg p-4 bg-muted/20">
                                        Please select a room and stay dates to review pricing.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 5. Experience / Premium Upgrade Suggestion box */}
                        {selectedRoom && checkIn && checkOut && premiumUpgrades.length > 0 && (
                            <Card className="border border-primary/20 bg-primary/5 shadow-xs">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-1.5 text-primary">
                                        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                                        Suggest Upgrade Experience
                                    </CardTitle>
                                    <CardDescription className="text-xs text-foreground/70">
                                        Recommend these premium alternatives available on the phone:
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {premiumUpgrades.map((room) => {
                                        const totalDiff = (room.pricePerNight - selectedRoom.pricePerNight) * nights;
                                        
                                        return (
                                            <div
                                                key={room.id}
                                                onClick={() => handleRoomSelect(room)}
                                                className="p-3 bg-card border border-border/80 rounded-lg cursor-pointer hover:border-primary/40 transition-all flex flex-col justify-between"
                                            >
                                                <div>
                                                    <div className="flex justify-between items-start gap-1">
                                                        <span className="font-medium text-xs text-foreground">{room.name}</span>
                                                        <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-none text-[9px] py-0 px-1.5 font-bold uppercase">
                                                            +{Math.round((room.pricePerNight / selectedRoom.pricePerNight - 1) * 100)}% Price
                                                        </Badge>
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground mt-1 capitalize leading-snug">
                                                        {room.type} Suite • Max {room.maxGuests} Guests • {room.bedType} Bed
                                                    </p>
                                                </div>
                                                <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/30">
                                                    <span className="text-[10px] text-muted-foreground">Total difference:</span>
                                                    <span className="text-xs font-semibold text-primary">+ R {totalDiff.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
}

BookingCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Bookings', href: index().url },
        { title: 'Create Booking' },
    ],
};
