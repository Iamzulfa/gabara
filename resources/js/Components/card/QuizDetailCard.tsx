// ✅ resources/js/Components/card/QuizDetailCard.tsx
import React, { useState, useCallback } from "react";
import { usePage, router } from "@inertiajs/react";
import { PageProps } from "@inertiajs/core";
import Badge from "@/Components/ui/badge/Badge";
import PageBreadcrumb from "@/Components/ui/breadcrumb/Breadcrumb";
import { confirmDialog } from "@/utils/confirmationDialog";



interface QuizExtraProps {
  class?: {
    id: number;
    name: string;
  };
  quiz?: {
    id: string;
    title: string;
    description?: string;
    status: string;
    open_datetime?: string;
    close_datetime?: string;
    time_limit_minutes?: number;
    attempts_allowed?: number;
    class_id?: string;
    questions?: { id: string; question_text: string; type?: string; options?: any }[];
    questions_count?: number;
  };
  classes?: { id: string; name: string }[];
}

type QuizDetailPageProps = PageProps & QuizExtraProps;

export default function QuizDetailCard() {
  const { props } = usePage<QuizDetailPageProps>();
  const quiz = props.quiz;
  const classData = props.class;
  const role = props.auth.user.role;
  const classes = props.classes ?? (classData ? [classData] : []);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fmt = (d?: string) => (d ? new Date(d).toLocaleString() : "-");

  

  const handleDelete = useCallback(async () => {
    if (!quiz) return;
    const confirmed = await confirmDialog({
      title: "Hapus Kuis?",
      text: "Kuis ini akan dihapus secara permanen.",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });
    if (!confirmed) return;

    setIsDeleting(true);
    router.delete(route("quizzes.destroy", { quiz: quiz.id }), {
      onFinish: () => setIsDeleting(false),
    });
  }, [quiz]);

  if (!quiz) return <p className="text-gray-500">Kuis tidak ditemukan.</p>;

  return (
    <div className="max-w-(--breakpoint-2xl) mx-auto space-y-6">
      {/* === Breadcrumb === */}
      <div className="flex items-center justify-between">
        <PageBreadcrumb
          crumbs={[
            { label: "Home", href: "/dashboard" },
            { label: "Kuis", href: "/quizzes" },
            { label: quiz.title },
          ]}
        />
      </div>

      {/* === Info Utama === */}
      <div className="bg-white rounded-xl border p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold">{quiz.title}</h1>
            <p className="text-sm text-gray-600 mt-2">{quiz.description}</p>

            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <Badge color={quiz.status === "Diterbitkan" ? "success" : "warning"}>
                {quiz.status}
              </Badge>
              <Badge color="info">{quiz.time_limit_minutes ?? 0} menit</Badge>
              <Badge color="primary">
                {quiz.questions_count ?? quiz.questions?.length ?? 0} soal
              </Badge>
            </div>
          </div>
        </div>

        {/* === Detail Kuis === */}
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
            <div className="font-medium">Durasi</div>
            <div>{quiz.time_limit_minutes ?? 0} menit</div>
          </div>
        </div>
      </div>

      {/* === Daftar Soal === */}
      <div className="bg-white border rounded-xl p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Daftar Soal</h2>
        {quiz.questions && quiz.questions.length > 0 ? (
          <ul className="space-y-3">
            {quiz.questions.map((q, idx) => (
              <li
                key={q.id ?? idx}
                className="p-3 sm:p-4 border rounded-md bg-muted/10 hover:bg-muted/20 transition"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <div className="font-medium">Soal {idx + 1}</div>
                    <div className="text-sm text-gray-700 mt-1">
                      {q.question_text || "-"}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 italic">
                    {q.type || "-"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">
            Belum ada pertanyaan pada kuis ini.
          </p>
        )}
      </div>
    </div>
  );
}
