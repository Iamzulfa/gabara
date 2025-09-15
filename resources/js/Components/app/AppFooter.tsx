import Logo from "../../../assets/logo/logo-color.png";

import Footer1 from "../../../assets/images/Footer-Image1.png";
import Footer2 from "../../../assets/images/Footer-Image2.png";
import Footer3 from "../../../assets/images/Footer-Image3.png";
import Footer4 from "../../../assets/images/Footer-Image4.png";

import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

export default function AppFooter() {
    const galleryImages = [Footer1, Footer2, Footer3, Footer4];

    return (
        <footer className="bg-black text-white py-16">
            <div className="px-6 lg:px-20 mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* Logo & Address*/}
                <div>
                    <img src={Logo} alt="Gabara Logo" className="w-48 sm:w-60 mb-6" />
                    <p className="text-sm text-slate-300 leading-relaxed">
                        Adipasir II, Adipasir, Kec. Rakit, Kab. Banjarnegara,
                        Jawa Tengah 53463, Indonesia
                    </p>
                </div>

                {/* Navigation */}
                <div>
                    <h2 className="font-semibold mb-4 text-base">Navigasi</h2>
                    <ul className="space-y-3 text-sm text-slate-300">
                        <li>
                            <a
                                href="#hero"
                                className="hover:text-white transition-colors"
                            >
                                Beranda
                            </a>
                        </li>
                        <li>
                            <a
                                href="#features"
                                className="hover:text-white transition-colors"
                            >
                                Layanan
                            </a>
                        </li>
                        <li>
                            <a
                                href="#testimonials"
                                className="hover:text-white transition-colors"
                            >
                                Testimoni
                            </a>
                        </li>
                        <li>
                            <a
                                href="#mitra"
                                className="hover:text-white transition-colors"
                            >
                                Mitra
                            </a>
                        </li>
                        <li>
                            <a
                                href="#faq"
                                className="hover:text-white transition-colors"
                            >
                                FAQ
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h2 className="font-semibold mb-4 text-base">Kontak</h2>
                    <ul className="space-y-3 text-sm text-slate-300">
                        <li>
                            <a
                                href="https://wa.me/6282255108336"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-white transition-colors"
                            >
                                <FaWhatsapp className="w-4 h-4" />
                                0822 5510 8336
                            </a>
                        </li>
                        <li>
                            <a
                                href="mailto:garasibelajar.id@gmail.com"
                                className="flex items-center gap-2 hover:text-white transition-colors"
                            >
                                <MdOutlineEmail className="w-4 h-4" />
                                garasibelajar.id@gmail.com
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.instagram.com/gabara_education?igsh=MTl5c3lpeTdzNXp5dg=="
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-white transition-colors"
                            >
                                <FaInstagram className="w-4 h-4" />
                                Gabara_Education
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Gallery */}
                <div>
                    <h2 className="font-semibold mb-4 text-base">Galeri</h2>
                    <div className="grid grid-cols-2 gap-2">
                        {galleryImages.map((img, i) => (
                            <div
                                key={i}
                                className="w-full aspect-[4/3] rounded-md overflow-hidden"
                            >
                                <img
                                    src={img}
                                    alt={`Footer ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="mt-12 border-t border-white/20 pt-4 text-center text-sm text-slate-400">
                © {new Date().getFullYear()} Gabara. Hak Cipta Dilindungi oleh
                Telkom University Purwokerto.
            </div>
        </footer>
    );
}
