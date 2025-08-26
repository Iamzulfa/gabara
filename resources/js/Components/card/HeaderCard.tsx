import { Link } from "@inertiajs/react";
import { LuPlus } from "react-icons/lu";
import Button from "@/Components/ui/button/Button";

interface HeaderSectionProps {
    title?: string;
    date?: string;
    buttonLabel?: string;
    to?: string;
    showButton?: boolean;
    onButtonClick?: () => void;
    showSecondButton?: boolean;
    secondButtonLabel?: string;
    onSecondButtonClick?: () => void;
}

const HeaderSection = ({
    title = "Judul",
    date,
    buttonLabel = "Buat",
    to,
    showButton = true,
    onButtonClick,
    showSecondButton = false,
    secondButtonLabel = "Tambah",
    onSecondButtonClick,
}: HeaderSectionProps) => {
    return (
        <div className="flex justify-between items-center rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div>
                <h1 className="text-lg font-semibold text-gray-800">
                    {title}
                </h1>

                {date && (
                    <p className="text-sm text-gray-500 mt-2">
                        {date}
                    </p>
                )}
            </div>

            {showButton && (
                <div className="flex gap-2">
                    {to && (
                        <Link href={to}>
                            <Button variant="default" size="sm">
                                <LuPlus />
                                <span>{buttonLabel}</span>
                            </Button>
                        </Link>
                    )}
                    {onButtonClick && (
                        <Button variant="default" size="sm" onClick={onButtonClick}>
                            <LuPlus />
                            <span>{buttonLabel}</span>
                        </Button>
                    )}
                    {showSecondButton && onSecondButtonClick && (
                        <Button variant="outline" size="sm" onClick={onSecondButtonClick}>
                            {secondButtonLabel}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

export default HeaderSection;
