import { Head } from '@inertiajs/react';
import DashboardLayout from "@/Layouts/DashboardLayout";
import AnnouncementDetailCard from '@/Components/card/AnnouncementDetailCard';

export default function AnnouncementDetail() {
    return (
        <DashboardLayout>
            <Head title="Pengumuman" />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <AnnouncementDetailCard />
                </div>
            </div>
        </DashboardLayout>
    );
}
