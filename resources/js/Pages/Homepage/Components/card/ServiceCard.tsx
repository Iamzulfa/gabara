interface CardProps {
    icon: string | { src: string; alt: string };
    title: string;
    description: string;
}

export default function ServiceCard({ icon, title, description }: CardProps) {
    const src = typeof icon === "string" ? icon : icon.src;
    const alt = typeof icon === "string" ? title : icon.alt;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center text-center hover:shadow-xl transition">
            <div className="w-14 h-14 flex items-center justify-center bg-primary rounded-lg mb-4">
                <img src={src} alt={alt} className="w-12 h-12 object-contain" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-gray-600 text-sm">{description}</p>
        </div>
    );
}
