import { Head } from '@inertiajs/react';
import { usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import HeaderSection from '@/Components/card/HeaderCard';
import DashboardCard from '@/Components/card/DashboardCard';

export default function MentorDashboard() {
    const { auth }: any = usePage().props;

    const today = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <DashboardLayout>
            <Head title="Dashboard" />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <HeaderSection title={`Selamat datang Kembali, ${auth.user.name}`} date={today} />
                    <DashboardCard />
                </div>
            </div>
        </DashboardLayout>
    );
}
