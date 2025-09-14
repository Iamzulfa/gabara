import React from "react";
import ctaImage from "../../../assets/images/CTA-Below.png";
import Button from "@/Components/ui/button/Button";
import { Link } from "@inertiajs/react";

export default function CTASection() {
    return (
        <section className="relative bg-white text-center pt-8 pb-0 overflow-hidden">
            {/* Content */}
            <div className="relative z-10 max-w-3xl mx-auto px-6">
                {/* Heading */}
                <div className="text-center mb-12">
                    <h3 className="heading">
                        Siap Belajar{" "}
                        <span className="text-primary">Bersama Kami?</span>
                    </h3>
                    <p className="subheading">
                        Mari bergabung dengan Gabara dan temukan kembali semangat
                        belajar tanpa batas. Pendidikan terbuka untuk siapa saja,
                        kapan saja, dan di mana saja.
                    </p>
                </div>
                <div className="mt-6">
                    <Link href={route("register")}>
                        <Button variant="default" className="px-14">Gabung Sekarang</Button>
                    </Link>
                </div>
            </div>

            {/* Image */}
            <div className="relative mt-12 flex justify-center">
                <img
                    src={ctaImage}
                    alt="CTA Illustration"
                    className="w-[580px] sm:w-[600px] md:w-[720px] lg:w-[900px] xl:w-[1400px] object-contain"
                />
            </div>
        </section>
    );
}
