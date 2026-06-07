import { useState } from 'react';
import { CheckCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');

    function handleInquirySubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (!name || !email || !subject || !message) {
            setError('Please complete all fields before sending.');
            return;
        }

        setIsSent(true);
    }

    if (isSent) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CheckCircle size={28} />
                </div>
                <h4 className="mb-1 font-serif text-lg font-semibold text-foreground">
                    Message Sent Successfully!
                </h4>
                <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                    Thank you for connecting. Our farm hosts have received your
                    message and will review it immediately.
                </p>
                <Button
                    onClick={() => {
                        setName('');
                        setEmail('');
                        setSubject('');
                        setMessage('');
                        setIsSent(false);
                    }}
                    variant="outline"
                    className="border-border bg-muted text-xs font-semibold tracking-wider text-foreground uppercase hover:bg-muted/80"
                >
                    Send Another Message
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleInquirySubmit} className="space-y-4">
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
                    placeholder="e.g. Nicolaas van der Merwe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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
                    placeholder="e.g. Nicolaas@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
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
                    placeholder="e.g. Group booking discount / Airport shuttle"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
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
                    placeholder="Tell us what you would like to know..."
                    className="min-h-40"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>

            {error && (
                <p className="text-xs font-semibold text-destructive">
                    {error}
                </p>
            )}

            <Button
                type="submit"
                className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-5.5 text-xs font-semibold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary/90"
            >
                <Send size={14} />
                <span>Send Message</span>
            </Button>
        </form>
    );
}
