import { Compass, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ContactLocation() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-primary" />
                        <h4 className="font-serif text-lg font-light text-foreground">
                            Our Country Location
                        </h4>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1 text-xs text-muted-foreground sm:text-sm">
                        <p className="font-semibold text-foreground">
                            The Garden Shed
                        </p>
                        <p>Champagne Street, Vorentoe Farm,</p>
                        <p>Wellington, Western Cape, 7655, South Africa</p>
                    </div>

                    <div className="space-y-3 border-t border-border pt-4">
                        <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                            <Compass
                                size={15}
                                className="mt-0.5 shrink-0 text-primary"
                            />
                            <div>
                                <span className="block font-medium text-foreground">
                                    From Cape Town International Airport (65 km)
                                </span>
                                Take the N2 then switch to R300, or take the
                                beautiful N1 highway north towards Paarl. Take
                                the R44 Turnoff towards Wellington, then
                                continue into Champagne Street, Vorentoe Farm.
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                            <Compass
                                size={15}
                                className="mt-0.5 shrink-0 text-primary"
                            />
                            <div>
                                <span className="block font-medium text-foreground">
                                    From Wellington Golf Course (2.5 km)
                                </span>
                                We are practically next door! Head northeast on
                                Bain's Kloof Rd, turn right at Champagne Street
                                to reach our electronic gates.
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted p-4 text-center shadow-sm">
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95">
                    <svg
                        className="absolute inset-0 h-full w-full text-muted-foreground/10"
                        fill="none"
                        stroke="currentColor"
                    >
                        <line
                            x1="0"
                            y1="50"
                            x2="500"
                            y2="100"
                            strokeWidth="2"
                            strokeDasharray="3 3"
                        />
                        <line
                            x1="120"
                            y1="0"
                            x2="300"
                            y2="300"
                            strokeWidth="3"
                        />
                        <line
                            x1="10"
                            y1="180"
                            x2="400"
                            y2="40"
                            strokeWidth="1.5"
                        />
                        <line
                            x1="280"
                            y1="0"
                            x2="100"
                            y2="280"
                            strokeWidth="2.5"
                        />
                        <circle
                            cx="210"
                            cy="140"
                            r="12"
                            className="fill-primary/15 stroke-primary"
                            strokeWidth="2"
                        />
                        <circle
                            cx="210"
                            cy="140"
                            r="3"
                            className="fill-primary"
                        />
                    </svg>

                    <div className="relative z-10 flex max-w-sm flex-col items-center space-y-1.5 rounded-xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur-md">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <MapPin size={13} />
                        </div>
                        <span className="text-xs leading-none font-semibold text-foreground">
                            Sleep @ The Garden Shed
                        </span>
                        <span className="text-[10px] leading-tight text-muted-foreground">
                            Wellington Country Smallholding
                        </span>
                        <a
                            href="https://maps.google.com/?q=Champagne+Street+Vorentoe+Farm+Wellington+South+Africa"
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-primary transition-colors hover:text-primary/80"
                        >
                            <span>Open in Google Maps</span>
                            <Compass size={11} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
