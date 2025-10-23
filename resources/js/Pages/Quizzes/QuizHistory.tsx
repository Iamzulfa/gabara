// resources/js/Pages/Quizzes/QuizDetail.tsx
import React from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import QuizHistoryCard from "@/Components/card/QuizHistoryCard";


export default function QuizHistory() {
  return (
    <DashboardLayout>
      <Head title="History Quiz - Garasibelajar" />
      <div className="container mx-auto">
        <QuizHistoryCard />
      </div>
    </DashboardLayout>
  );
}
