export interface LocalEvent {
    id: string;
    title: string;
    date: string;
    description: string;
    location: string;
    distance: string;
    category: 'festival' | 'golf' | 'wine' | 'nature';
}

export const EVENTS_DATA: LocalEvent[] = [
    {
        id: 'riebeek-olive',
        title: 'Riebeek Kasteel Olive Festival',
        date: 'Annually in May',
        description:
            'Experience South Africa’s premier olive festival! Sample artisanal cured olives, award-winning cold-pressed olive oils, local wines, organic preserves, and enjoy vibrant live music close by.',
        location: 'Riebeek Kasteel (35 min drive)',
        distance: '32 km',
        category: 'festival',
    },
    {
        id: 'wellington-golf',
        title: 'Wellington Golf Club',
        date: 'Year Round Trails',
        description:
            'Play a game of golf on Wellington’s scenic 9-hole/18-tee course, situated directly down the street. It provides superb rolling greens and magnificent vistas of the mountain passes rolling overhead.',
        location: 'Wellington Central',
        distance: '2.5 km',
        category: 'golf',
    },
    {
        id: 'bainskloof-hiking',
        title: 'Bain’s Kloof Pass & Hikes',
        date: 'Year Round Trails',
        description:
            'A monument and national heritage site. Traverse absolute stunning mountain passes, pristine river rock pools, and panoramic trekking trails overlooking the entire Breede River Valley landscape.',
        location: 'Bain’s Kloof Nature Reserve',
        distance: '8 km',
        category: 'nature',
    },
    {
        id: 'wine-tasting-route',
        title: 'Wellington Wine Tasting Route',
        date: 'Mon - Sun Bookings',
        description:
            'Wellington is home to legendary wineries, including boutique estates and globally awarded distillers. Tour the famous Bovlei Valley, buy local Pinotage, or sample hand-crafted potstill brandies.',
        location: 'Wellington Valleys',
        distance: 'On Our Doorstep',
        category: 'wine',
    },
];
