import React, { useEffect, useState } from "react";
import { Modal } from "@/Components/ui/modal";
import Button from "@/Components/ui/button/Button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Option {
  text: string;
  is_correct: boolean;
}

interface Question {
  id: string;
  question_text: string;
  options: Option[];
}

interface Answer {
  question_id: string;
  answer_text: string | null;
}

interface QuizAttempt {
  id: string;
  score: number;
  quiz: {
    title: string;
    questions: Question[];
  };
  answers: Answer[];
  created_at?: string;
}

interface ScoreSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  attempt: QuizAttempt | null;
  loading?: boolean;
}

const ScoreSummaryModal: React.FC<ScoreSummaryModalProps> = ({
  isOpen,
  onClose,
  attempt,
  loading = false,
}) => {
  const [localAttempt, setLocalAttempt] = useState<QuizAttempt | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLocalAttempt(attempt);
    } else {
      setLocalAttempt(null);
    }
  }, [isOpen, attempt]);

  if (!localAttempt) return null;

  const { quiz, answers, score } = localAttempt;
  const getAnswerForQuestion = (questionId: string) =>
    answers.find((a) => a.question_id === questionId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[330px] 2xsm:max-w-[350px] md:max-w-[700px] m-4"
    >
      <div className="no-scrollbar relative w-full max-w-[700px] max-h-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        {/* Header */}
        <h4 className="text-2xl font-semibold mb-4">
          Ringkasan Skor: {quiz.title}
        </h4>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Skor:{" "}
          <span className="font-bold text-green-600 dark:text-green-400">
            {score}%
          </span>
        </div>

        {/* Questions List */}
        <div className="flex flex-col gap-4">
          {quiz.questions?.length ? (
            quiz.questions.map((question, index) => {
              const userAnswer = getAnswerForQuestion(question.id);

              return (
                <div
                  key={question.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
                >
                  <div className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    {index + 1}. {question.question_text}
                  </div>

                  <div className="flex flex-col gap-2">
                    {question.options?.map((option, i) => {
                      const isSelected = userAnswer?.answer_text === option.text;
                      const isCorrect = option.is_correct;

                      let optionClass =
                        "block w-full text-left px-4 py-2 rounded-md border transition-colors ";
                      if (isCorrect) {
                        optionClass +=
                          "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300";
                      } else if (isSelected) {
                        optionClass +=
                          "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300";
                      } else {
                        optionClass +=
                          "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300";
                      }

                      return (
                        <div key={i} className={optionClass}>
                          {option.text}
                          {isCorrect && (
                            <span className="ml-2 text-xs text-green-600 dark:text-green-400 font-semibold">
                              (Kunci)
                            </span>
                          )}
                          {isSelected && !isCorrect && (
                            <span className="ml-2 text-xs text-red-600 dark:text-red-400 font-semibold">
                              (Jawabanmu)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Tidak ada pertanyaan untuk kuis ini.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Tutup
          </Button>
          {loading && (
            <Button type="button" variant="default" disabled>
              <AiOutlineLoading3Quarters className="animate-spin mr-2" />
              Memproses...
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ScoreSummaryModal;
