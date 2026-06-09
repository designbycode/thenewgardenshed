import { Menu } from 'lucide-react';
// import logo from '@/../images/logo-banner.svg';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import MainNavigationBrand from '@/layouts/main/brand/main-navigation-brand';
import MainWrapper from '@/layouts/main/main-wrapper';
import MainNavigationLinks from '@/layouts/main/navigation/main-navigation-links';
import MainThemeToggle from '@/layouts/main/navigation/main-theme-toggle';
import MainTopNavigation from '@/layouts/main/navigation/main-top-navigation';

export default function MainNavigation() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-muted/75 backdrop-blur-md transition-colors duration-300">
            <MainTopNavigation />
            <MainWrapper
                className={'relative flex h-20 items-center justify-between'}
            >
                <MainNavigationBrand />
                {/*<Link*/}
                {/*    href="/"*/}
                {/*    prefetch={true}*/}
                {/*    className="relative top-9 h-40 w-39 rounded-b-[50%]"*/}
                {/*>*/}
                {/*    <img*/}
                {/*        src={logo}*/}
                {/*        alt="The New Garden Shed"*/}
                {/*        className="drop-shadow-xl drop-shadow-black/25"*/}
                {/*    />*/}
                {/*</Link>*/}

                <MainNavigationLinks />
                <div className="flex items-center gap-2 lg:hidden">
                    <MainThemeToggle />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Open menu"
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-75">
                            <MainNavigationLinks variant="mobile" />
                        </SheetContent>
                    </Sheet>
                </div>
            </MainWrapper>
        </nav>
    );
}
