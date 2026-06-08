import { Award } from 'lucide-react';
import HeadingBlock from '@/components/typography/heading-block';

export default function InfoBoxRoom() {
    return (
        <div className="relative mt-16 overflow-hidden rounded-2xl border border-border bg-card p-6 text-foreground shadow-md transition-colors duration-300 sm:p-10 dark:bg-card dark:text-foreground dark:shadow-2xl">
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
                <div className="space-y-2 lg:col-span-8">
                    <HeadingBlock
                        size={'sm'}
                        className="mb-0 space-y-3"
                        badge={{
                            text: 'Exclusive Amenities Standard',
                            icon: Award,
                        }}
                        heading="Every Single Room Includes:"
                        headingLevel={4}
                        description={
                            <>
                                Quiet air conditioning, fully stocked honour
                                mini bar fridge, hairdryer, plush swimming
                                towels, flat-screen TV with premium DSTV Hotel
                                package, complimentary high-speed Wi-Fi, and a
                                welcome coffee & tea tray complete with direct
                                locally-baked traditional South African rusks.
                            </>
                        }
                    />
                </div>
                <div className="flex justify-start lg:col-span-4 lg:justify-end">
                    <div className="w-full rounded-xl border border-border bg-muted p-5 text-center">
                        <span className="block text-xs tracking-wider text-muted-foreground uppercase">
                            Direct Booking Benefit
                        </span>
                        <span className="mt-1 block font-serif text-xl font-normal text-primary">
                            Best Rates Guaranteed
                        </span>
                        <span className="mt-1 block text-[11px] text-muted-foreground">
                            Free Cancellations up to 14 days
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
