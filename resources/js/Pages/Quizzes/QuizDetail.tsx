// resources/js/Pages/Quizzes/QuizDetail.tsx
import React from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import QuizDetailCard from "@/Components/card/QuizDetailCard";

export default function QuizDetail() {
  return (
    <DashboardLayout>
      <Head title="Detail Quiz - Garasibelajar" />
      <div className="container mx-auto">
        <QuizDetailCard />
      </div>
    </DashboardLayout>
  );
}
