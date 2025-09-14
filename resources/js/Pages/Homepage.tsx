import { Head } from "@inertiajs/react";

import AppLayout from "@/Layouts/AppLayout";

import AppFooter from "@/Components/app/AppFooter";

import HeroSection from "@/Pages/Homepage/HeroSection";
import ServiceSection from "@/Pages/Homepage/ServiceSection";
import MitraSection from "@/Pages/Homepage/MitraSection";
import FaqSection from "@/Pages/Homepage/FaqSection";
import TestimonialsSection from "@/Pages/Homepage/TestimoniSection";
import CTASection from "@/Pages/Homepage/CTASection";

export default function Home() {
    return (
        <>
            <AppLayout>
                <Head title="Gabara" />
                <HeroSection />
                <ServiceSection />
                <TestimonialsSection />
                <MitraSection />
                <FaqSection />
                <CTASection />
                <AppFooter />
            </AppLayout>
        </>
    );
}
