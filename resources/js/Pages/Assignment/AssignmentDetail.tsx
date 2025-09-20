import { Head } from '@inertiajs/react';
import DashboardLayout from "@/Layouts/DashboardLayout";
import AssignmentDetailCard from '@/Components/card/AssignmentDetailCard';

export default function AssignmentDetail() {
    return (
        <DashboardLayout>
            <Head title="Tugas" />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <AssignmentDetailCard />
                </div>
            </div>
        </DashboardLayout>
    );
}
