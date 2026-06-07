import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ContactCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
    subText: string;
}

export default function ContactCard({
    icon: Icon,
    label,
    value,
    subText,
}: ContactCardProps) {
    return (
        <Card className="relative overflow-clip">
            <Icon
                size={140}
                className="absolute -top-10 -right-10 -rotate-12 text-muted-foreground/10"
            />
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
        </Card>
    );
}
