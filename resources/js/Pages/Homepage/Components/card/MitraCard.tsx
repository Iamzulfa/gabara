interface MitraCardProps {
    image: string | { src: string; alt: string };
    title: string;
    address: string;
    link?: string;
}

export default function MitraCard({ image, title, address, link }: MitraCardProps) {
    const src = typeof image === "string" ? image : image.src;
    const alt = typeof image === "string" ? title : image.alt;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 flex flex-col items-center text-center hover:shadow-xl transition">
            <div className="w-full flex items-center justify-center rounded-xl mb-4 overflow-hidden">
                <img src={src} alt={alt} className="w-full h-full object-contain" />
            </div>

            <div className="flex flex-col gap-4 h-42 xsm:h-36 sm:h-32">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-gray-600 text-sm mb-3">{address}</p>
            </div>

            {link && (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-primary text-white w-full py-3 rounded-sm text-sm font-medium hover:bg-primary/90 transition"
                >
                    Kunjungi
                </a>
            )}
        </div>
    );
}
