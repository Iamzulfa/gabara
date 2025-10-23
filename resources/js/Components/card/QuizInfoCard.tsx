import React, { useCallback, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { QuizInfoPageProps } from "@/types/types";
import Button from "@/Components/ui/button/Button";
import Badge from "@/Components/ui/badge/Badge";
import PageBreadcrumb from "@/Components/ui/breadcrumb/Breadcrumb";
import AttemptConfirmModal from "@/Components/modal/AttemptConfirmModal";
import ScoreSummaryModal from "@/Components/modal/ScoreSummaryModal"; // ✅ import modal

export default function QuizInfoCard() {
  const { props } = usePage<QuizInfoPageProps>();
  const role = props.auth?.user?.role;
  const { quiz, classData, attempt, attempts = [], can_attempt, message } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // ✅ Modal penilaian global
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState<any>(null);

  const fmt = (d?: string) => (d ? new Date(d).toLocaleString() : "-");

  const hasAttempt = Boolean(attempt?.id);
  const isOngoing = attempt?.status === "in_progress";
  const isFinished = attempt?.status === "finished";
  const totalQuestions = quiz?.questions_count ?? quiz?.questions?.length ?? 0;

  const getPreview = (it: any) => {
    // hitung jumlah jawaban yang ada (tidak kosong)
    const answered = it.answers?.filter((a: any) => a.answer_text !== null && a.answer_text !== "").length ?? 0;
    const correct = it.correct_count ?? 0;
    const score = it.score ?? 0;
    const wrong = answered - correct;
    return { answered, total: totalQuestions, correct, wrong, score };
  };


  const handleStart = useCallback(() => {
    if (!quiz || !classData?.id) return;
    if (isPosting) return;
    setIsPosting(true);

    router.post(
      route("classes.quizzes.start", { class: classData.id, quiz: quiz.id }),
      {},
      {
        onStart: () => setIsModalOpen(false),
        onSuccess: () => setIsPosting(false),
        onError: () => setIsPosting(false),
      }
    );
  }, [quiz, classData, isPosting]);

  const handleContinue = useCallback(() => {
    if (!attempt?.id) return;
    router.visit(route("quiz.attempts.show", { attempt: attempt.id }));
  }, [attempt?.id]);

  const handleViewHistory = useCallback(() => {
    if (classData?.id && quiz?.id) {
      router.visit(route("quiz.attempts.history", { class: classData.id, quiz: quiz.id }));
    } else {
      router.visit(route("quiz.attempts.history"));
    }
  }, [classData?.id, quiz?.id]);

  const handleConfirmStart = useCallback(() => {
    setIsModalOpen(false);
    handleStart();
  }, [handleStart]);

  // ✅ Handler buka modal penilaian
  const handleOpenScoreModal = (it: any) => {
    setSelectedAttempt(it);
    setIsScoreModalOpen(true);
  };

  if (!quiz) return <p className="text-gray-500">Quiz tidak ditemukan.</p>;

  return (
    <div className="max-w-(--breakpoint-2xl) mx-auto space-y-6">
      {/* === Breadcrumb === */}
      <div className="flex items-center justify-between">
        <PageBreadcrumb
          crumbs={[
            { label: "Home", href: "/dashboard" },
            { label: "Kelasku", href: "/classes" },
            {
              label: classData?.name ?? "Class",
              href: classData ? `/classes/${classData.id}` : undefined,
            },
            { label: quiz.title },
          ]}
        />
      </div>

      {/* === Quiz Info === */}
      <div className="bg-white rounded-xl border p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          {/* === Info Umum === */}
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold">{quiz.title}</h1>
            <p className="text-sm text-gray-600 mt-2">{quiz.description}</p>

            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <Badge color={quiz.status === "Diterbitkan" ? "success" : "warning"}>
                {quiz.status}
              </Badge>
              <Badge color="info">{quiz.time_limit_minutes ?? 0} menit</Badge>
              <Badge color="primary">{totalQuestions} soal</Badge>
            </div>

            <div className="mt-3 text-sm text-gray-700 space-y-1">
              <div>
                <span className="font-medium">Status Anda:</span>{" "}
                {isOngoing ? (
                  <span className="text-yellow-600 font-semibold">Sedang dikerjakan</span>
                ) : isFinished ? (
                  <span className="text-green-600 font-semibold">Selesai</span>
                ) : (
                  <span className="text-gray-600">Belum mengerjakan</span>
                )}
              </div>

              {message && (
                <div className="mt-1 text-red-600 text-sm">⚠️ {message}</div>
              )}
            </div>
          </div>

          {/* === Tombol Aksi Student === */}
          {role === "student" && (
            <div className="flex flex-col w-full sm:w-auto items-stretch sm:items-end gap-2">
              {isOngoing && (
                <Button onClick={handleContinue} disabled={isPosting} className="w-full sm:w-auto">
                  Lanjutkan Attempt
                </Button>
              )}
              {!isOngoing && can_attempt && (
                <Button onClick={() => setIsModalOpen(true)} disabled={isPosting} className="w-full sm:w-auto">
                  {isPosting ? "Memproses..." : "Mulai Quiz"}
                </Button>
              )}
              {!can_attempt && !isOngoing && (
                <Button disabled variant="danger" className="w-full sm:w-auto">
                  Tidak bisa memulai
                </Button>
              )}
            </div>
          )}
        </div>

        {/* === Detail Quiz === */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700">
          <div>
            <div className="font-medium">Dibuka</div>
            <div>{fmt(quiz.open_datetime)}</div>
          </div>
          <div>
            <div className="font-medium">Ditutup</div>
            <div>{fmt(quiz.close_datetime)}</div>
          </div>
          <div>
            <div className="font-medium">Kesempatan Mengerjakan</div>
            <div>{quiz.attempts_allowed ?? 1}x</div>
          </div>
          <div>
            <div className="font-medium">Waktu Pengerjaan</div>
            <div>{quiz.time_limit_minutes ?? 0} menit</div>
          </div>
        </div>
      </div>

      {/* === Attempt History === */}
      <div className="bg-white border rounded-xl p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Riwayat Mengerjakan</h2>
        {attempts.length === 0 ? (
          <p className="text-sm text-gray-600">
            Anda belum pernah mengerjakan kuis ini. Tekan <span className="font-medium">Mulai</span> untuk memulai attempt.
          </p>
        ) : (
          <div className="space-y-3">
            {attempts.map((it, idx) => {
              const prev = getPreview(it);
              return (
                <div
                  key={it.id ?? idx}
                  className="p-3 sm:p-4 border rounded-md bg-muted/10 hover:bg-muted/20 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <span className="font-medium">Attempt #{attempts.length - idx}</span>
                    <span className="text-xs text-gray-500">{fmt(it.started_at)}</span>
                  </div>
                  <div className="mt-1 text-sm">
                    Status:{" "}
                    <span
                      className={it.status === "finished" ? "text-green-600" : "text-yellow-600"}
                    >
                      {it.status === "finished" ? "Selesai" : "In Progress"}
                    </span>
                  </div>
                  <div className="text-sm">
                    Jawaban: {prev.answered ?? "-"} / {prev.total ?? "-"}
                  </div>
                  {typeof prev.score !== "undefined" && (
                    <div className="text-sm mb-2">Skor: {prev.score}</div>
                  )}
                  {/* ✅ Tombol buka modal */}
                  {it.status === "finished" && (
                    <div className="flex justify-center sm:justify-end">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleOpenScoreModal(it)}
                      >
                        Lihat Penilaian
                      </Button>
                    </div>

                  )}
                </div>
              );
            })}
            <div className="flex justify-end pt-2">
              <Button type="button" variant="default" onClick={handleViewHistory}>
                Lihat Selengkapnya
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* === Modal Konfirmasi Mulai === */}
      <AttemptConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmStart}
        quizTitle={quiz.title}
        duration={quiz.time_limit_minutes ?? 0}
        openTime={quiz.open_datetime}
        closeTime={quiz.close_datetime}
        classData={classData!}
        quiz={quiz}
        isPosting={isPosting}
      />

      {/* ✅ Modal Penilaian (global, aman dari loop) */}
      {selectedAttempt && (
        <ScoreSummaryModal
          isOpen={isScoreModalOpen}
          onClose={() => setIsScoreModalOpen(false)}
          attempt={selectedAttempt}
        />
      )}
    </div>
  );
}
