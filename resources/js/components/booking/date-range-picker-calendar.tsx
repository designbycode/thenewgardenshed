import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { RoomItem } from '@/types/data';

interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
}

interface DateRangePickerCalendarProps {
    checkIn: string;
    checkOut: string;
    selectedRoom: RoomItem | null;
    pageErrors: Record<string, string>;
    formatDate: (dateStr: string) => string;
    nights: number;
    onDateSelect: (checkIn: string, checkOut: string) => void;
}

const toDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getCalendarDays = (currentMonthDate: Date): CalendarDay[] => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth(); // 0-indexed
    
    // First day of current month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Days in current month
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    
    // Days in previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const cells: CalendarDay[] = [];
    
    // Prev month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        cells.push({
            date: new Date(year, month - 1, daysInPrevMonth - i),
            isCurrentMonth: false,
        });
    }
    
    // Current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
        cells.push({
            date: new Date(year, month, i),
            isCurrentMonth: true,
        });
    }
    
    // Next month days to make it multiples of 7
    const totalCells = cells.length > 35 ? 42 : 35;
    const nextMonthDaysNeeded = totalCells - cells.length;
    for (let i = 1; i <= nextMonthDaysNeeded; i++) {
        cells.push({
            date: new Date(year, month + 1, i),
            isCurrentMonth: false,
        });
    }
    
    return cells;
};

