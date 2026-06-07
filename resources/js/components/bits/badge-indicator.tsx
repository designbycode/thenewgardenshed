import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function BadgeIndicator({
    children,
    className,
    icon: Icon = null,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    icon?: LucideIcon | null | false;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={cn(
                `animate-fade-in mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-primary`,
                className,
            )}
            {...props}
        >
            {Icon && <Icon size={14} className="text-primary" />}
            <span>{children}</span>
        </motion.div>
    );
}

BadgeIndicator.displayName = 'BadgeIndicator';
