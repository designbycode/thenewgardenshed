import { Head } from '@inertiajs/react';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { dashboard } from '@/routes';
import type { DashboardStats } from '@/types/data';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface PageProps {
    stats: DashboardStats;
}

function StatCard({ label, value, prefix }: { label: string; value: string | number; prefix?: string }) {
    return (
        <div className="flex flex-col gap-1 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-2xl font-bold tracking-tight">
                {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
            </span>
        </div>
    );
}

function BookingChart({ data }: { data: DashboardStats['bookings']['bookings_per_month'] }) {
    const config = {
        bookings: {
            label: 'Bookings',
            color: 'hsl(var(--chart-1))',
        },
    };

    return (
        <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
            <h3 className="mb-4 text-sm font-medium">Bookings Over Time</h3>
            <ChartContainer config={config} className="aspect-[2/1] w-full">
                <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        className="text-xs text-muted-foreground"
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        className="text-xs text-muted-foreground"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="var(--color-bookings)"
                        fill="var(--color-bookings)"
                        fillOpacity={0.2}
                        strokeWidth={2}
                    />
                </AreaChart>
            </ChartContainer>
        </div>
    );
}

function ReviewChart({ data }: { data: DashboardStats['reviews']['reviews_per_month'] }) {
    const config = {
        reviews: {
            label: 'Reviews',
            color: 'hsl(var(--chart-2))',
        },
    };

    return (
        <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
            <h3 className="mb-4 text-sm font-medium">Reviews Over Time</h3>
            <ChartContainer config={config} className="aspect-[2/1] w-full">
                <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        className="text-xs text-muted-foreground"
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        className="text-xs text-muted-foreground"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="var(--color-reviews)"
                        fill="var(--color-reviews)"
                        fillOpacity={0.2}
                        strokeWidth={2}
                    />
                </AreaChart>
            </ChartContainer>
        </div>
    );
}

export default function Dashboard({ stats }: PageProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <StatCard label="Total Bookings" value={stats.bookings.total_bookings} />
                    <StatCard label="Revenue" value={stats.bookings.revenue} prefix="$" />
                    <StatCard label="Avg per Booking" value={stats.bookings.avg_per_booking} prefix="$" />
                    <StatCard label="Total Reviews" value={stats.reviews.total_reviews} />
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <BookingChart data={stats.bookings.bookings_per_month} />
                    <ReviewChart data={stats.reviews.reviews_per_month} />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
