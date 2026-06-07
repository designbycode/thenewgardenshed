import Hero from '@/components/main/hero';
import HeroDividerBar from '@/components/main/hero-divider';
import LocalExperiences from '@/components/sections/local-experiences';
import MainLayout from '@/layouts/main-layout';

export default function Home() {
    return (
        <>
            <Hero />
            <HeroDividerBar />
            <LocalExperiences />
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
