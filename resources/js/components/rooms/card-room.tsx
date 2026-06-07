import { Link } from '@inertiajs/react';
import { ArrowRight, Bath, BedDouble, Eye, ShieldCheck, Users } from 'lucide-react';
import placeholderRoom from '@/../images/placeholder-room.png';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import rooms from '@/routes/rooms';
import type { RoomItem } from '@/types/data';

export default function CardRoom({ room }: { room: RoomItem }) {
    return (
        <Card className="group flex h-full flex-col overflow-hidden py-0 transition-all duration-500">
            {/* Image with Badge and Hover effect */}
            <Link
                prefetch={`hover`}
                href={rooms.show(room).url}
                className="relative aspect-video overflow-hidden"
            >
                <img
                    src={room.cardImage ?? room.thumbnail ?? placeholderRoom}
                    alt={room.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Subtle Image Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100">
                    <div className="flex translate-y-2 transform items-center gap-1.5 rounded-xl bg-background px-4 py-2 text-xs font-semibold tracking-wider text-foreground uppercase shadow-lg transition-all duration-300 group-hover:translate-y-0">
                        <Eye size={13} className="text-primary" />
                        <span>View Room</span>
                    </div>
                </div>

                {/* Style badge */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                    <Badge className="rounded-md border-border bg-background/80 px-2.5 py-1 text-[10px] font-bold tracking-wider text-foreground uppercase shadow-sm backdrop-blur-md select-none">
                        {room.type} Suite
                    </Badge>
                </div>

                {/* Direct price tag absolute overlay */}
                <div className="absolute right-4 bottom-4 rounded-lg border border-border bg-card/90 px-3.5 py-1.5 text-base font-semibold text-primary shadow-sm backdrop-blur-md">
                    R {room.pricePerNight}{' '}
                    <span className="text-xs font-normal text-muted-foreground">
                        / night
                    </span>
                </div>
            </Link>

            {/* Card Body */}
            <CardHeader className="flex-1 bg-transparent p-5 pb-0">
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <ShieldCheck size={14} />
                        <span>Breakfast Included</span>
                    </div>
                </div>
                <Link prefetch={`hover`} href={rooms.show(room).url}>
                    <h3 className="font-serif text-xl font-normal text-foreground transition-colors group-hover:text-primary">
                        {room.name}
                    </h3>
                </Link>

                <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {room.description}
                </p>
            </CardHeader>

            {/* Specs icons footer */}
            <CardContent className="mt-4 border-t border-border bg-muted px-5 pb-1">
                <div className="flex justify-evenly gap-2 py-2 text-xs font-medium text-muted-foreground sm:text-xs">
                    <div className="flex items-center gap-1.5 text-center">
                        <BedDouble
                            size={14}
                            className="shrink-0 text-primary"
                        />
                        <span className="truncate">{room.bedType}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-center">
                        <Bath size={14} className="shrink-0 text-primary" />
                        <span className="truncate">
                            {room.type === 'luxury'
                                ? 'Bath & Shower'
                                : 'Shower'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-center">
                        <Users size={14} className="shrink-0 text-primary" />
                        <span>Sleeps {room.capacity}</span>
                    </div>
                </div>
            </CardContent>

            {/* Book Now Button */}
            <CardFooter className="bg-transparent p-5">
                <Button
                    variant={`outline`}
                    size={`lg`}
                    className="flex w-full space-x-1.5"
                >
                    <Link
                        prefetch={`hover`}
                        className="flex items-center space-x-1.5"
                        href={rooms.show(room).url}
                    >
                        <span>Select & Book Stay</span>
                        <ArrowRight size={14} />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
