import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const paragraphVariants = cva('leading-relaxed text-muted-foreground', {
    variants: {
        variant: {
            lead: 'mx-auto max-w-lg text-base sm:text-base',
            default: 'text-sm sm:text-base',
            small: 'text-xs sm:text-sm',
        },
    },
    defaultVariants: {
        variant: 'lead',
    },
});

function Paragraph({
    className,
    variant,
    children,
}: React.PropsWithChildren<{
    className?: string;
}> &
    VariantProps<typeof paragraphVariants>) {
    return (
        <p className={cn(paragraphVariants({ variant, className }))}>
            {children}
        </p>
    );
}

export { Paragraph, paragraphVariants };
