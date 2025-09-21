import { usePage } from "@inertiajs/react";
import { AnnouncementPageProps } from "@/types/types";

import PageBreadcrumb from "@/Components/ui/breadcrumb/Breadcrumb";
import { createMarkup } from "@/utils/htmlMarkup";
import { formatCalendarDate, formatDateTime } from "@/utils/formatDate";

export default function AnnouncementDetailCard() {
    const { props } = usePage<AnnouncementPageProps>();
    const { announcement, userRole } = props;

    return (
        <>
            <PageBreadcrumb
                crumbs={[
                    { label: "Home", href: "/dashboard" },
                    { label: announcement.title },
                ]}
            />

            <div className="mt-6 p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">{announcement.title}</h2>
                <div className="mt-4 text-sm text-gray-600">
                    <div className="flex gap-1">
                        <span className="font-medium">Diposting oleh:</span>
                        <span>{announcement.admin.name}</span>
                    </div>
                    <div className="mt-1">
                        <span>{`${formatDateTime(announcement.posted_at)} WIB`}</span>
                    </div>
                </div>

                {announcement.thumbnail && (
                    <div className="mt-6 border-t-2 border-gray-200 pt-4">
                        <div className="flex justify-center">
                            <img
                                src={announcement.thumbnail}
                                alt={announcement.title}
                                className="md:max-w-xl h-auto rounded-lg"
                            />
                        </div>
                    </div>
                )}

                <div className="mt-4 border-t-2 border-gray-200 pt-4 text-sm text-gray-500" dangerouslySetInnerHTML={createMarkup(announcement.content || "")} />
            </div>
        </>
    );
}
