// resources/js/Pages/Quizzes/QuizDetail.tsx
import React from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import QuizAttemptCard from "@/Components/card/QuizAttemptCard";


export default function QuizAttempt() {
  return (
    <DashboardLayout>
      <Head title="Pengerjaan Quiz - Garasibelajar" />
      <div className="container mx-auto">
        <QuizAttemptCard />
      </div>
    </DashboardLayout>
  );
}