export default function DateRangePickerCalendar({
    checkIn,
    checkOut,
    selectedRoom,
    pageErrors,
    formatDate,
    nights,
    onDateSelect,
}: DateRangePickerCalendarProps) {
    const [hoveredDate, setHoveredDate] = useState<string | null>(null);
    const todayLocalStr = toDateString(new Date());

    const [currentMonth, setCurrentMonth] = useState(() => {
        if (checkIn) {
            const d = new Date(checkIn);
            if (!isNaN(d.getTime())) return new Date(d.getFullYear(), d.getMonth(), 1);
        }
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1);
    });

    const isBooked = (dateStr: string) => {
        if (!selectedRoom || !selectedRoom.bookings) return false;
        return selectedRoom.bookings.some(booking => {
            return dateStr >= booking.check_in && dateStr < booking.check_out;
        });
    };

    const hasOverlap = (startStr: string, endStr: string) => {
        if (!selectedRoom || !selectedRoom.bookings) return false;
        let current = new Date(startStr);
        const end = new Date(endStr);
        while (current < end) {
            const currentStr = toDateString(current);
            if (isBooked(currentStr)) {
                return true;
            }
            current.setDate(current.getDate() + 1);
        }
        return false;
    };

    const handlePrevMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const isPrevMonthDisabled = () => {
        const today = new Date();
        return currentMonth.getFullYear() <= today.getFullYear() && 
               currentMonth.getMonth() <= today.getMonth();
    };

    const handleDateClick = (date: Date) => {
        const dateStr = toDateString(date);
        
        if (dateStr < todayLocalStr || isBooked(dateStr)) {
            return;
        }

        if (!checkIn || (checkIn && checkOut)) {
            onDateSelect(dateStr, '');
        } else {
            if (dateStr === checkIn) {
                onDateSelect('', '');
            } else if (dateStr < checkIn) {
                onDateSelect(dateStr, '');
            } else {
                if (hasOverlap(checkIn, dateStr)) {
                    onDateSelect(dateStr, '');
                } else {
                    onDateSelect(checkIn, dateStr);
                }
            }
        }
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    const monthTitle1 = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
    const monthTitle2 = `${monthNames[nextMonthDate.getMonth()]} ${nextMonthDate.getFullYear()}`;
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const calendarDays1 = getCalendarDays(currentMonth);
    const calendarDays2 = getCalendarDays(nextMonthDate);

    const renderCalendar = (monthDate: Date, calendarDays: CalendarDay[], title: string, showPrev: boolean, showNext: boolean) => {
        return (
            <Card className="p-4 bg-card border border-border shadow-xs w-full">
                <div className="flex items-center justify-between mb-4">
                    {showPrev ? (
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            disabled={isPrevMonthDisabled()}
                            className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                    ) : (
                        <div className="w-8" />
                    )}
                    <span className="font-serif text-sm font-medium text-foreground">
                        {title}
                    </span>
                    {showNext ? (
                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1.5 rounded-md hover:bg-muted cursor-pointer transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    ) : (
                        <div className="w-8" />
                    )}
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {daysOfWeek.map(day => (
                        <div key={day} className="text-muted-foreground font-medium py-1">
                            {day}
                        </div>
                    ))}
                    {calendarDays.map(({ date, isCurrentMonth }, index) => {
                        const dateStr = toDateString(date);
                        const isToday = dateStr === todayLocalStr;
                        const isPast = dateStr < todayLocalStr;
                        const isBookedDate = isBooked(dateStr);
                        const isSelectedStart = checkIn === dateStr;
                        const isSelectedEnd = checkOut === dateStr;
                        const isInRange = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;
                        const isInHoverRange = checkIn && !checkOut && hoveredDate && dateStr > checkIn && dateStr <= hoveredDate && !hasOverlap(checkIn, hoveredDate);
                        
                        const isDisabled = !isCurrentMonth || isPast || isBookedDate;
                        
                        let btnClass = "h-9 w-9 flex items-center justify-center transition-all duration-150 text-sm relative ";
                        
                        if (isDisabled) {
                            btnClass += "text-muted-foreground/30 cursor-not-allowed ";
                            if (isBookedDate && isCurrentMonth) {
                                btnClass += "line-through bg-red-500/5 text-red-500/40 ";
                            }
                        } else {
                            btnClass += "cursor-pointer ";
                            if (isSelectedStart) {
                                btnClass += "bg-primary text-primary-foreground font-bold shadow-md ";
                                if (checkOut) {
                                    btnClass += "rounded-l-md rounded-r-none ";
                                } else {
                                    btnClass += "rounded-md ";
                                }
                            } else if (isSelectedEnd) {
                                btnClass += "bg-primary text-primary-foreground font-bold shadow-md rounded-r-md rounded-l-none ";
                            } else if (isInRange) {
                                btnClass += "bg-primary/10 text-primary rounded-none ";
                            } else if (isInHoverRange) {
                                btnClass += "bg-primary/20 text-primary rounded-none ";
                            } else {
                                btnClass += "text-foreground hover:bg-muted rounded-md ";
                            }
                            
                            if (isToday && !isSelectedStart && !isSelectedEnd) {
                                btnClass += "ring-1 ring-primary/45 rounded-md ";
                            }
                        }
                        
                        return (
                            <button
                                key={index}
                                type="button"
                                disabled={isDisabled}
                                onClick={() => handleDateClick(date)}
                                onMouseEnter={() => !isDisabled && setHoveredDate(dateStr)}
                                onMouseLeave={() => setHoveredDate(null)}
                                className={btnClass}
                            >
                                <span>{date.getDate()}</span>
                                {isBookedDate && isCurrentMonth && (
                                    <div className="absolute inset-x-0 top-1/2 h-[1px] bg-red-500/40 -translate-y-1/2 rotate-12 pointer-events-none" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </Card>
        );
    };

    return (
        <section className="border-b border-border pb-12">
            <h2 className="mb-6 font-serif text-xl font-normal text-foreground flex items-center gap-2">
                <Calendar size={20} className="text-primary" />
                Select Dates
            </h2>
            
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {renderCalendar(currentMonth, calendarDays1, monthTitle1, true, false)}
                    {renderCalendar(nextMonthDate, calendarDays2, monthTitle2, false, true)}
                </div>
                
                {(pageErrors.check_in || pageErrors.check_out || (selectedRoom && selectedRoom.bookings && selectedRoom.bookings.length > 0)) && (
                    <div className="flex flex-wrap gap-4 items-center justify-between text-xs text-muted-foreground pt-2">
                        {selectedRoom && selectedRoom.bookings && selectedRoom.bookings.length > 0 ? (
                            <p className="flex items-center gap-1.5">
                                <span className="inline-block w-2.5 h-2.5 bg-red-500/5 border border-red-500/20 line-through rounded-xs" />
                                <span>Strikethrough dates are already booked for {selectedRoom.name}.</span>
                            </p>
                        ) : (
                            <div />
                        )}
                        
                        <div className="space-y-1">
                            {pageErrors.check_in && (
                                <p className="text-destructive font-medium">{pageErrors.check_in}</p>
                            )}
                            {pageErrors.check_out && (
                                <p className="text-destructive font-medium">{pageErrors.check_out}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
