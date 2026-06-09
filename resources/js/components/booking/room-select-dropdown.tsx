import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import placeholderRoom from '@/../images/placeholder-room.png';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { RoomItem } from '@/types/data';

interface RoomSelectDropdownProps {
    rooms: RoomItem[];
    selectedRoom: RoomItem | null;
    onSelectRoom: (room: RoomItem) => void;
}

export default function RoomSelectDropdown({
    rooms,
    selectedRoom,
    onSelectRoom,
}: RoomSelectDropdownProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="space-y-1.5 max-w-md">
            <Label htmlFor="room_select" className="text-sm font-medium text-foreground">
                Room Name
            </Label>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <button
                        type="button"
                        id="room_select"
                        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none text-left focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 cursor-pointer"
                    >
                        <span className={selectedRoom ? 'text-foreground' : 'text-muted-foreground'}>
                            {selectedRoom ? selectedRoom.name : 'Choose a room...'}
                        </span>
                        <ChevronDown size={16} className="text-muted-foreground shrink-0 ml-2" />
                    </button>
                </DialogTrigger>
                <DialogContent className="max-w-7xl! max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-2xl font-light text-foreground">
                            Select a Room
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm">
                            Browse our suites and choose the perfect one for your stay.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 py-4">
                        {rooms.map((room) => (
                            <Card
                                key={room.id}
                                className={`cursor-pointer overflow-hidden py-0 transition-all duration-200 hover:shadow-lg ${selectedRoom?.id === room.id
                                    ? 'ring-2 ring-primary ring-offset-2'
                                    : 'ring-1 ring-transparent hover:ring-1 hover:ring-border'
                                    }`}
                                onClick={() => {
                                    onSelectRoom(room);
                                    setIsDialogOpen(false);
                                }}
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={
                                            room.cardImage ??
                                            room.thumbnail ??
                                            placeholderRoom
                                        }
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
                                        <span className="text-xs font-normal text-muted-foreground">
                                            / night
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-serif text-lg font-normal text-foreground">
                                        {room.name}
                                    </h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Up to {room.capacity} guests •{' '}
                                        {room.bedType}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
