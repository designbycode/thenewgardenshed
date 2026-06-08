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

export interface ReviewPage {
    data: ReviewItem[];
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
}

export interface ReviewStats {
    total: number;
    avg_overall: number;
    avg_cleanliness: number;
    avg_comfort: number;
    avg_service: number;
    avg_location: number;
    avg_value: number;
    recommend_pct: number;
}

export interface ReviewItem {
    id: number;
    name: string;
    country: string;
    roomNumber: string;
    stayDate: string;
    overallRating: number;
    cleanlinessRating?: number;
    comfortRating?: number;
    serviceRating?: number;
    locationRating?: number;
    valueRating?: number;
    review: string;
    suggestions?: string | null;
    wouldRecommend: boolean;
    createdAt: string;
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
