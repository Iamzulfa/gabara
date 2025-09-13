import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import Button from "@/Components/ui/button/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";

import pkbminsan from "../../../assets/images/PKBM-Insan-Mandiri.png";
import pkbmarmada from "../../../assets/images/PKBM-Armada.png";
import pkbmbina from "../../../assets/images/PKBM-Bina-Nusantara.png";
import pkbmindustrial from "../../../assets/images/PKBM-Industrialtech.png";
import pkbmfood from "../../../assets/images/PKBM-Foodtech.png";
import pkbmsustain from "../../../assets/images/PKBM-Sustainability.png";

// --- komponen kecil (1 card)
function PKBMItem({
    title,
    address,
    imageUrl,
}: {
    title: string;
    address: string;
    imageUrl: string;
}) {
    return (
        <Card className="rounded-xl shadow-md overflow-hidden text-center h-full">
            <CardHeader className="p-0">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-40 object-contain"
                />
            </CardHeader>
            <CardContent className="p-4">
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                <p className="text-slate-600 text-sm mt-2">{address}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button variant="primary" className="w-full">
                    Kunjungi
                </Button>
            </CardFooter>
        </Card>
    );
}

// --- komponen utama (section PKBM)
export default function PKBMCard() {
    const pkbm = [
        {
            title: "PKBM Harapan Bangsa",
            address:
                "Banjarkulon, RT. 02 RW. 03, Karang Gondang, Banjarkulon, Kec. Banjarnegara",
            imageUrl: pkbminsan,
        },
        {
            title: "PKBM Armada",
            address:
                "Jl. Serma Mukhlas No. 10B, Kutabanjarnegara, Karangtengah, Kec. Banjarnegara",
            imageUrl: pkbmarmada,
        },
        {
            title: "PKBM Bina Nusantara",
            address:
                "Pucang, RT. 01 RW. I, Gemirit, Pucang, Kec. Bawang Banjarnegara",
            imageUrl: pkbmbina,
        },
        {
            title: "PKBM Teknik Industri",
            address:
                "Banjarkulon, RT. 02 RW. 03, Karang Gondang, Banjarkulon, Kec. Banjarnegara",
            imageUrl: pkbmindustrial,
        },
        {
            title: "PKBM Teknologi Pangan",
            address:
                "Jl. Serma Mukhlas No. 10B, Kutabanjarnegara, Karangtengah, Kec. Banjarnegara",
            imageUrl: pkbmfood,
        },
        {
            title: "PKBM Sustainability",
            address:
                "Pucang, RT. 01 RW. I, Gemirit, Pucang, Kec. Bawang Banjarnegara",
            imageUrl: pkbmsustain,
        },
    ];

    const [index, setIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(3);
    const [step, setStep] = useState(1);

    // deteksi ukuran layar
    useEffect(() => {
        const updateLayout = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setVisibleCards(1);
                setStep(1);
            } else if (width < 1024) {
                setVisibleCards(4); // tablet
                setStep(2);
            } else {
                setVisibleCards(3); // desktop
                setStep(1);
            }
        };

        updateLayout();
        window.addEventListener("resize", updateLayout);
        return () => window.removeEventListener("resize", updateLayout);
    }, []);

    const handlePrev = () => {
        setIndex((prev) => (prev - step + pkbm.length) % pkbm.length);
    };

    const handleNext = () => {
        setIndex((prev) => (prev + step) % pkbm.length);
    };

    // fungsi ambil card sesuai index (wrap-around)
    const getVisibleCards = () => {
        const end = index + visibleCards;
        if (end <= pkbm.length) {
            return pkbm.slice(index, end);
        } else {
            return [
                ...pkbm.slice(index, pkbm.length),
                ...pkbm.slice(0, end - pkbm.length),
            ];
        }
    };

    return (
        <section id="mitra" className="bg-sky-100 py-16">
            <div className="container mx-auto px-6">
                <h3 className="text-3xl font-bold text-center">
                    Dari Persiapan Hingga{" "}
                    <span className="text-blue-500">Ujian Resmi</span>
                </h3>
                <p className="text-center text-slate-500 mt-5 max-w-3xl mx-auto">
                    Setelah belajar dan berlatih di platform, peserta bisa
                    melanjutkan ke lembaga pendidikan non-formal resmi di
                    Banjarnegara dan sekitarnya untuk mengikuti ujian
                    kesetaraan.
                </p>

                {/* Card grid dengan slider */}
                <div className="mt-10">
                    <div
                        key={index} // biar React re-render tiap geser
                        className={`grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${visibleCards} transition-all duration-500 ease-in-out`}
                    >
                        {getVisibleCards().map((p, idx) => (
                            <div
                                key={idx}
                                className="transform transition-all duration-500 ease-in-out hover:scale-[1.02]"
                            >
                                <PKBMItem {...p} />
                            </div>
                        ))}
                    </div>

                    {/* Tombol navigasi */}
                    <div className="flex justify-center gap-4 mt-8">
                        <Button
                            variant="circle-outline"
                            size="circle-lg"
                            onClick={handlePrev}
                            aria-label="Sebelumnya"
                        >
                            <ArrowLeft strokeWidth={3} className="w-6 h-6" />
                        </Button>
                        <Button
                            variant="outline"
                            size="circle-lg"
                            onClick={handleNext}
                            aria-label="Berikutnya"
                        >
                            <ArrowRight strokeWidth={3} className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
