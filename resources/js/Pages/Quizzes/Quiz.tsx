import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import QuizCard from "@/Components/card/QuizCard";

export default function QuizIndex() {
  return (
    <DashboardLayout>
      <Head title="Quiz - Garasibelajar" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <QuizCard />
        </div>
      </div>
    </DashboardLayout>
  );
}
