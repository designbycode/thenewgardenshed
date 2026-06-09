import placeholderRoom from '@/../images/placeholder-room.png';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { RoomItem } from '@/types/data';

interface BookingPreviewProps {
    selectedRoom: RoomItem;
    checkIn: string;
    checkOut: string;
    nights: number;
    totalCost: number;
    formatDate: (dateStr: string) => string;
}

export default function BookingPreview({
    selectedRoom,
    checkIn,
    checkOut,
    nights,
    totalCost,
    formatDate,
}: BookingPreviewProps) {
    return (
        <Card className="overflow-hidden border border-border bg-card pt-0 shadow-md">
            <div className="relative aspect-[16/10] overflow-hidden">
                <img
                    src={
                        selectedRoom.cardImage ??
                        selectedRoom.thumbnail ??
                        placeholderRoom
                    }
                    alt={selectedRoom.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                    <Badge className="mb-2 border-none bg-primary text-[10px] font-bold tracking-wider text-primary-foreground uppercase">
                        {selectedRoom.type} Suite
                    </Badge>
                    <h3 className="font-serif text-xl font-medium tracking-wide">
                        {selectedRoom.name}
                    </h3>
                </div>
            </div>
            <div className="space-y-3 p-6">
                <div className="flex items-center justify-between border-b border-border pb-4 text-sm text-muted-foreground">
                    <span>Capacity</span>
                    <span className="font-medium text-foreground">
                        Up to {selectedRoom.maxGuests} Guests
                    </span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-4 text-sm text-muted-foreground">
                    <span>Bed Type</span>
                    <span className="font-medium text-foreground">
                        {selectedRoom.bedType}
                    </span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-4 text-sm text-muted-foreground">
                    <span>Price / Night</span>
                    <span className="font-semibold text-foreground">
                        R {selectedRoom.pricePerNight}
                    </span>
                </div>

                {nights > 0 ? (
                    <div className="space-y-3 pt-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Check-in</span>
                            <span className="font-medium text-foreground">
                                {formatDate(checkIn)}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Check-out</span>
                            <span className="font-medium text-foreground">
                                {formatDate(checkOut)}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-4 text-xs text-muted-foreground">
                            <span>Duration</span>
                            <span className="font-medium text-foreground">
                                {nights} {nights === 1 ? 'night' : 'nights'}
                            </span>
                        </div>

                        <div className="flex items-end justify-between pt-2">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Total Price
                                </p>
                                <p className="text-xs text-muted-foreground/60">
                                    (Incl. all taxes)
                                </p>
                            </div>
                            <span className="font-serif text-2xl font-bold text-primary">
                                R{' '}
                                {totalCost.toLocaleString('en-ZA', {
                                    minimumFractionDigits: 2,
                                })}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-center">
                        <p className="text-xs text-muted-foreground">
                            Select check-in & check-out dates to calculate
                            duration and total price.
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
}
