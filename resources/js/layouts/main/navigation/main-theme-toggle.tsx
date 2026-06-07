'use client';
import { Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

export default function MainThemeToggle() {
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const toggle = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <button onClick={toggle} aria-label="Toggle theme">
            {resolvedAppearance === 'dark' ? (
                <Sun className="size-4" />
            ) : (
                <Moon className="size-4" />
            )}
        </button>
    );
}
