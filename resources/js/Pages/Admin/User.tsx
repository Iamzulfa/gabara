import { Head } from '@inertiajs/react';
import DashboardLayout from "@/Layouts/DashboardLayout";
import UserTable from './table/UserTable';

export default function AssignmentDetail() {
    return (
        <DashboardLayout>
            <Head title="User" />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <UserTable />
                </div>
            </div>
        </DashboardLayout>
    );
}
