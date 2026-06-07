import { Coffee, Flame, ShieldCheck, Sparkles, UtensilsCrossed, Waves, Wifi, Wind } from 'lucide-react';
import Breakfast from '@/../images/farm_breakfast.png';
import HeadingBlock from '@/components/typography/heading-block';
import { Card, CardContent } from '@/components/ui/card';
import { AMENITIES_DATA } from '@/data/amenities-data';
import MainWrapper from '@/layouts/main/main-wrapper';
import MainLayout from '@/layouts/main-layout';

import Pool from '@/../images/pool.jpg';

export default function FacilitiesIndex() {
    const renderIcon = (iconName: string, size = 22) => {
        switch (iconName) {
            case 'UtensilsCrossed':
                return <UtensilsCrossed size={size} className="text-primary" />;
            case 'Waves':
                return <Waves size={size} className="text-primary" />;
            case 'Wind':
                return <Wind size={size} className="text-primary" />;
            case 'ShieldCheck':
                return <ShieldCheck size={size} className="text-primary" />;
            case 'Wifi':
                return <Wifi size={size} className="text-primary" />;
            case 'Flame':
                return <Flame size={size} className="text-primary" />;
            default:
                return <Sparkles size={size} className="text-primary" />;
        }
    };

    return (
        <MainWrapper className="py-18">
            <section id="facilities">
                <HeadingBlock
                    className="mx-auto text-center"
                    badge={{ text: 'Country Manor Features' }}
                    heading="Peace, Space & Leisure"
                    headingLevel={2}
                    description={
                        <>
                            Our beautiful Wellington smallholding offers the
                            perfect mix of relaxed rural style and premium guest
                            conveniences, ensuring an unforgettable retreat.
                        </>
                    }
                />

                <div>
                    {/* Highlight split showcase */}
                    <div
                        className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2"
                        id="facilities-showcase"
                    >
                        {/* Breakfast & Dining card */}
                        <HeadingBlock
                            size="sm"
                            badge={{
                                text: 'Daily Country Service',
                            }}
                            heading="Farm-Fresh Cooked Breakfasts Included"
                            headingLevel={3}
                            headClassName="text-2xl leading-tight sm:text-2xl"
                            description="We believe in starting mornings the right way. Your booking includes an exquisite, generous country breakfast cooked to order in our shared dining lounge. Savor warm baked goods, farm fresh butter, local seasonal fruits, creamy yogurts, and traditional South African filter coffee or custom herbal teas."
                            descriptionClassName="text-sm sm:text-sm leading-relaxed"
                        >
                            <div className="flex gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm text-foreground dark:text-white/50">
                                <Coffee
                                    className="mt-0.5 shrink-0 text-primary"
                                    size={18}
                                />
                                <div>
                                    <span className="mb-0.5 block font-semibold text-foreground dark:text-white">
                                        South African Hospitality Standard
                                    </span>
                                    Every room comes equipped with coffee & tea
                                    trays complete with premium local rusks,
                                    perfect for a cozy morning nibble before
                                    heading out.
                                </div>
                            </div>
                        </HeadingBlock>
                        <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted shadow-md dark:border-white/5 dark:bg-black/60 dark:shadow-2xl">
                            <img
                                src={Breakfast}
                                alt="Delicious farm fresh breakfast at Sleep @ The Garden Shed"
                                className="h-full w-full object-cover dark:opacity-85"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    </div>

                    <div
                        className="mb-20 grid grid-cols-1 items-center gap-12 md:flex-row-reverse lg:grid-cols-2"
                        id="pool-showcase"
                    >
                        <HeadingBlock
                            size="sm"
                            className="order-1 lg:order-2"
                            badge={{
                                text: 'Tranquil Grounds',
                            }}
                            heading="Communal Sparkling Pool & Lush Gardens"
                            headingLevel={3}
                            headClassName="text-2xl leading-tight sm:text-2xl"
                            description="Escape the Cape Winelands heat in our crystal clear communal swimming pool. Set inside expansive green lawns with sun loungers, old shade-providing trees, and majestic garden vegetation, it's a serene garden oasis where you can unwind, read a favorite book, or listen to the local birds."
                            descriptionClassName="text-sm sm:text-sm leading-relaxed"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-xl border border-border bg-card p-3.5 shadow-sm dark:border-white/5 dark:bg-black/40">
                                    <span className="block text-sm font-semibold text-foreground dark:text-white">
                                        Behind Electronic Gates
                                    </span>
                                    <span className="mt-1 block text-xs text-muted-foreground dark:text-white/45">
                                        Secure inside parking
                                    </span>
                                </div>
                                <div className="rounded-xl border border-border bg-card p-3.5 shadow-sm dark:border-white/5 dark:bg-black/40">
                                    <span className="block text-sm font-semibold text-foreground dark:text-white">
                                        Honour Bar Fridges
                                    </span>
                                    <span className="mt-1 block text-xs text-muted-foreground dark:text-white/45">
                                        Fully stocked cold beverages
                                    </span>
                                </div>
                            </div>
                        </HeadingBlock>
                        <div className="relative order-2 aspect-video overflow-hidden rounded-2xl border border-border bg-muted shadow-md lg:order-1 dark:border-white/5 dark:bg-black/60 dark:shadow-2xl">
                            <img
                                src={Pool}
                                alt="Lush swimming pool with sun loungers at sleep at the garden shed"
                                className="h-full w-full object-cover dark:opacity-85"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    </div>

                    {/* Feature list box */}
                    <div
                        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                        id="amenities-feature-grid"
                    >
                        {AMENITIES_DATA.map((item, index) => (
                            <Card
                                key={index}
                                className="overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all duration-300 hover:border-primary/30 hover:shadow-lg dark:border-white/5 dark:bg-card dark:shadow-2xl"
                            >
                                <CardContent className="space-y-4 p-6">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">
                                        {renderIcon(item.icon)}
                                    </div>
                                    <h4 className="font-serif text-lg font-normal text-foreground dark:text-white">
                                        {item.name}
                                    </h4>
                                    <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm dark:text-white/40">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </MainWrapper>
    );
}

FacilitiesIndex.displayName = 'FacilitiesIndex';

FacilitiesIndex.layout = MainLayout;
