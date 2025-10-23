import React from "react";
import { Modal } from "@/Components/ui/modal";
import Button from "@/Components/ui/button/Button";

interface AttemptConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  quizTitle: string;
  duration: number;
  openTime?: string;
  closeTime?: string;
  classData: { id: string; name: string };
  quiz: { id: string; title: string };
  isPosting?: boolean;
}

export default function AttemptConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  quizTitle,
  duration,
  openTime,
  closeTime,
  classData,
  isPosting = false,
}: AttemptConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[330px] 2xsm:max-w-[350px] md:max-w-[700px] m-4"
    >
      <div className="relative w-full max-w-[700px] max-h-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
  <div className="flex justify-between items-start mb-4">
    <h4 className="text-2xl font-semibold text-gray-800">
      Mulai Mengerjakan Quiz
    </h4>
    {/* Spacer agar X tidak menutupi teks, atau bisa biarkan default Modal punya close */}
    <div className="w-6" /> 
  </div>

  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
    Kamu akan mengerjakan{" "}
    <span className="font-semibold text-gray-800">{quizTitle}</span>.
    Waktu akan langsung berjalan setelah kamu menekan tombol{" "}
    <b>Mulai Sekarang</b>.
  </p>

  <div className="border-y border-gray-200 py-4 text-sm text-gray-700 space-y-2 mb-5 dark:border-gray-700">
    <div>
      <span className="font-medium">Durasi:</span> {duration} menit
    </div>
    <div>
      <span className="font-medium">Dibuka:</span>{" "}
      {openTime ? new Date(openTime).toLocaleString() : "-"}
    </div>
    <div>
      <span className="font-medium">Ditutup:</span>{" "}
      {closeTime ? new Date(closeTime).toLocaleString() : "-"}
    </div>
  </div>

  <div className="flex justify-end gap-3 mt-6">
    <Button variant="outline" onClick={onClose} disabled={isPosting}>
      Batal
    </Button>
    <Button
      variant="default"
      onClick={() => !isPosting && onConfirm()}
      disabled={isPosting}
    >
      {isPosting ? "Menyiapkan..." : "Mulai Sekarang"}
    </Button>
  </div>
</div>

    </Modal>
  );
}
