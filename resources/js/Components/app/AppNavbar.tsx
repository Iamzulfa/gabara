import React, { ReactNode, useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import Button from "@/Components/ui/button/Button";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/Components/ui/navigation-menu";

import LogoWhite from "../../../assets/logo/logo-white.png";
import LogoColor from "../../../assets/logo/logo-color.png";

type Props = {
    children: ReactNode;
};

export default function AppLayout({ children }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
                    scrolled ? "bg-white shadow-md" : "bg-transparent"
                }`}
            >
                <div className="container mx-auto px-6 py-4 relative flex items-center justify-between">
                    {/* Logo kiri */}
                    <Link href="/" className="flex items-center gap-2 z-10">
                        <img
                            src={scrolled ? LogoColor : LogoWhite}
                            alt="Gabara Logo"
                            className="w-32 h-auto transition-all duration-300"
                        />
                    </Link>

                    {/* Hamburger kanan (mobile only) */}
                    <button
                        className="md:hidden flex items-center justify-center w-10 h-10 z-10"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <div className="space-y-1">
                            <span
                                className={`block w-6 h-0.5 ${
                                    scrolled ? "bg-black" : "bg-white"
                                }`}
                            ></span>
                            <span
                                className={`block w-6 h-0.5 ${
                                    scrolled ? "bg-black" : "bg-white"
                                }`}
                            ></span>
                            <span
                                className={`block w-6 h-0.5 ${
                                    scrolled ? "bg-black" : "bg-white"
                                }`}
                            ></span>
                        </div>
                    </button>

                    {/* Nav tengah (desktop only) */}
                    <NavigationMenu className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        href="/"
                                        className={
                                            scrolled
                                                ? "text-black/90"
                                                : "text-white/95"
                                        }
                                    >
                                        Beranda
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <a
                                        href="#features"
                                        className={
                                            scrolled
                                                ? "text-black/90"
                                                : "text-white/95"
                                        }
                                    >
                                        Layanan
                                    </a>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <a
                                        href="#testimonials"
                                        className={
                                            scrolled
                                                ? "text-black/90"
                                                : "text-white/95"
                                        }
                                    >
                                        Testimoni
                                    </a>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <a
                                        href="#mitra"
                                        className={
                                            scrolled
                                                ? "text-black/90"
                                                : "text-white/95"
                                        }
                                    >
                                        Mitra
                                    </a>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <a
                                        href="#faq"
                                        className={
                                            scrolled
                                                ? "text-black/90"
                                                : "text-white/95"
                                        }
                                    >
                                        FAQ
                                    </a>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Button Login hanya untuk desktop */}
                    <div className="hidden md:flex items-center gap-3 z-10">
                        <Link href={route("login")}>
                            <Button variant="danger">Login</Button>
                        </Link>
                    </div>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white text-black shadow-md flex flex-col items-start px-6 py-4 gap-3">
                        <Link href="/" onClick={() => setIsOpen(false)}>
                            Beranda
                        </Link>
                        <a href="#features" onClick={() => setIsOpen(false)}>
                            Layanan
                        </a>
                        <a href="#testimonials" onClick={() => setIsOpen(false)}>
                            Testimoni
                        </a>
                        <a href="#mitra" onClick={() => setIsOpen(false)}>
                            Mitra
                        </a>
                        <a href="#faq" onClick={() => setIsOpen(false)}>
                            FAQ
                        </a>

                        {/* Login hanya muncul di menu mobile */}
                        <Link
                            href={route("login")}
                            onClick={() => setIsOpen(false)}
                            className="w-full mt-3"
                        >
                            <Button variant="danger" className="w-full">
                                Login
                            </Button>
                        </Link>
                    </div>
                )}
            </header>

            {/* Content */}
            <main className="flex-1">{children}</main>
        </div>
    );
}
