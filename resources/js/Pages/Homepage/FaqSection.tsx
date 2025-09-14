import faqImage from "../../../assets/images/image-faq.png";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";

type QA = { question: string; answer: string };

const defaultFaqs: QA[] = [
    {
        question: "Apa itu Gabara?",
        answer: "Gabara (Garasi Belajar Banjarnegara) adalah wadah belajar non-formal yang hadir untuk membantu anak-anak, remaja, maupun orang dewasa yang sempat putus sekolah agar tetap bisa melanjutkan pendidikan dan meraih masa depan lebih baik.",
    },
    {
        question: "Siapa saja yang bisa ikut belajar?",
        answer: "Semua masyarakat Banjarnegara yang putus sekolah, baik tingkat SD, SMP, maupun SMA, dapat bergabung di Gabara tanpa batasan usia tertentu.",
    },
    {
        question: "Apakah belajar di Gabara berbayar?",
        answer: "Tidak. Gabara merupakan inisiatif sosial yang memberikan fasilitas belajar secara gratis agar pendidikan bisa diakses oleh semua kalangan.",
    },
    {
        question: "Apa saja program yang ada di Gabara?",
        answer: `Program Gabara meliputi:
- Bimbingan belajar untuk mata pelajaran dasar
- Kelas persiapan Paket A, B, dan C (setara SD, SMP, SMA)
- Kegiatan pengembangan diri seperti literasi, diskusi, dan keterampilan hidup
- Kelas motivasi untuk membangun semangat belajar`,
    },
    {
        question: "Apakah Gabara hanya untuk anak-anak?",
        answer: "Tidak. Gabara terbuka untuk semua usia yang ingin melanjutkan pendidikan.",
    },
];

interface FaqSectionProps {
    faqs?: QA[];
}

export default function FaqSection({ faqs = defaultFaqs }: FaqSectionProps) {
    return (
        <section id="faq" className="w-full py-32 px-6 lg:px-20">
            <div className="container lg:space-x-10 mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* Heading */}
                <div className="w-full max-w-sm">
                    <img
                        src={faqImage}
                        alt="FAQ Illustration"
                        className="w-full object-cover rounded-xl shadow-md"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col w-full items-start">
                    <div className="mx-auto sm:mx-0 text-center">
                        <h2 className="heading">
                            Frequently Asked Questions
                        </h2>
                        <p className="subheading sm:text-left -mt-4">
                            Pertanyaan yang mungkin ditanyakan tentang layanan kami
                        </p>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((item, idx) => (
                            <AccordionItem key={idx} value={`item-${idx}`}>
                                <AccordionTrigger className="text-left font-bold text-slate-800">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 text-sm leading-relaxed whitespace-pre-line 2xl:pr-40">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
