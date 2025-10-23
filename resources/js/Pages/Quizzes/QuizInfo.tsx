// resources/js/Pages/Quizzes/QuizDetail.tsx
import React from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import QuizInfoCard from "@/Components/card/QuizInfoCard";


export default function QuizAttempt() {
  return (
    <DashboardLayout>
      <Head title="Informasi Quiz - Garasibelajar" />
      <div className="container mx-auto">
        <QuizInfoCard />
      </div>
    </DashboardLayout>
  );
}
