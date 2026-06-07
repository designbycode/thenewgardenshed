export interface RoomItem {
    id: number;
    slug: string;
    name: string;
    type: 'luxury' | 'standard' | 'cozy';
    description: string;
    shortDescription: string;
    pricePerNight: number;
    capacity: number;
    bedType: string;
    bathroomType: string;
    thumbnail?: string | null;
    cardImage?: string | null;
    imageUrl?: string | null;
    images_count?: number;
    amenities?: string[];
    media?: MediaItem[];
}

export interface AmenityItem {
    id: number;
    slug: string;
    name: string;
    description: string;
    icon: string;
    display_order?: number;
}

export interface MediaItem {
    id: number;
    url: string;
    thumb: string;
    preview: string;
    name: string;
    order: number;
    size: number;
}

export interface LocalEventItem {
    id: string;
    title: string;
    date: string;
    description: string;
    location: string;
    distance: string;
    category: 'festival' | 'golf' | 'wine' | 'nature';
}
