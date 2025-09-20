import { Head } from '@inertiajs/react';
import DashboardLayout from "@/Layouts/DashboardLayout";
import ClassCard from '@/Components/card/ClassCard';

export default function AdminDashboard() {
    return (
        <DashboardLayout>
            <Head title="Kelasku" />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <ClassCard />
                </div>
            </div>
        </DashboardLayout>
    );
}
