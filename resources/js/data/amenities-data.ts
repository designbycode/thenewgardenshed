export interface AmenityItem {
    id?: number;
    slug?: string;
    name: string;
    description: string;
    icon: string;
    display_order?: number;
}

export const AMENITIES_DATA: AmenityItem[] = [
    {
        name: 'Farm-Fresh Breakfast',
        description:
            'Included in your rate. Savor local seasonal fruits, freshly baked croissants or farm bread, South African cheese, and full hot breakfasts prepared to order in our mountain-view dining hall.',
        icon: 'UtensilsCrossed',
        slug: '',
    },
    {
        name: 'Swimming Pool',
        description:
            'Our sparkling communal swimming pool is set inside private lawns with mountain backdrops, pristine vineyards, and plush sun loungers for peaceful relaxation.',
        icon: 'Waves',
    },
    {
        name: 'Full Climate Control',
        description:
            'All 7 guest suites are equipped with state-of-the-art silent air-conditioning (heating and cooling) systems to guarantee a comfortable sleep in any season.',
        icon: 'Wind',
    },
    {
        name: 'Exceptional Security',
        description:
            'Enjoy lock-up-and-go peace of mind. Safe parking is provided on the secure smallholding grounds behind heavy electronic gates with CCTV cameras.',
        icon: 'ShieldCheck',
    },
    {
        name: 'Fast Wireless Internet',
        description:
            'Uncapped, high-speed Wi-Fi network ensures you stay connected, catch up on work, or stream your favorite media effortlessly from anywhere on the estate.',
        icon: 'Wifi',
    },
    {
        name: 'South African Braai & Platters',
        description:
            'Farm-fresh lunch boxes, cold cut vineyard platters, romantic picnic baskets, and home-cooked traditional South African dinners are curated and cooked on request.',
        icon: 'Flame',
    },
];
