import { Head } from '@inertiajs/react';
import { usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import HeaderSection from '@/Components/card/HeaderCard';

export default function AdminDashboard() {
    const { auth }: any = usePage().props;

    const today = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <DashboardLayout>
            <Head title="Admin" />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <HeaderSection title={`Selamat datang Kembali, ${auth.user.name}`} date={today} />
                </div>
            </div>
        </DashboardLayout>
    );
}
