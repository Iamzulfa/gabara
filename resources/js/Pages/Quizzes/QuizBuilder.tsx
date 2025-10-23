import React from "react";
import { Head, usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import QuizBuilderCard from "@/Components/card/QuizBuilderCard";

export default function QuizBuilder() {
  const { props }: any = usePage();
  const { classes, auth } = props;

  return (
    <DashboardLayout>
      <Head title="Buat Quiz - Garasibelajar" />
      <div className="container mx-auto">
        <QuizBuilderCard classes={classes}/>
      </div>
    </DashboardLayout>
  );
}
