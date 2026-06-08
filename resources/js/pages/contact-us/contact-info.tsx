import { Clock, Mail, Phone } from 'lucide-react';
import ClockImage from '@/../images/clocks.webp';
import EmailImage from '@/../images/mail.webp';
import PhoneImage from '@/../images/old-phone.webp';
import HeadingBlock from '@/components/typography/heading-block';
import ContactCard from './contact-card';

const contactMethods = [
    {
        image: PhoneImage,
        icon: Phone,
        label: 'Direct Mobile',
        value: '+27 (0)82 300 5290',
        subText: 'Available on WhatsApp & Calls',
    },
    {
        image: EmailImage,
        icon: Mail,
        label: 'Direct Email',
        value: 'sleep@thegardenshed.co.za',
        subText: 'Typically replies in under 2 hours',
    },
    {
        image: ClockImage,
        icon: Clock,
        label: 'Check-In Times',
        value: 'Check-In: 14:00 - 19:00',
        subText: 'Check-out: 10:00 (Late on request)',
    },
];

export default function ContactInfo() {
    return (
        <>
            <HeadingBlock
                className="mx-auto text-center"
                badge={{ text: 'Connect & Locate Us' }}
                heading="Contact The Garden Shed"
                description={
                    <>
                        Have questions about local golf club tee bookings,
                        custom dinners, group rates, or transport from the
                        airport? We'd love to help plan your ultimate Winelands
                        holiday.
                    </>
                }
            />

            <div
                className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3"
                id="contact-info-boxes"
            >
                {contactMethods.map((method) => (
                    <ContactCard key={method.label} {...method} />
                ))}
            </div>
        </>
    );
}
