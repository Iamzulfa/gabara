import flexibleIcon from "../../../assets/images/Flexible.png";
import directedIcon from "../../../assets/images/Directed.png";
import packetcIcon from "../../../assets/images/PacketC.png";
import community from "../../../assets/images/Community.png";

import Card from "./Components/card/ServiceCard";

export default function ServiceSection() {
    const features = [
        {
            icon: flexibleIcon,
            title: "Kelas Fleksibel",
            description: "Belajar online atau tatap muka sesuai kebutuhan.",
        },
        {
            icon: {
                src: directedIcon,
                alt: "Directed",
            },
            title: "Bimbingan Terarah",
            description: "Materi sesuai kurikulum ujian paket dengan tutor yang siap mendampingi.",
        },
        {
            icon: packetcIcon,
            title: "Persiapan Ujian",
            description: "Latihan soal & simulasi supaya lebih siap menghadapi ujian.",
        },
        {
            icon: {
                src: community,
                alt: "Community",
            },
            title: "Komunitas Belajar",
            description: "Ruang untuk saling dukung antar siswa dan tutor.",
        },
    ];

    return (
        <section id="features" className="py-24 px-6 lg:px-20 mt-12 md:mt-16">
            <div className="container mx-auto">
                {/* Heading */}
                <div className="text-center mb-12">
                    <h2 className="heading">
                        Kenapa Harus <span className="text-primary">Gabara?</span>
                    </h2>
                    <p className="subheading lg:px-16 2xl:px-60">
                        Banyak anak dan orang tua di Banjarnegara terhambat sekolah karena biaya, jarak, atau waktu. Gabara menawarkan cara belajar fleksibel dan mudah diakses agar pendidikan tetap bisa diselesaikan.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
