import { Head } from '@inertiajs/react';
import DashboardLayout from "@/Layouts/DashboardLayout";
import AnnouncementCard from './card/AnnouncementCard';

export default function AssignmentDetail() {
    return (
        <DashboardLayout>
            <Head title="Pengumuman" />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <AnnouncementCard />
                </div>
            </div>
        </DashboardLayout>
    );
}
