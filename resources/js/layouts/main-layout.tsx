import { Head } from '@inertiajs/react';
import MainFooter from '@/layouts/main/main-footer';
import MainNavigation from '@/layouts/main/navigation/main-navigation';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
    className?: string;
    children: React.ReactNode;
    title?: string;
    description?: string;
    keywords?: string;
}

export default function MainLayout({
    className,
    children,
    title,
    description,
    keywords,
    ...props
}: MainLayoutProps) {
    return (
        <div
            className={cn(
                'flex min-h-svh flex-col bg-muted text-foreground',
                className,
            )}
            {...props}
        >
            <MainNavigation />
            <Head>
                {title && <title>{title}</title>}
                {description && (
                    <meta name="description" content={description} />
                )}
                {keywords && (
                    <meta name="keywords" content={keywords} />
                )}
            </Head>
            <main className={`flex-1`}>{children}</main>
            <MainFooter />
        </div>
    );
}

MainLayout.displayName = 'MainLayout';
