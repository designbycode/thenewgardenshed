import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ContactCardProps {
    icon: LucideIcon;
    image: string;
    label: string;
    value: string;
    subText: string;
}

export default function ContactCard({
    icon: Icon,
    label,
    value,
    subText,
    image,
}: ContactCardProps) {
    return (
        <Card className="group relative isolate overflow-clip">
            <CardContent className="flex items-start gap-4 p-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                    <Icon size={18} />
                </div>
                <div>
                    <span className="mb-0.5 block font-mono text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                        {label}
                    </span>
                    <span className="block text-base font-normal text-foreground">
                        {value}
                    </span>
                    <span className="mt-1 block text-xs text-primary">
                        {subText}
                    </span>
                </div>
            </CardContent>
            <div className="absolute inset-0 isolate -z-10">
                <div className="absolute inset-0 z-10 bg-background/25 transition-all duration-150 group-hover:backdrop-blur-xs"></div>
                <img
                    src={image}
                    alt={label}
                    className="z-0 opacity-30 dark:opacity-10"
                />
            </div>
        </Card>
    );
}
