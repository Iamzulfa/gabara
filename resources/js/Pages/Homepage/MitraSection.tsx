import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import MitraCard from "./Components/card/MitraCard";

import pkbminsan from "../../../assets/images/PKBM-Insan-Mandiri.png";
import pkbmarmada from "../../../assets/images/PKBM-Armada.png";
import pkbmbina from "../../../assets/images/PKBM-Bina-Nusantara.png";
import pkbmindustrial from "../../../assets/images/PKBM-Industrialtech.png";
import pkbmfood from "../../../assets/images/PKBM-Foodtech.png";
import pkbmsustain from "../../../assets/images/PKBM-Sustainability.png";

export default function MitraSection() {
    const pkbm = [
        {
            title: "PKBM Harapan Bangsa",
            address:
                "Banjarkulon, RT. 02 RW. 03, Karang Gondang, Banjarkulon, Kec. Banjarnegara",
            image: pkbminsan,
            link: "https://pkbminsan.com/",
        },
        {
            title: "PKBM Armada",
            address:
                "Jl. Serma Mukhlas No. 10B, Kutabanjarnegara, Karangtengah, Kec. Banjarnegara",
            image: pkbmarmada,
            link: "https://pkbminsan.com/",
        },
        {
            title: "PKBM Bina Nusantara",
            address:
                "Pucang, RT. 01 RW. I, Gemirit, Pucang, Kec. Bawang Banjarnegara",
            image: pkbmbina,
            link: "https://pkbminsan.com/",
        },
        {
            title: "PKBM Teknik Industri",
            address:
                "Banjarkulon, RT. 02 RW. 03, Karang Gondang, Banjarkulon, Kec. Banjarnegara",
            image: pkbmindustrial,
            link: "https://pkbminsan.com/",
        },
        {
            title: "PKBM Teknologi Pangan",
            address:
                "Jl. Serma Mukhlas No. 10B, Kutabanjarnegara, Karangtengah, Kec. Banjarnegara",
            image: pkbmfood,
            link: "https://pkbminsan.com/",
        },
        {
            title: "PKBM Sustainability",
            address:
                "Pucang, RT. 01 RW. I, Gemirit, Pucang, Kec. Bawang Banjarnegara",
            image: pkbmsustain,
            link: "https://pkbminsan.com/",
        },
    ];

    return (
        <section id="mitra" className="bg-sky-100 py-28 px-6 lg:px-20">
            <div className="container mx-auto">
                {/* Heading */}
                <div className="text-center mb-12">
                    <h2 className="heading">
                        Dari Persiapan Hingga{" "}
                        <span className="text-primary">Ujian Resmi</span>
                    </h2>
                    <p className="subheading lg:px-16 2xl:px-52">
                        Peserta dapat melanjutkan ke lembaga pendidikan non-formal di Banjarnegara dan sekitarnya untuk mengikuti ujian kesetaraan Paket A (SD), Paket B (SMP), dan Paket C (SMA).
                    </p>
                </div>

                {/* Slider pakai Swiper */}
                <div className="mt-10">
                    <Swiper
                        spaceBetween={20}
                        breakpoints={{
                            0: {
                                slidesPerView: 1.2,
                            },
                            768: {
                                slidesPerView: 2.2,
                            },
                            1024: {
                                slidesPerView: 3.2,
                            },
                        }}
                    >
                        {pkbm.map((p, idx) => (
                            <SwiperSlide key={idx}>
                                <div className="py-2 transform transition-all duration-300 hover:scale-[1.02]">
                                    <MitraCard {...p} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}
