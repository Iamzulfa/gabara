// resources/js/Components/profile/UserInfoCard.tsx
import { usePage } from "@inertiajs/react";

type User = {
    name: string;
    email: string;
    phone: string;
    role: string;
    parent_name?: string;
    parent_phone?: string;
    address?: string;
    expertise?: string;
    scope?: string;
};

export default function UserInfoCard() {
    const user = usePage().props.auth.user as User;

    return (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="w-full">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 lg:mb-6">
                        Informasi Pribadi
                    </h4>

                    {/* Grid 2 kolom (responsive) */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                        <div className="flex flex-col gap-6">
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Nama Lengkap
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {user.name}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Email
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90 break-all">
                                    {user.email}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    WhatsApp
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {user.phone ?? "-"}
                                </p>
                            </div>
                        </div>

                        {/* Kolom 2 (role-specific) */}
                        <div className="flex flex-col gap-6">
                            {user.role === "student" && (
                                <>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Alamat
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90 break-words max-w-xl">
                                            {user.address || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Nama Orang Tua / Wali
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user.parent_name || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Nomor HP Orang Tua / Wali
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user.parent_phone || "-"}
                                        </p>
                                    </div>
                                </>
                            )}

                            {user.role === "mentor" && (
                                <>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Bidang Keilmuan (Expertise)
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user.expertise || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Pekerjaan / Scope
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {user.scope || "-"}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
