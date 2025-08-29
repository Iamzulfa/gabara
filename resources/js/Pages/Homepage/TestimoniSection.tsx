import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import alumni1 from "../../../assets/images/Testimonial-Image.png";
import alumni2 from "../../../assets/images/Testimonial-Image.png";
import alumni3 from "../../../assets/images/Testimonial-Image.png";
import Quotes from "../../../assets/images/Quotation.png";

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import Button from "@/Components/ui/button/Button";

type TestimonialType = {
    name: string;
    text: string;
    avatarUrl: string;
};

const TestimonialsSection: React.FC = () => {
    const [index, setIndex] = useState(0);

    const testimonials: TestimonialType[] = [
        {
            name: "Ari Lesmana",
            text: "Waktu SMP saya terpaksa berhenti sekolah karena harus bantu orang tua jualan. Awalnya saya pikir itu akhir dari pendidikan saya, karena nggak mungkin bisa balik sekolah lagi. Tapi sejak kenal Gabara, saya bisa belajar lewat HP di rumah tanpa harus meninggalkan tanggung jawab. Sekarang saya kembali punya harapan untuk lulus Paket C dan melanjutkan cita-cita.",
            avatarUrl: alumni1,
        },
        {
            name: "Budi Santoso",
            text: "Materinya mudah dipahami dan sangat membantu saya dalam belajar mandiri.",
            avatarUrl: alumni2,
        },
        {
            name: "Ani Lestari",
            text: "Mentor Gabara sangat ramah dan selalu mendukung saya dalam belajar.",
            avatarUrl: alumni3,
        },
    ];

    const handlePrev = () => {
        setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    };

    return (
        <section id="testimonials" className="py-16 bg-white">
            <div className="container mx-auto px-6">
                <h3 className="text-3xl font-bold text-center text-sky-600 mb-2">
                    Cerita dari Mereka
                </h3>
                <p className="text-center text-slate-600 mb-12">
                    Di balik setiap perjalanan, selalu ada mimpi yang belum
                    selesai. <br />
                    Lewat Gabara, banyak yang berani melanjutkan langkah dan
                    menemukan jalan baru untuk belajar kembali.
                </p>

                <Card className="relative max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-12 p-6 shadow-lg">
                    {/* Foto */}
                    <div className="flex-shrink-0 lg:w-1/3">
                        <img
                            src={testimonials[index].avatarUrl}
                            alt={testimonials[index].name}
                            className="w-full h-auto rounded-lg object-cover"
                        />
                    </div>

                    {/* Konten Testimonial */}
                    <CardContent className="lg:w-2/3 relative">
                        <img
                            src={Quotes}
                            alt="Quotes"
                            className="w-12 h-12 mb-6 opacity-70"
                        />
                        <p className="text-lg leading-relaxed text-slate-700">
                            {testimonials[index].text}
                        </p>
                        <CardHeader className="p-0 mt-6">
                            <CardTitle className="text-sky-600 text-xl">
                                {testimonials[index].name}
                            </CardTitle>
                        </CardHeader>

                        {/* Navigasi tombol */}
                        <div className="absolute -bottom-6 right-0 flex gap-3">
                            <Button
                                variant="outline"
                                size="xs"
                                onClick={handlePrev}
                                className="rounded-full"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="primary"
                                size="xs"
                                onClick={handleNext}
                                className="rounded-full bg-sky-600 hover:bg-sky-700 text-white"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default TestimonialsSection;
