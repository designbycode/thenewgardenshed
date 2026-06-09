import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, User, Home, Plus, Eye, CheckCircle2, Clock } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dashboard } from '@/routes';
import { index, show, create } from '@/routes/admin/bookings';

interface BookingItem {
    id: number;
    room_id: number;
    name: string;
    email: string;
    phone: string | null;
    check_in: string;
    check_out: string;
    status: string;
    guests: number;
    total_price: string;
    room_name: string;
}

interface RoomItem {
    id: number;
    name: string;
    type: string;
    price_per_night: string;
    capacity: number;
    max_guests: number;
}

interface PageProps {
    bookings: BookingItem[];
    rooms: RoomItem[];
}

export default function BookingCalendar({ bookings, rooms }: PageProps) {
    const [currentView, setCurrentView] = useState<'day' | 'month' | 'year'>('month');
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    });
    const [roomFilter, setRoomFilter] = useState<string>('all');

    // Helper: format YYYY-MM-DD
    const toDateString = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    // Filter bookings based on room filter
    const filteredBookings = useMemo(() => {
        if (roomFilter === 'all') return bookings;
        return bookings.filter(b => b.room_id === parseInt(roomFilter));
    }, [bookings, roomFilter]);

    // Navigation handlers
    const handlePrev = () => {
        setSelectedDate(prev => {
            const next = new Date(prev);
            if (currentView === 'day') {
                next.setDate(prev.getDate() - 1);
            } else if (currentView === 'month') {
                next.setMonth(prev.getMonth() - 1);
            } else if (currentView === 'year') {
                next.setFullYear(prev.getFullYear() - 1);
            }
            return next;
        });
    };

    const handleNext = () => {
        setSelectedDate(prev => {
            const next = new Date(prev);
            if (currentView === 'day') {
                next.setDate(prev.getDate() + 1);
            } else if (currentView === 'month') {
                next.setMonth(prev.getMonth() + 1);
            } else if (currentView === 'year') {
                next.setFullYear(prev.getFullYear() + 1);
            }
            return next;
        });
    };

    const handleToday = () => {
        const today = new Date();
        setSelectedDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    };

    const viewTitle = useMemo(() => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        if (currentView === 'day') {
            return selectedDate.toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        } else if (currentView === 'month') {
            return `${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
        } else {
            return `${selectedDate.getFullYear()}`;
        }
    }, [selectedDate, currentView]);

    // Gather calendar grid cells for month view
    const calendarDays = useMemo(() => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const startDayOfWeek = firstDay.getDay(); // 0 = Sun, 1 = Mon, etc.
        const totalDays = new Date(year, month + 1, 0).getDate();
        
        const prevMonthTotalDays = new Date(year, month, 0).getDate();
        
        const days: { date: Date; currentMonth: boolean; key: string }[] = [];
        
        // Prev month padding
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const d = new Date(year, month - 1, prevMonthTotalDays - i);
            days.push({ date: d, currentMonth: false, key: `prev-${d.getDate()}` });
        }
        
        // Current month
        for (let i = 1; i <= totalDays; i++) {
            const d = new Date(year, month, i);
            days.push({ date: d, currentMonth: true, key: `curr-${i}` });
        }
        
        // Next month padding to reach a multiple of 7
        const totalCells = days.length > 35 ? 42 : 35;
        const nextMonthPadding = totalCells - days.length;
        for (let i = 1; i <= nextMonthPadding; i++) {
            const d = new Date(year, month + 1, i);
            days.push({ date: d, currentMonth: false, key: `next-${i}` });
        }
        
        return days;
    }, [selectedDate]);

    // Check bookings for a specific day
    const getBookingsForDate = (dateStr: string) => {
        return filteredBookings.filter(b => {
            return dateStr >= b.check_in && dateStr < b.check_out && b.status !== 'cancelled' && b.status !== 'rejected';
        });
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100';
            case 'pending':
                return 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100';
            case 'cancelled':
            case 'rejected':
                return 'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100';
            default:
                return 'bg-muted text-muted-foreground border-border hover:bg-muted';
        }
    };

    return (
        <>
            <Head title="Booking Calendar" />

            <div className="flex flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/60 pb-6">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" asChild size="icon">
                            <Link href={index().url}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">Booking Calendar</h1>
                            <p className="text-sm text-muted-foreground">Monitor availability and schedules across rooms</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* View Switchers */}
                        <div className="inline-flex rounded-lg border p-1 bg-muted/40 text-xs">
                            <button
                                onClick={() => setCurrentView('day')}
                                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${currentView === 'day' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Day
                            </button>
                            <button
                                onClick={() => setCurrentView('month')}
                                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${currentView === 'month' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setCurrentView('year')}
                                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${currentView === 'year' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Year
                            </button>
                        </div>

                        {/* Room Filter Dropdown */}
                        <Select value={roomFilter} onValueChange={setRoomFilter}>
                            <SelectTrigger className="w-[180px] h-9 text-xs">
                                <SelectValue placeholder="All Rooms" />
                            </SelectTrigger>
                            <SelectContent className="text-xs">
                                <SelectItem value="all">All Rooms</SelectItem>
                                {rooms.map(room => (
                                    <SelectItem key={room.id} value={room.id.toString()}>
                                        {room.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button asChild size="sm" className="gap-1.5 text-xs">
                            <Link href={create().url}>
                                <Plus className="h-4 w-4" />
                                Create Booking
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Calendar Controls Bar */}
                <div className="flex items-center justify-between bg-card border rounded-xl p-3 shadow-xs">
                    <h2 className="font-serif text-lg font-medium text-foreground pl-2">{viewTitle}</h2>
                    <div className="flex items-center gap-1.5">
                        <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer" onClick={handlePrev}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 cursor-pointer text-xs px-3" onClick={handleToday}>
                            Today
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer" onClick={handleNext}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* 1. MONTH VIEW */}
                {currentView === 'month' && (
                    <div className="grid grid-cols-7 gap-px bg-border/40 rounded-xl border overflow-hidden shadow-xs">
                        {/* Day headers */}
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                            <div key={day} className="bg-muted/30 text-center py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40">
                                {day}
                            </div>
                        ))}

                        {/* Calendar cells */}
                        {calendarDays.map(({ date, currentMonth }) => {
                            const dateStr = toDateString(date);
                            const dayBookings = getBookingsForDate(dateStr);
                            const isToday = toDateString(new Date()) === dateStr;

                            return (
                                <div
                                    key={dateStr}
                                    className={`min-h-[150px] bg-card p-2.5 flex flex-col justify-between border-r border-b border-border/20 group hover:bg-muted/5 transition-colors duration-150 ${
                                        !currentMonth ? 'bg-muted/10 text-muted-foreground/50' : 'text-foreground'
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs font-medium h-6 w-6 flex items-center justify-center rounded-full ${
                                            isToday ? 'bg-primary text-primary-foreground font-semibold shadow-xs' : ''
                                        }`}>
                                            {date.getDate()}
                                        </span>
                                        {currentMonth && (
                                            <Link
                                                href={`${create().url}?check_in=${dateStr}`}
                                                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-muted/50 rounded-md transition-opacity duration-150"
                                                title="Add booking starting on this date"
                                            >
                                                <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                                            </Link>
                                        )}
                                    </div>

                                    {/* Booking stack */}
                                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[105px] mt-1.5 pr-0.5 scrollbar-thin">
                                        {dayBookings.slice(0, 3).map(booking => (
                                            <Link
                                                key={booking.id}
                                                href={show(booking.id).url}
                                                className="block text-[10px] truncate px-1.5 py-0.5 rounded border leading-tight transition-all hover:scale-[1.01]"
                                                style={{
                                                    borderColor: booking.status === 'confirmed' ? 'var(--color-emerald-200)' : 'var(--color-amber-200)',
                                                    backgroundColor: booking.status === 'confirmed' ? 'var(--color-emerald-50)' : 'var(--color-amber-50)',
                                                    color: booking.status === 'confirmed' ? 'var(--color-emerald-800)' : 'var(--color-amber-800)',
                                                }}
                                                title={`${booking.room_name}: ${booking.name} (${booking.status})`}
                                            >
                                                {booking.room_name.split(' ')[0]}: {booking.name}
                                            </Link>
                                        ))}
                                        {dayBookings.length > 3 && (
                                            <div
                                                onClick={() => {
                                                    setSelectedDate(date);
                                                    setCurrentView('day');
                                                }}
                                                className="text-[9px] text-center text-muted-foreground font-medium cursor-pointer hover:underline py-0.5"
                                            >
                                                +{dayBookings.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 2. DAY VIEW */}
                {currentView === 'day' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            {rooms.map(room => {
                                const dateStr = toDateString(selectedDate);
                                const roomBookings = bookings.filter(b => b.room_id === room.id && b.status !== 'cancelled' && b.status !== 'rejected');
                                const activeBooking = roomBookings.find(b => dateStr >= b.check_in && dateStr < b.check_out);

                                return (
                                    <Card key={room.id} className="border border-border/80 shadow-xs overflow-hidden">
                                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 p-5">
                                            {/* Room Info */}
                                            <div className="md:col-span-1 border-r border-border/30 pr-4 space-y-1">
                                                <h3 className="font-serif font-medium text-base text-foreground flex items-center gap-1.5">
                                                    <Home className="h-4.5 w-4.5 text-muted-foreground" />
                                                    {room.name}
                                                </h3>
                                                <p className="text-xs text-muted-foreground capitalize">{room.type} Suite</p>
                                                <p className="text-xs font-semibold text-primary pt-1">R {room.price_per_night} / night</p>
                                            </div>

                                            {/* Status Detail Block */}
                                            <div className="md:col-span-2 flex items-center gap-4">
                                                {activeBooking ? (
                                                    <div className="space-y-2 w-full">
                                                        <div className="flex items-center gap-2">
                                                            <Badge className={`${getStatusBadgeColor(activeBooking.status)} text-[10px] font-bold border py-0 px-2 uppercase`}>
                                                                {activeBooking.status}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">
                                                                Stay: {new Date(activeBooking.check_in).toLocaleDateString()} to {new Date(activeBooking.check_out).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                                            <div className="flex items-center gap-1.5">
                                                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                                                                <span className="font-medium text-foreground">{activeBooking.name}</span>
                                                            </div>
                                                            <div className="text-muted-foreground truncate">
                                                                {activeBooking.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-emerald-600">
                                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                                        <span className="text-sm font-medium">Available for booking today</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="md:col-span-1 flex justify-end gap-2">
                                                {activeBooking ? (
                                                    <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
                                                        <Link href={show(activeBooking.id).url}>
                                                            <Eye className="h-4 w-4" />
                                                            View Reservation
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <Button size="sm" asChild className="gap-1.5 text-xs">
                                                        <Link href={`${create().url}?room_id=${room.id}&check_in=${dateStr}`}>
                                                            <Plus className="h-4 w-4" />
                                                            Book Room
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 3. YEAR VIEW */}
                {currentView === 'year' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 12 }).map((_, monthIndex) => {
                            const year = selectedDate.getFullYear();
                            const monthDate = new Date(year, monthIndex, 1);
                            const monthName = monthDate.toLocaleString('default', { month: 'long' });
                            
                            const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
                            const monthStartDay = new Date(year, monthIndex, 1).getDay();

                            return (
                                <Card key={monthIndex} className="p-4 bg-card border border-border/80 shadow-xs flex flex-col justify-between">
                                    <h3 className="font-serif text-sm font-medium text-foreground border-b pb-2 mb-3">
                                        {monthName}
                                    </h3>
                                    
                                    <div className="grid grid-cols-7 gap-1 text-center text-[9px] text-muted-foreground font-semibold mb-2">
                                        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-7 gap-1">
                                        {/* Blank placeholders */}
                                        {Array.from({ length: monthStartDay }).map((_, i) => (
                                            <div key={`empty-${i}`} className="aspect-square" />
                                        ))}

                                        {/* Days */}
                                        {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                                            const day = dayIndex + 1;
                                            const cellDate = new Date(year, monthIndex, day);
                                            const cellDateStr = toDateString(cellDate);
                                            const dateBookings = bookings.filter(b => {
                                                return cellDateStr >= b.check_in && cellDateStr < b.check_out && b.status !== 'cancelled' && b.status !== 'rejected';
                                            });

                                            // Occupancy level (color intensity)
                                            const occupancyRate = dateBookings.length / (rooms.length || 1);
                                            let bgClass = "bg-muted/20 text-muted-foreground/75";
                                            let tooltip = `${monthName} ${day}, ${year}: Available`;

                                            if (dateBookings.length > 0) {
                                                tooltip = `${monthName} ${day}, ${year}: ${dateBookings.length} of ${rooms.length} rooms occupied`;
                                                if (occupancyRate >= 0.8) {
                                                    bgClass = "bg-primary text-primary-foreground font-bold";
                                                } else if (occupancyRate >= 0.5) {
                                                    bgClass = "bg-primary/60 text-primary-foreground font-medium";
                                                } else {
                                                    bgClass = "bg-primary/25 text-primary-foreground/90 font-medium";
                                                }
                                            }

                                            return (
                                                <div
                                                    key={`day-${day}`}
                                                    onClick={() => {
                                                        setSelectedDate(cellDate);
                                                        setCurrentView('day');
                                                    }}
                                                    className={`aspect-square text-[9px] rounded-sm flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${bgClass}`}
                                                    title={tooltip}
                                                >
                                                    {day}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

BookingCalendar.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Bookings', href: index().url },
        { title: 'Calendar' },
    ],
};
