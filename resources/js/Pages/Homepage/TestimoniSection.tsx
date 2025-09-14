import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

import alumni1 from "../../../assets/images/image-testi-1.png";
import alumni2 from "../../../assets/images/image-testi-2.png";
import alumni3 from "../../../assets/images/image-testi-3.png";
import Quotes from "../../../assets/images/image-quotation.png";

type TestimonialType = {
    name: string;
    text: string;
    avatarUrl: string;
};

export default function TestimonialsSection() {
    const testimonials: TestimonialType[] = [
        {
            name: "Ari Lesmana",
            text: "Waktu SMP saya terpaksa berhenti sekolah karena harus bantu orang tua jualan. Awalnya saya pikir itu akhir dari pendidikan saya, karena nggak mungkin bisa balik sekolah lagi. Tapi sejak kenal Gabara, saya bisa belajar lewat HP di rumah tanpa harus meninggalkan tanggung jawab. Sekarang saya kembali punya harapan untuk lulus Paket C dan melanjutkan cita-cita.",
            avatarUrl: alumni1,
        },
        {
            name: "Dwi Cahyani",
            text: "Dulu saya merasa minder karena nggak bisa ikut les seperti teman-teman lain. Setiap kali belajar sendiri sering bingung dan akhirnya nyerah. Tapi setelah pakai Gabara, saya bisa belajar dengan cara yang lebih gampang dipahami, kapan aja lewat HP. Sekarang saya jadi lebih semangat, nilai saya mulai naik, dan saya percaya bisa capai cita-cita saya.",
            avatarUrl: alumni2,
        },
        {
            name: "Putri Kusuma",
            text: "Aku dulu sering ketinggalan pelajaran karena nggak bisa ikut les. Jadi sering takut kalau ujian. Tapi sejak belajar pakai Gabara, pelajarannya jadi lebih mudah dimengerti dan seru. Sekarang aku lebih berani jawab pertanyaan di kelas dan makin semangat belajar.",
            avatarUrl: alumni3,
        },
    ];

    const swiperRef = useRef<any>(null);
    const prevMobileRef = useRef<HTMLButtonElement | null>(null);
    const nextMobileRef = useRef<HTMLButtonElement | null>(null);
    const prevTabletRef = useRef<HTMLButtonElement | null>(null);
    const nextTabletRef = useRef<HTMLButtonElement | null>(null);
    const prevDesktopRef = useRef<HTMLButtonElement | null>(null);
    const nextDesktopRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (swiperRef.current) {
            const swiper = swiperRef.current;

            const prevEls = [
                prevMobileRef.current,
                prevTabletRef.current,
                prevDesktopRef.current,
            ].filter(Boolean);

            const nextEls = [
                nextMobileRef.current,
                nextTabletRef.current,
                nextDesktopRef.current,
            ].filter(Boolean);

            if (typeof swiper.params.navigation !== "boolean") {
                swiper.params.navigation.prevEl = prevEls;
                swiper.params.navigation.nextEl = nextEls;
                swiper.navigation.init();
                swiper.navigation.update();
            }
        }
    }, []);

    return (
        <section id="testimonials" className="py-24">
            <div className="container mx-auto px-6 text-center">
                {/* Headding */}
                <div className="text-center mb-12">
                    <h2 className="heading">
                        <span className="text-primary">Cerita dari Mereka</span> yang Kembali Belajar
                    </h2>
                    <p className="subheading lg:px-52 2xl:px-72">
                        Di balik setiap perjalanan, selalu ada mimpi yang belum selesai. Lewat Gabara, banyak yang berani melanjutkan langkah dan menemukan jalan baru untuk belajar kembali.
                    </p>
                </div>

                {/* Content */}
                <div className="relative max-w-5xl mx-auto">
                    <Swiper
                        modules={[Navigation]}
                        loop={true}
                        spaceBetween={40}
                        slidesPerView={1}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                    >
                        {testimonials.map((testimonial, index) => (
                            <SwiperSlide key={index}>
                                <div className="flex flex-col lg:flex-row items-center gap-8">
                                    <div className="flex-shrink-0 lg:w-1/3 relative">
                                        <img
                                            src={testimonial.avatarUrl}
                                            alt={testimonial.name}
                                            className="relative w-full object-cover"
                                        />
                                    </div>
                                    <div className="w-full lg:w-2/3 text-left min-h-[280px] relative">
                                        <img
                                            src={Quotes}
                                            alt="Quotes"
                                            className="w-10 mb-8 opacity-60"
                                        />
                                        <p className="text-base md:text-lg leading-relaxed text-slate-700">
                                            {testimonial.text}
                                        </p>
                                        <h4 className="text-lg md:text-xl font-semibold mt-6">
                                            {testimonial.name}
                                        </h4>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Nav Buttons */}
                    <div className="relative z-50">
                        {/* Mobile */}
                        <div className="flex justify-center gap-4 mt-6 md:hidden">
                            <button
                                ref={prevMobileRef}
                                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-primary bg-white text-primary hover:bg-sky-100 transition"
                            >
                                <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                            <button
                                ref={nextMobileRef}
                                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-primary bg-white text-primary hover:bg-sky-100 transition"
                            >
                                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Tablet */}
                        <div className="hidden md:flex lg:hidden absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-center gap-4 px-4">
                            <button
                                ref={prevTabletRef}
                                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-primary bg-white text-primary hover:bg-sky-100 transition"
                            >
                                <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                            <button
                                ref={nextTabletRef}
                                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-primary bg-white text-primary hover:bg-sky-100 transition"
                            >
                                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Desktop*/}
                        <div className="hidden lg:flex absolute bottom-16 right-6 gap-4">
                            <button
                                ref={prevDesktopRef}
                                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-primary bg-white text-primary hover:bg-sky-100 transition"
                            >
                                <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                            <button
                                ref={nextDesktopRef}
                                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-primary bg-white text-primary hover:bg-sky-100 transition"
                            >
                                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
