import { Calendar, MapPin, Navigation } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import HeadingBlock from '@/components/typography/heading-block';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { EVENTS_DATA } from '@/data/events-data';
import MainWrapper from '@/layouts/main/main-wrapper';

export default function LocalExperiences() {
    const [activeCategory, setActiveCategory] = useState<
        'all' | 'festival' | 'golf' | 'wine' | 'nature'
    >('all');

    const filteredEvents = EVENTS_DATA.filter(
        (e) => activeCategory === 'all' || e.category === activeCategory,
    );

    return (
        <section
            id="activities"
            className="border-t border-border bg-muted py-24 transition-colors duration-300 dark:bg-muted"
        >
            <MainWrapper>
                {/* Section Header */}
                <div className="mb-16">
                    <HeadingBlock
                        className="mb-4 space-y-3"
                        badge={{ text: 'Wellington Area Explorer' }}
                        heading="Surrounded by Cape Adventures"
                        headingLevel={2}
                        description={
                            <>
                                Sleep @ The Garden Shed sits perfectly inside
                                the historic Bovlei Valley, close to golf
                                courses, majestic mountain passes, hiking
                                trails, and artisanal winelands festivals.
                            </>
                        }
                    />

                    <div className="flex justify-end">
                        {/* Category tabs */}
                        <div
                            className="animate-fade-in inline-flex flex-wrap gap-2"
                            id="activities-filter-controls"
                        >
                            {[
                                { label: 'All Activities', val: 'all' },
                                { label: 'Wine', val: 'wine' },
                                { label: 'Golf', val: 'golf' },
                                { label: 'Nature', val: 'nature' },
                                { label: 'Festivals', val: 'festival' },
                            ].map((tab) => (
                                <Button
                                    key={tab.val}
                                    variant={
                                        activeCategory === tab.val
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() =>
                                        setActiveCategory(tab.val as any)
                                    }
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activities grid */}
                <motion.div
                    layout
                    className="mb-24 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
                    id="activities-grid"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredEvents.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card className={`group py-0`}>
                                    <CardContent className="space-y-4 p-6">
                                        <div className="flex items-center justify-between">
                                            <Badge
                                                variant="outline"
                                                className="rounded-full border border-primary/35 bg-primary/5 px-2 py-1 font-mono text-xs leading-none font-medium tracking-wider text-primary uppercase"
                                            >
                                                {item.category}
                                            </Badge>
                                            <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                                <Navigation
                                                    size={12}
                                                    className="text-primary"
                                                />
                                                {item.distance}
                                            </span>
                                        </div>
                                        <h4 className="line-clamp-1 font-serif text-lg leading-tight font-normal text-foreground transition-colors group-hover:text-primary">
                                            {item.title}
                                        </h4>
                                        <p className="line-clamp-4 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                                            {item.description}
                                        </p>
                                    </CardContent>
                                    <div className="space-y-2 rounded-b-[inherit] border-t border-b border-border bg-background px-6 py-3">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                            <Calendar
                                                size={13}
                                                className="shrink-0 text-primary"
                                            />
                                            <span className="truncate">
                                                {item.date}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                            <MapPin
                                                size={13}
                                                className="shrink-0 text-primary"
                                            />
                                            <span className="truncate">
                                                {item.location}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </MainWrapper>
        </section>
    );
}
