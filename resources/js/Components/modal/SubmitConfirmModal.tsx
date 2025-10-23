import React from "react";
import { Modal } from "@/Components/ui/modal";
import Button from "@/Components/ui/button/Button";

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalQuestions: number;
  answeredCount: number;
}

export default function SubmitConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  totalQuestions,
  answeredCount,
}: SubmitConfirmModalProps) {
  const unanswered = totalQuestions - answeredCount;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[330px] 2xsm:max-w-[350px] md:max-w-[700px] m-4"
    >
      <div className="relative w-full max-w-[700px] max-h-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-xl font-semibold text-gray-800">
            Konfirmasi Pengiriman Jawaban
          </h4>
          <div className="w-6" /> {/* Spacer agar tombol X modal tidak menutupi */}
        </div>

        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Kamu telah menjawab{" "}
          <span className="font-semibold text-gray-800">{answeredCount}</span>{" "}
          dari{" "}
          <span className="font-semibold text-gray-800">{totalQuestions}</span>{" "}
          soal.{" "}
          {unanswered > 0 && (
            <span className="text-red-600 font-medium">
              {unanswered} soal belum dijawab.
            </span>
          )}
        </p>

        <p className="text-sm text-gray-700 mb-6">
          Setelah kamu menekan <b>Kirim Jawaban</b>, jawaban tidak bisa diubah.
          Pastikan semuanya sudah benar sebelum mengirim.
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Kembali
          </Button>
          <Button variant="default" onClick={onConfirm}>
            Kirim Jawaban
          </Button>
        </div>
      </div>
    </Modal>
  );
}
