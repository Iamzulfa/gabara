import heroImage from "../../../assets/images/Hero-Image.png";
import Button from "@/Components/ui/button/Button";
import { Link } from "@inertiajs/react";

export default function Hero() {
    return (
        <section className="relative bg-gradient-to-b from-sky-600 to-sky-500 text-white overflow-hidden">
            {/* spacing supaya tidak ketiban header */}
            <div className="pt-28 pb-20">
                <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-10">
                    {/* Left text */}
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                            Kesempatan Baru untuk Terus Belajar <br /> Tanpa
                            Batas
                        </h1>
                        <p className="mt-5 text-sky-100 max-w-xl mx-auto lg:mx-0">
                            Sekolah boleh tertunda, tapi mimpi jangan berhenti.
                            Gabara hadir agar kamu bisa belajar lagi dengan cara
                            yang lebih mudah.
                        </p>

                        <div className="mt-8 flex justify-center lg:justify-start gap-4">
                            <Link href={route("register")}>
                                <Button
                                    variant="danger"
                                    className="hidden sm:inline-block"
                                >
                                    Gabung Sekarang
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right image */}
                    <div className="lg:w-1/2 flex justify-center items-end relative">
                        <img
                            src={heroImage}
                            alt="students"
                            className="
                                w-full
                                max-w-sm sm:max-w-md lg:max-w-2xl
                                object-contain
                                relative
                                lg:translate-y-24
                                lg:-mb-12
                            "
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
