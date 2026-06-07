
import { cn } from '@/lib/utils';

export default function MainWrapper({
    className,
    as,
    children,
    ...props
}: {
    className?: string;
    as?: React.ElementType;
    children: React.ReactNode;
}) {
    const Comp = as || 'div';

    return (
        <Comp
            className={cn(
                'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
                className,
            )}
            {...props}
        >
            {children}
        </Comp>
    );
}
