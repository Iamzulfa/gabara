import heroImage from "../../../assets/images/image-hero.png";
import Button from "@/Components/ui/button/Button";
import { Link } from "@inertiajs/react";

export default function HeroSection() {
    return (
        <section className="relative bg-gradient-to-b from-[#3480F8] to-[#07409B] text-white overflow-hidden min-h-screen flex items-center">
            <div className="w-full px-4 lg:px-20">
                <div className="container mx-auto flex flex-col lg:flex-row items-center gap-10">
                    {/* Left content */}
                    <div className="lg:w-1/2 text-center lg:text-left relative top-16">
                        <h1 className="text-4xl md:text-6xl lg:text-5xl 2xl:text-6xl font-extrabold leading-tight">
                            Kesempatan Baru <br /> untuk Terus Belajar <br />
                            Tanpa Batas
                        </h1>

                        <p className="mt-4 text-sky-100 text-base md:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            Sekolah boleh tertunda, tapi mimpi jangan berhenti.
                            Gabara hadir agar kamu bisa belajar lagi dengan cara
                            yang lebih mudah.
                        </p>

                        <div className="mt-6 flex justify-center lg:justify-start">
                            <Link href={route("register")}>
                                <Button
                                    variant="alternate"
                                    size="xs"
                                    className="px-5 py-2.5"
                                >
                                    Gabung Sekarang
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right image */}
                    <div className="flex justify-center lg:justify-end relative top-16 xsm:top-23 md:top-42 lg:top-24 xl:top-26 2xl:top-16">
                        <img
                            src={heroImage}
                            alt="students"
                            className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
