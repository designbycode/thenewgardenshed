import { Link } from '@inertiajs/react';
import { Sprout } from 'lucide-react';
import { home } from '@/routes';

export default function MainNavigationBrand() {
    return (
        <Link
            prefetch={true}
            href={home()}
            className="group flex cursor-pointer items-center gap-2.5"
            id="navbar-brand"
        >
            <div className="flex size-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                <Sprout size={22} className="animate-pulse text-primary" />
            </div>
            <div className="flex flex-col">
                <span className="font-serif text-lg leading-none font-normal tracking-tight text-foreground sm:text-xl">
                    The Garden Shed
                </span>

                <span className="mt-1 font-mono text-[10px] leading-none font-semibold tracking-[0.2em] text-primary uppercase">
                    Country Guest House
                </span>
            </div>
        </Link>
    );
}
