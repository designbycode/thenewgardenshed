import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const headingVariants = cva('font-serif', {
    variants: {
        variant: {
            default: 'mt-2 text-3xl font-light text-foreground sm:text-4xl',
            subtle: 'mt-2 text-xl font-light text-muted-foreground sm:text-2xl',
            prominent:
                'mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingTag = `h${HeadingLevel}`;

function Heading({
    className,
    variant,
    level = 1,
    as,
    children,
}: React.PropsWithChildren<{
    level?: HeadingLevel;
    as?: HeadingTag;
    className?: string;
}> &
    VariantProps<typeof headingVariants>) {
    const Tag = as ?? (`h${level}` satisfies HeadingTag);

    return (
        <Tag className={cn(headingVariants({ variant, className }))}>
            {children}
        </Tag>
    );
}

export { Heading, headingVariants };
