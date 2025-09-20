import { useState, useCallback } from "react";
import { router, usePage } from "@inertiajs/react";
import { toast } from "react-toastify";

import { ModalClass } from "../modal/ClassModal";
import Button from "@/Components/ui/button/Button";
import Badge from "@/Components/ui/badge/Badge";
import HeaderSection from "@/Components/card/HeaderSectionCard";
import EmptyState from "@/Components/empty/EmptyState";
import ImageFallback from "@/Components/ui/images/ImageFallback";

import { confirmDialog } from "@/utils/confirmationDialog";
import { createMarkup } from "@/utils/htmlMarkup";

import { LuPencil, LuTrash2 } from "react-icons/lu";

export default function ClassCard() {
    const { props }: any = usePage();
    const classes = props.classes || [];
    const role = props.auth?.user?.role;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editClass, setEditClass] = useState<any | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleCreate = useCallback(() => {
        setEditClass(null);
        setIsModalOpen(true);
    }, []);

    const handleDelete = useCallback(async (id: string) => {
        const confirmed = await confirmDialog({
            title: "Hapus Kelas?",
            text: "Kelas yang dihapus tidak dapat dikembalikan!",
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
        });

        if (!confirmed) return;

        setDeletingId(id);
        router.delete(route("classes.destroy", id), {
            preserveScroll: true,
            onSuccess: () => {
                // toast.success("Kelas berhasil dihapus");
                setDeletingId(null);
            },
            onError: () => {
                // toast.error("Gagal menghapus kelas");
                setDeletingId(null);
            },
        });
    }, []);

    const handleEdit = useCallback((item: any) => {
        setEditClass(item);
        setIsModalOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setIsModalOpen(false);
        setEditClass(null);
    }, []);

    return (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
            {/* Header */}
            <HeaderSection
                title="Kelas"
                buttonLabel={role === "student" ? "Enroll" : "Tambah"}
                onButtonClick={handleCreate}
            />

            {/* Modal */}
            <ModalClass
                isOpen={isModalOpen}
                onClose={handleClose}
                classData={editClass}
            />

            {/* Cards */}
            {classes.length === 0 && <EmptyState title="Belum ada kelas" />}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((item: any) => (
                    <div
                        key={item.id}
                        className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                    >
                        {/* Thumbnail + Teacher Avatar */}
                        <div
                            onClick={() => router.visit(route("classes.show", item.id))}
                        >
                            <div className="relative">
                                <ImageFallback
                                    src={item.thumbnail}
                                    alt={item.name}
                                    className="w-full h-40 object-cover"
                                    fallbackClassName="w-full h-40 object-cover bg-gray-200"
                                />
                                <img
                                    src={
                                        item.mentor?.avatar ||
                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(item.mentor?.name)}`
                                    }
                                    alt={item.mentor?.name}
                                    className="w-20 h-20 rounded-full border-2 border-white absolute -bottom-10 right-4"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-4 pt-8 flex-1">
                                <div className="flex flex-col items-start gap-2 mt-1">
                                    <h1 className="text-lg font-bold text-gray-800 line-clamp-1">
                                        {item.name}
                                    </h1>

                                    <p className="text-sm text-gray-700">
                                        <Badge color="warning">{item.academic_year_tag}</Badge>
                                    </p>
                                </div>
                                {/* Description */}
                                <div
                                    className="text-sm text-gray-500 mt-2 line-clamp-3"
                                    dangerouslySetInnerHTML={createMarkup(item.description || "")}
                                />

                                {/* Students Avatar */}
                                <div className="flex items-center mt-3 -space-x-3">
                                    {item.enrollments?.slice(0, 3).map((enr: any) => {
                                        const stu = enr.student;
                                        return (
                                            <img
                                                key={stu.id}
                                                src={
                                                    stu.avatar ||
                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(stu.name || "")}`
                                                }
                                                alt={stu.name}
                                                className="w-10 h-10 rounded-full border border-white"
                                            />
                                        );
                                    })}
                                    {item.enrollments?.length > 3 && (
                                        <div className="flex justify-center items-center w-10 h-10 rounded-full border border-white bg-gray-100 text-xs text-gray-700">
                                            +{item.enrollments.length - 3}
                                        </div>
                                    )}
                                </div>

                                <p className="text-sm text-gray-700 mt-3">
                                    Mentor: <span className="font-medium">{item.mentor?.name}</span>
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {role !== "student" && (
                            <div className="p-4 flex gap-2 mt-auto">
                                <Button
                                    type="button"
                                    size="md"
                                    variant="default"
                                    onClick={() => handleEdit(item)}
                                    aria-label="Edit kelas"
                                    disabled={deletingId === item.id}
                                >
                                    <LuPencil />
                                </Button>
                                <Button
                                    type="button"
                                    size="md"
                                    variant="danger"
                                    onClick={() => handleDelete(item.id)}
                                    aria-label="Hapus kelas"
                                    disabled={deletingId === item.id}
                                >
                                    {deletingId === item.id ? (
                                        <LuTrash2 className="animate-spin" />
                                    ) : (
                                        <LuTrash2 />
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
