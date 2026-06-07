import { Sprout } from 'lucide-react';
import MainWrapper from '@/layouts/main/main-wrapper';
import { cn } from '@/lib/utils';

interface MainFooterProps {
    className?: string;
}

export default function MainFooter({ className, ...props }: MainFooterProps) {
    return (
        <footer
            className={cn(
                `border-t border-border bg-foreground/5 pt-16 font-sans text-foreground/50`,
                className,
            )}
            {...props}
        >
            <MainWrapper>
                <div className="mb-12 grid grid-cols-1 gap-10 pb-12 md:grid-cols-12">
                    {/* Column 1: Brand block */}
                    <div className="space-y-4 md:col-span-5">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                                <Sprout size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-forground font-serif text-base leading-none font-normal">
                                    The Garden Shed
                                </span>
                                <span className="mt-1 font-mono text-[9px] leading-none font-medium tracking-widest text-primary uppercase">
                                    Country Guest House
                                </span>
                            </div>
                        </div>
                        <p className="text-forground/40 mt-4 max-w-md text-sm leading-relaxed">
                            We offer the restorative peace and quiet of a
                            private rural sanctuary just outside the historic
                            winelands town of Wellington, Western Cape, South
                            Africa. Experience gorgeous comfort, mountain views,
                            and genuine hospitality.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-3.5 md:col-span-3">
                        <h4 className="font-mono text-xs font-medium tracking-widest text-primary uppercase">
                            Quick Navigation
                        </h4>
                        <ul className="space-y-2.5 text-sm font-medium">
                            <li>
                                <button className="text-forground/60 cursor-pointer border-none bg-transparent text-left transition-colors hover:text-primary">
                                    Home & Welcome
                                </button>
                            </li>
                            <li>
                                <button className="text-forground/60 cursor-pointer border-none bg-transparent text-left transition-colors hover:text-primary">
                                    7 Country Rooms
                                </button>
                            </li>
                            <li>
                                <button className="text-forground/60 cursor-pointer border-none bg-transparent text-left transition-colors hover:text-primary">
                                    Pools & Dining Amenities
                                </button>
                            </li>
                            <li>
                                <button className="text-forground/60 cursor-pointer border-none bg-transparent text-left transition-colors hover:text-primary">
                                    Editorial Blog
                                </button>
                            </li>
                            <li>
                                <button className="text-forground/60 cursor-pointer border-none bg-transparent text-left transition-colors hover:text-primary">
                                    Live Feed Hub
                                </button>
                            </li>
                            <li>
                                <button className="text-forground/60 cursor-pointer border-none bg-transparent text-left transition-colors hover:text-primary">
                                    Contact & Directions
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contacts info */}
                    <div className="space-y-3.5 md:col-span-4">
                        <h4 className="font-mono text-xs font-medium tracking-widest text-primary uppercase">
                            Find Us In Wellington
                        </h4>
                        <div className="space-y-3 text-sm leading-relaxed">
                            <p className="text-foreground/50">
                                Champagne Street, Vorentoe Farm,
                                <br />
                                Wellington, 7655, South Africa
                            </p>
                            <div className="mt-3 space-y-1">
                                <p className="flex items-center gap-2">
                                    <span className="text-forground/60 font-medium tracking-tight">
                                        Inquiries:
                                    </span>
                                    <a
                                        href="mailto:sleep@thegardenshed.co.za"
                                        className="text-primary hover:underline"
                                    >
                                        sleep@thegardenshed.co.za
                                    </a>
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="text-forground/60 font-medium tracking-tight">
                                        Phone:
                                    </span>
                                    <span className="text-foreground/50">
                                        +27 (0)82 300 5290
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </MainWrapper>
            <div className="border-t border-border bg-foreground/5 py-16">
                <MainWrapper>
                    {/* Bottom segment */}
                    <div className="text-forground/30 flex flex-col items-center justify-between gap-6 text-xs sm:flex-row">
                        <p className="order-2 sm:order-1">
                            &copy; {new Date().getFullYear()} Sleep @ The Garden
                            Shed Wellington. All Rights Reserved.
                        </p>

                        <div className="text-forground/40 order-1 flex items-center gap-4 sm:order-2">
                            <span className="flex items-center gap-1.5">
                                Designed and developed by{' '}
                                <a
                                    target={`_blank`}
                                    rel="noreferrer"
                                    className={`text-primary transition-colors hover:underline`}
                                    href="https://designbycode.co.za"
                                >
                                    designbycode
                                </a>
                            </span>
                            <span>•</span>
                            <a
                                href="https://maps.google.com/?q=Champagne+Street+Vorentoe+Farm+Wellington+South+Africa"
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold transition-colors hover:text-primary"
                            >
                                Get Directions
                            </a>
                        </div>
                    </div>
                </MainWrapper>
            </div>
        </footer>
    );
}

MainFooter.displayName = 'MainFooter';
