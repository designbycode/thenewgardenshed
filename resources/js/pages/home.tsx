import Hero from '@/components/main/hero';
import HeroDividerBar from '@/components/main/hero-divider';
import TestimonialsCarousel from '@/components/main/testimonials-carousel';
import LocalExperiences from '@/components/sections/local-experiences';
import MainLayout from '@/layouts/main-layout';
import type { ReviewItem } from '@/types/data';

export default function Home({ reviews }: { reviews: ReviewItem[] }) {
    return (
        <>
            <Hero />
            <HeroDividerBar />
            <LocalExperiences />
            <TestimonialsCarousel reviews={reviews} />
        </>
    );
}

Home.displayName = 'Home';

Home.layout = (page: any) => (
    <MainLayout
        title={'Welcome to The New Garden Shed'}
        description={
            'Your premium garden shed destination — custom designs, quality craftsmanship.'
        }
    >
        {page}
    </MainLayout>
);
