import { Head } from "@inertiajs/react";
import PageBreadcrumb from "@/Components/ui/breadcrumb/Breadcrumb";
import UserMetaCard from "@/Components/profile/UserMetaCard";
import UserInfoCard from "@/Components/profile/UserInfoCard";
import DashboardLayout from "@/Layouts/DashboardLayout";
import ChangePasswordCard from "@/Components/profile/ChangePasswordCard";

export default function UserProfiles() {
    return (
        <DashboardLayout>
            <Head title="Profile" />
            <PageBreadcrumb pageTitle="Profile" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    Profile
                </h3>
                <div className="space-y-6">
                    <UserMetaCard />
                    <UserInfoCard />
                    <ChangePasswordCard />
                </div>
            </div>
        </DashboardLayout>
    );
}
