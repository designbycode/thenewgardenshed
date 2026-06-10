import { Form, usePage } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/core';
import {
    Check,
    CheckCircle,
    ChevronsUpDown,
    LoaderCircle,
    Lock,
    MessageCircle,
    MessageSquareText,
    Send,
    Star,
    ThumbsUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import HeadingBlock from '@/components/typography/heading-block';
import MainWrapper from '@/layouts/main/main-wrapper';
import MainLayout from '@/layouts/main-layout';
import { create, store } from '@/routes/guest-book';

interface CreatePageProps extends PageProps {
    review_authenticated: boolean;
    rooms: string[];
    flash: {
        review_created?: boolean;
    } & PageProps['flash'];
}

const COUNTRIES = [
    'South Africa',
    'Botswana',
    'Eswatini',
    'Lesotho',
    'Namibia',
    'Zimbabwe',
    'Angola',
    'Kenya',
    'Mozambique',
    'Tanzania',
    'Zambia',
    'Nigeria',
    'Ghana',
    'Rwanda',
    'Mauritius',
    'Seychelles',
    'United Kingdom',
    'Germany',
    'France',
    'Netherlands',
    'Belgium',
    'Switzerland',
    'Austria',
    'Italy',
    'Spain',
    'Portugal',
    'Sweden',
    'Norway',
    'Denmark',
    'United States',
    'Canada',
    'Australia',
    'New Zealand',
    'China',
    'Japan',
    'India',
    'Brazil',
    'Argentina',
    'Other',
];

const RATING_CATEGORIES = [
    { key: 'overall_rating', label: 'Overall' },
    { key: 'cleanliness_rating', label: 'Cleanliness' },
    { key: 'comfort_rating', label: 'Comfort' },
    { key: 'service_rating', label: 'Service' },
    { key: 'location_rating', label: 'Location' },
    { key: 'value_rating', label: 'Value' },
] as const;

function StarSelect({ name, label, error }: { name: string; label: string; error?: string }) {
    const [hovered, setHovered] = useState(0);
    const [selected, setSelected] = useState(0);

    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="flex flex-row-reverse gap-0.5">
                {[5, 4, 3, 2, 1].map((val) => (
                    <label
                        key={val}
                        className="cursor-pointer p-0.5 transition-transform hover:scale-110"
                        onMouseEnter={() => setHovered(val)}
                        onMouseLeave={() => setHovered(0)}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={val}
                            className="sr-only"
                            onChange={() => setSelected(val)}
                        />
                        <Star
                            size={20}
                            className={
                                val <= (hovered || selected)
                                    ? 'fill-yellow-500 text-yellow-500'
                                    : 'fill-muted text-muted-foreground/30'
                            }
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}

export default function GuestBookCreate() {
    const { review_authenticated, rooms, flash } = usePage<CreatePageProps>().props;
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(!review_authenticated);
    const [countryOpen, setCountryOpen] = useState(false);
    const [country, setCountry] = useState('');
    const [roomOpen, setRoomOpen] = useState(false);

    useEffect(() => {
        if (flash?.review_created) {
            toast.success('Your review has been submitted successfully!');
        }
    }, [flash?.review_created]);
    const [roomNumber, setRoomNumber] = useState('');
    const [stayDate, setStayDate] = useState<Date>(new Date());
    const [ratings, setRatings] = useState<Record<string, number>>({
        overall_rating: 0,
        cleanliness_rating: 0,
        comfort_rating: 0,
        service_rating: 0,
        location_rating: 0,
        value_rating: 0,
    });

    return (
        <MainWrapper className="py-18">
            <HeadingBlock
                className="mx-auto text-center"
                badge={{ text: 'Share Your Experience', icon: MessageCircle }}
                heading="Leave a Review"
                headingLevel={1}
                description={
                    <>
                        We'd love to hear about your stay at The Garden Shed.
                        Your feedback helps us keep improving.
                    </>
                }
            />

            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Lock size={18} />
                            Review Page Access
                        </DialogTitle>
                        <DialogDescription>
                            Enter the password to access the review form.
                        </DialogDescription>
                    </DialogHeader>
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        onSuccess={() => setPasswordDialogOpen(false)}
                        className="space-y-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <input type="hidden" name="action" value="verify" />
                                <div className="space-y-1.5">
                                    <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground">
                                        Password
                                    </Label>
                                    <Input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="Enter password"
                                    />
                                    <InputError message={errors.password} />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-5.5 text-xs font-semibold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary/90 disabled:opacity-60"
                                >
                                    {processing ? (
                                        <LoaderCircle size={14} className="animate-spin" />
                                    ) : (
                                        <Lock size={14} />
                                    )}
                                    <span>{processing ? 'Verifying...' : 'Enter'}</span>
                                </Button>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>

            {review_authenticated && !flash?.review_created && (
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-md sm:p-8">
                        <h3 className="mb-6 border-b border-border pb-3 font-serif text-xl font-normal text-foreground">
                            Your Review
                        </h3>

                        <Form
                            {...store.form()}
                            className="space-y-6"
                            resetOnSuccess
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground">
                                                Your Name
                                            </Label>
                                            <Input
                                                type="text"
                                                id="name"
                                                name="name"
                                                placeholder="e.g. Jane Doe"
                                            />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
                                                Email Address
                                            </Label>
                                            <Input
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder="e.g. jane@example.com"
                                            />
                                            <InputError message={errors.email} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-muted-foreground">
                                                Country
                                            </Label>
                                            <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                                                <PopoverTrigger asChild>
                                                    <button
                                                        type="button"
                                                        role="combobox"
                                                        aria-expanded={countryOpen}
                                                        className="border-input placeholder:text-muted-foreground flex h-9 w-full min-w-0 cursor-pointer items-center justify-between rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] md:text-sm dark:bg-input/30"
                                                    >
                                                        {country || <span className="text-muted-foreground">Select your country</span>}
                                                        <ChevronsUpDown size={14} className="ml-2 shrink-0 opacity-50" />
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
                                                    <Command>
                                                        <CommandInput placeholder="Search countries..." />
                                                        <CommandList>
                                                            <CommandEmpty>No country found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {COUNTRIES.map((c) => (
                                                                    <CommandItem
                                                                        key={c}
                                                                        value={c}
                                                                        onSelect={(currentValue) => {
                                                                            setCountry(currentValue === country ? '' : currentValue);
                                                                            setCountryOpen(false);
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            size={14}
                                                                            className={country === c ? 'opacity-100' : 'opacity-0'}
                                                                        />
                                                                        {c}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <input type="hidden" name="country" value={country} />
                                            <InputError message={errors.country} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-muted-foreground">
                                                Room / Suite
                                            </Label>
                                            <Popover open={roomOpen} onOpenChange={setRoomOpen}>
                                                <PopoverTrigger asChild>
                                                    <button
                                                        type="button"
                                                        role="combobox"
                                                        aria-expanded={roomOpen}
                                                        className="border-input placeholder:text-muted-foreground flex h-9 w-full min-w-0 cursor-pointer items-center justify-between rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] md:text-sm dark:bg-input/30"
                                                    >
                                                        {roomNumber || <span className="text-muted-foreground">Select your room</span>}
                                                        <ChevronsUpDown size={14} className="ml-2 shrink-0 opacity-50" />
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
                                                    <Command>
                                                        <CommandInput placeholder="Search rooms..." />
                                                        <CommandList>
                                                            <CommandEmpty>No room found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {rooms.map((r) => (
                                                                    <CommandItem
                                                                        key={r}
                                                                        value={r}
                                                                        onSelect={(currentValue) => {
                                                                            setRoomNumber(currentValue === roomNumber ? '' : currentValue);
                                                                            setRoomOpen(false);
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            size={14}
                                                                            className={roomNumber === r ? 'opacity-100' : 'opacity-0'}
                                                                        />
                                                                        {r}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <input type="hidden" name="room_number" value={roomNumber} />
                                            <InputError message={errors.room_number} />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="stay_date" className="text-xs font-semibold text-muted-foreground">
                                            Stay Date
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    id="stay_date"
                                                    className="border-input placeholder:text-muted-foreground flex h-9 w-full min-w-0 cursor-pointer items-center rounded-md border bg-transparent px-3 py-1 text-left text-base shadow-xs transition-[color,box-shadow] md:text-sm dark:bg-input/30"
                                                >
                                                    {stayDate.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={stayDate}
                                                    onSelect={(date) => date && setStayDate(date)}
                                                    captionLayout="dropdown"
                                                    startMonth={new Date(2020, 0)}
                                                    endMonth={new Date(2030, 11)}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <input type="hidden" name="stay_date" value={stayDate.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })} />
                                        <InputError message={errors.stay_date} />
                                    </div>

                                    <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Ratings
                                        </p>
                                        {RATING_CATEGORIES.map(({ key, label }) => (
                                            <div key={key} className="flex items-center justify-between gap-2">
                                                <span className="text-sm text-muted-foreground">{label}</span>
                                                <div className="flex flex-row-reverse gap-0.5">
                                                    {[5, 4, 3, 2, 1].map((val) => (
                                                        <label
                                                            key={val}
                                                            className="cursor-pointer p-0.5 transition-transform hover:scale-110"
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={key}
                                                                value={val}
                                                                checked={ratings[key] === val}
                                                                className="sr-only"
                                                                onChange={() => setRatings(prev => ({ ...prev, [key]: val }))}
                                                            />
                                                            <Star
                                                                size={20}
                                                                className={
                                                                    val <= ratings[key]
                                                                        ? 'fill-yellow-500 text-yellow-500'
                                                                        : 'fill-muted text-muted-foreground/30'
                                                                }
                                                            />
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        <InputError message={errors.overall_rating} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="review" className="text-xs font-semibold text-muted-foreground">
                                            Your Review
                                        </Label>
                                        <Textarea
                                            id="review"
                                            name="review"
                                            placeholder="Tell us about your experience..."
                                            className="min-h-32"
                                            rows={4}
                                        />
                                        <InputError message={errors.review} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="suggestions" className="text-xs font-semibold text-muted-foreground">
                                            Suggestions <span className="font-normal text-muted-foreground/60">(optional)</span>
                                        </Label>
                                        <Textarea
                                            id="suggestions"
                                            name="suggestions"
                                            placeholder="Any suggestions for improvement..."
                                            className="min-h-24"
                                            rows={3}
                                        />
                                        <InputError message={errors.suggestions} />
                                    </div>

                                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                                        <input type="hidden" name="would_recommend" value="0" />
                                        <input
                                            type="checkbox"
                                            name="would_recommend"
                                            value="1"
                                            defaultChecked
                                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                        />
                                        <div>
                                            <span className="text-sm font-medium text-foreground">
                                                I would recommend The Garden Shed to a friend
                                            </span>
                                            <ThumbsUp size={14} className="ml-1.5 inline text-primary" />
                                        </div>
                                    </label>
                                    <InputError message={errors.would_recommend} />
                                    <InputError message={errors.password} />

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-5.5 text-xs font-semibold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary/90 disabled:opacity-60"
                                    >
                                        {processing ? (
                                            <LoaderCircle size={14} className="animate-spin" />
                                        ) : (
                                            <Send size={14} />
                                        )}
                                        <span>{processing ? 'Submitting...' : 'Submit Review'}</span>
                                    </Button>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            )}

            {flash?.review_created && (
                <div className="mx-auto max-w-2xl text-center">
                    <div className="rounded-2xl border border-border bg-card p-8 shadow-md">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <CheckCircle size={32} className="text-primary" />
                        </div>
                        <h3 className="mb-2 font-serif text-xl font-normal text-foreground">
                            Thank You!
                        </h3>
                        <p className="mb-6 text-muted-foreground">
                            Your review has been submitted successfully. It will appear on our
                            guest wall after moderation.
                        </p>
                        <Button
                            onClick={() => { window.location.href = create.url(); }}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-5.5 text-xs font-semibold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary/90"
                        >
                            <MessageSquareText size={14} />
                            <span>Write Another Review</span>
                        </Button>
                    </div>
                </div>
            )}
        </MainWrapper>
    );
}

GuestBookCreate.displayName = 'GuestBookCreate';

GuestBookCreate.layout = (page: any) => (
    <MainLayout
        title={'Leave a Review | The New Garden Shed'}
        description={
            'Share your experience at The Garden Shed. Leave a review and let others know about your stay.'
        }
    >
        {page}
    </MainLayout>
);
