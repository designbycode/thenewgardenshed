import type { LucideIcon } from 'lucide-react';

import BadgeIndicator from '@/components/bits/badge-indicator';
import { Heading } from '@/components/typography/heading';
import { Paragraph } from '@/components/typography/paragraph';
import { cn } from '@/lib/utils';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingBlockProps = {
    className?: string;
    badge?: {
        text: string;
        icon?: LucideIcon;
        className?: string;
    };
    heading?: string;
    headingLevel?: HeadingLevel;
    headClassName?: string;
    description?: React.ReactNode;
    descriptionClassName?: string;
    children?: React.ReactNode;
    size?: 'default' | 'sm';
};

function HeadingBlock({
    badge,
    className,
    heading,
    headClassName,
    headingLevel = 1,
    description,
    descriptionClassName,
    children,
    size = 'default',
    ...props
}: HeadingBlockProps) {
    return (
        <div className={cn(
            size === 'default' && 'mb-16 max-w-2xl space-y-6',
            size === 'sm' && 'max-w-none space-y-4',
            className,
        )} {...props}>
            {badge && (
                <BadgeIndicator icon={badge.icon} className={cn('mb-0', badge.className)}>
                    {badge.text}
                </BadgeIndicator>
            )}
            {heading && (
                <Heading level={headingLevel} className={headClassName}>
                    {heading}
                </Heading>
            )}
            {description && (
                <Paragraph variant="default" className={cn('font-sans', descriptionClassName)}>
                    {description}
                </Paragraph>
            )}
            {children}
        </div>
    );
}

export default HeadingBlock;
