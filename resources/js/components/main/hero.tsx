import { Link } from '@inertiajs/react';
import { Award, Calendar, ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import GuestHouseHero from '@/../images/guesthouse_hero.png';
import BadgeIndicator from '@/components/bits/badge-indicator';
import { Button } from '@/components/ui/button';
import MainWrapper from '@/layouts/main/main-wrapper';
import { cn } from '@/lib/utils';
import { index as contactUs } from '@/routes/contact-us';
import { index as roomsIndex } from '@/routes/rooms';

interface HeroSectionProps {
    className?: string;
}

export default function HeroSection({ className }: HeroSectionProps) {
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 600], [0, 180]);
    const contentY = useTransform(scrollY, [0, 600], [0, -40]);
    const contentOpacity = useTransform(scrollY, [0, 500], [1, 0.5]);

    return (
        <section
            id="home"
            className={cn(
                'relative flex min-h-[85vh] w-full items-center overflow-hidden py-12',
                className,
            )}
        >
            {/* Background Image with elegant split overlay */}
            <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
                <img
                    src={GuestHouseHero}
                    alt="The Garden Shed Guest House surrounded by mountains and vineyards"
                    className="h-full w-full object-cover object-center opacity-75"
                    referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-white/60 mix-blend-multiply dark:bg-black/60" />
                <div className="absolute inset-0 bg-linear-to-r from-muted via-muted/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-muted to-transparent dark:from-black dark:to-transparent" />
            </motion.div>

            {/* Hero Content */}
            <MainWrapper className={`relative z-10`}>
                <motion.div
                    className="max-w-2xl text-foreground"
                    style={{ y: contentY, opacity: contentOpacity }}
                >
                    {/* Badge indicator */}
                    <BadgeIndicator icon={Award}>
                        Premium Country Sanctuary • Wellington
                    </BadgeIndicator>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="lg:text-7.5xl font-serif text-5xl leading-[1.05] font-light tracking-tight text-foreground sm:text-6xl"
                        id="hero-heading"
                    >
                        <span className="text-primary italic">
                            The Garden Shed
                        </span>
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="mt-6 max-w-xl font-sans text-base leading-relaxed tracking-wide text-muted-foreground sm:text-lg"
                        id="hero-description"
                    >
                        Experience the exquisite peace and quiet of our country
                        smallholding nestled just outside Wellington. Surrounded
                        by majestic Hawequa mountains, olive groves, and
                        award-winning Cape Winelands vineyards. Your perfect
                        boutique country sanctuary is waiting.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.45 }}
                        className="mt-10 flex flex-col gap-4 sm:flex-row"
                        id="hero-actions"
                    >
                        <Button asChild size="lg">
                            <Link href="/bookings/create">
                                <Calendar size={15} className="mr-1" />
                                <span>Book Your Retreat</span>
                            </Link>
                        </Button>

                        <Button asChild variant="outline" size="lg">
                            <Link href={roomsIndex()}>
                                <span>Explore Our Rooms</span>
                                <ChevronRight size={15} />
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </MainWrapper>
        </section>
    );
}
