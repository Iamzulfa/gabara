import { Class, DiscussionTabProps } from "@/types/types";

export default function DiscussionTab({ classData }: DiscussionTabProps) {
    return (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Forum Diskusi</h2>
            {classData.discussions?.length > 0 ? (
                <ul className="mt-4 space-y-2">
                    {classData.discussions.map((discussion) => (
                        <li key={discussion.id} className="text-sm text-gray-600">
                            {discussion.title} - {new Date(discussion.created_at).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500 mt-2">Belum ada diskusi.</p>
            )}
        </div>
    );
}
