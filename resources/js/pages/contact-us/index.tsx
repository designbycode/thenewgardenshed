import MainWrapper from '@/layouts/main/main-wrapper';
import MainLayout from '@/layouts/main-layout';
import ContactInfo from './contact-info';
import ContactForm from './contact-form';
import ContactLocation from './contact-location';

export default function ContactUsIndex() {
    return (
        <MainWrapper className="pt-18">
            <ContactInfo />

            <div
                className="mb-16 grid grid-cols-1 items-start gap-6 lg:grid-cols-12"
                id="contact-split-container"
            >
                <div className="rounded-2xl border border-border bg-background p-6 shadow-md sm:p-8 lg:col-span-6">
                    <h3 className="mb-6 border-b border-border pb-3 font-serif text-xl font-normal text-foreground">
                        Send an Instant Message
                    </h3>
                    <ContactForm />
                </div>

                <div className="lg:col-span-6">
                    <ContactLocation />
                </div>
            </div>
        </MainWrapper>
    );
}

ContactUsIndex.displayName = 'ContactUsIndex';

ContactUsIndex.layout = (page: any) => (
    <MainLayout title={'Contact Us'} description={'Get in touch with us'}>
        {page}
    </MainLayout>
);
