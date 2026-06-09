import { Form } from '@inertiajs/react';
import { CalendarCheck, LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { store as bookingStore } from '@/routes/bookings';
import type { RoomItem } from '@/types/data';

interface BookingFormProps {
    selectedRoom: RoomItem;
    checkIn: string;
    checkOut: string;
}

export default function BookingForm({
    selectedRoom,
    checkIn,
    checkOut,
}: BookingFormProps) {
    return (
        <Form {...bookingStore.form()} className="space-y-4">
            {({ processing, errors }) => (
                <>
                    <input
                        type="hidden"
                        name="room_id"
                        value={selectedRoom.id}
                    />
                    <input type="hidden" name="check_in" value={checkIn} />
                    <input type="hidden" name="check_out" value={checkOut} />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Your Name</Label>
                            <Input
                                id="name"
                                name="name"
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
                                placeholder="john@example.com"
                                required
                            />
                            <InputError message={errors.email} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="phone">
                                Phone Number (Optional)
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
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
                                defaultValue={1}
                                min="1"
                                max={selectedRoom.maxGuests}
                                required
                            />
                            <InputError message={errors.guests} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="notes">
                            Dietary Needs or Questions (Optional)
                        </Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            placeholder="Let us know about any dietary requirements, allergies, or special requests..."
                            rows={6}
                            className={`min-h-30`}
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
                        <span>
                            {processing
                                ? 'Processing...'
                                : 'Submit Booking Request'}
                        </span>
                    </Button>
                </>
            )}
        </Form>
    );
}
