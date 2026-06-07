import { CheckCircle2, Shield, Star } from 'lucide-react';
import MainWrapper from '@/layouts/main/main-wrapper';

export default function HeroDividerBar() {
    return (
        <>
            <section className="border-y border-border bg-card py-10 text-foreground shadow-inner transition-colors duration-300">
                <MainWrapper>
                    <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3 md:text-left">
                        <div className="flex flex-col items-center gap-4 md:flex-row">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/15">
                                <Shield size={18} className="text-primary" />
                            </div>
                            <div className="space-y-0.5">
                                <span className="block text-sm font-medium text-foreground">
                                    Secure Smallholding
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                    Enclosed parking behind secure electric
                                    gates.
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-1 flex-col items-center gap-4 md:flex-row">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/15">
                                <CheckCircle2
                                    size={18}
                                    className="text-primary"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <span className="block text-sm font-medium text-foreground">
                                    Farm Breakfast Included
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                    Fresh fruits, warm pastries & hot cooked
                                    recipes.
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-4 md:flex-row">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/15">
                                <Star size={18} className="text-primary" />
                            </div>
                            <div className="space-y-0.5">
                                <span className="block text-sm font-medium text-foreground">
                                    Sublime Well-Rated Reviews
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                    Exceptional 5-star ranking on global booking
                                    channels.
                                </span>
                            </div>
                        </div>
                    </div>
                </MainWrapper>
            </section>
        </>
    );
}
