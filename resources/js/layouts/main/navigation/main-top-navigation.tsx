import { Mail, MapPin, Phone } from 'lucide-react';
import MainWrapper from '@/layouts/main/main-wrapper';

export default function MainTopNavigation() {
    return (
        <div className="hidden h-9 w-full border-b border-border bg-background/75 text-muted-foreground transition-colors duration-300 sm:block">
            <MainWrapper className="flex h-full items-center justify-between text-xs font-medium tracking-wide">
                <div className="flex items-center gap-5">
                    <span className="flex cursor-pointer items-center gap-1.5 transition-colors hover:text-primary">
                        <Phone size={13} className="text-primary" />
                        <span>+27 (0)82 300 5290</span>
                    </span>
                    <span className="flex cursor-pointer items-center gap-1.5 transition-colors hover:text-primary">
                        <Mail size={13} className="text-primary" />
                        <span>sleep@thegardenshed.co.za</span>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-primary" />
                    <span className="text-muted-foreground">
                        Champagne Street, Vorentoe Farm, Wellington
                    </span>
                </div>
            </MainWrapper>
        </div>
    );
}
