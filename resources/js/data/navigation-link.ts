import { home } from '@/routes';
import { index as contactUs } from '@/routes/contact-us';
import { index as facilitiesIndex } from '@/routes/facilities';
import { index as roomsIndex } from '@/routes/rooms';

const navigationLinks = [
    { name: 'Home', href: home() },
    { name: 'Our Rooms', href: roomsIndex() },
    { name: 'Facilities', href: facilitiesIndex() },
    { name: 'Contact Us', href: contactUs() },
];

export { navigationLinks };
