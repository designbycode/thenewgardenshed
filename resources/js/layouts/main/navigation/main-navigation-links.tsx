import { Link } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { navigationLinks } from '@/data/navigation-link';
import { useCurrentUrl } from '@/hooks/use-current-url';
import MainThemeToggle from '@/layouts/main/navigation/main-theme-toggle';
import { cn } from '@/lib/utils';

type Props = {
    variant?: 'desktop' | 'mobile';
};

export default function MainNavigationLinks({ variant = 'desktop' }: Props) {
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();

    if (variant === 'mobile') {
        return (
            <div className="mt-8 flex flex-col gap-6 px-4">
                <nav className="flex flex-col gap-4">
                    {navigationLinks.map((link) => (
                        <Link
                            prefetch={true}
                            className={cn(
                                'block cursor-pointer border-b-2 border-transparent pb-0.5 text-sm font-semibold tracking-widest uppercase transition-colors duration-100 hover:text-primary',
                                (link.name === 'Home'
                                    ? isCurrentUrl(link.href)
                                    : isCurrentOrParentUrl(link.href)) &&
                                    'border-primary text-primary',
                            )}
                            key={link.name}
                            href={link.href}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
                <Button className="h-11 w-full cursor-pointer font-bold uppercase">
                    <Calendar className="size-4" />
                    <span>Booking Now</span>
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="hidden items-center gap-8 lg:flex">
                {navigationLinks.map((link) => (
                    <Link
                        prefetch={true}
                        className={cn(
                            'cursor-pointer border-b-2 border-transparent pb-0.5 text-xs font-semibold tracking-widest uppercase transition-colors duration-100 hover:text-primary',
                            (link.name === 'Home'
                                ? isCurrentUrl(link.href)
                                : isCurrentOrParentUrl(link.href)) &&
                                'border-primary text-primary',
                        )}
                        key={link.name}
                        href={link.href}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>
            <div className="hidden gap-6 lg:flex">
                <MainThemeToggle />
                <Button
                    className={'h-11 cursor-pointer px-8 font-bold uppercase'}
                >
                    <Calendar className="size-4" />
                    <span>Booking Now</span>
                </Button>
            </div>
        </>
    );
}

MainNavigationLinks.displayName = 'MainNavigationLinks';
