import { Head } from '@inertiajs/react';
import DashboardLayout from "@/Layouts/DashboardLayout";
import DiscussionShowCard from '@/Components/card/DiscussionShowCard';

export default function StudentDashboard() {
    return (
        <DashboardLayout>
            <Head title="Kelasku" />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <DiscussionShowCard />
                </div>
            </div>
        </DashboardLayout>
    );
}
