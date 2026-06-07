import { useRef } from 'react';
import { Form } from '@inertiajs/react';
import { LoaderCircle, Send } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { store } from '@/routes/contact-us';

export default function ContactForm() {
    const scrollRef = useRef(0);

    return (
        <Form
            {...store.form()}
            resetOnSuccess={['name', 'email', 'subject', 'message']}
            onBefore={() => {
                scrollRef.current = window.scrollY;
            }}
            onFinish={() => {
                requestAnimationFrame(() => {
                    window.scrollTo(0, scrollRef.current);
                });
            }}
            className="space-y-4"
        >
            {({ processing, errors }) => (
                <>
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="contact-name"
                            className="text-xs font-semibold text-muted-foreground"
                        >
                            Your Full Name
                        </Label>
                        <Input
                            type="text"
                            id="contact-name"
                            name="name"
                            placeholder="e.g. Nicolaas van der Merwe"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-1.5">
                        <Label
                            htmlFor="contact-email"
                            className="text-xs font-semibold text-muted-foreground"
                        >
                            Email Address
                        </Label>
                        <Input
                            type="email"
                            id="contact-email"
                            name="email"
                            placeholder="e.g. Nicolaas@gmail.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-1.5">
                        <Label
                            htmlFor="contact-subject"
                            className="text-xs font-semibold text-muted-foreground"
                        >
                            Subject
                        </Label>
                        <Input
                            type="text"
                            id="contact-subject"
                            name="subject"
                            placeholder="e.g. Group booking discount / Airport shuttle"
                        />
                        <InputError message={errors.subject} />
                    </div>

                    <div className="space-y-1.5">
                        <Label
                            htmlFor="contact-message"
                            className="text-xs font-semibold text-muted-foreground"
                        >
                            Your Message
                        </Label>
                        <Textarea
                            id="contact-message"
                            name="message"
                            placeholder="Tell us what you would like to know..."
                            className="min-h-40"
                            rows={4}
                        />
                        <InputError message={errors.message} />
                    </div>

                    <Button
                        type="submit"
                        disabled={processing}
                        className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-5.5 text-xs font-semibold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary/90 disabled:opacity-60"
                    >
                        {processing ? (
                            <LoaderCircle size={14} className="animate-spin" />
                        ) : (
                            <Send size={14} />
                        )}
                        <span>
                            {processing ? 'Sending...' : 'Send Message'}
                        </span>
                    </Button>
                </>
            )}
        </Form>
    );
}
