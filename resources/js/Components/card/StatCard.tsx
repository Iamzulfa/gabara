import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface StatCardProps {
    icon: ReactNode;
    title: string;
    value?: string | number;
    className?: string;
    children?: ReactNode;
}

const StatCard: FC<StatCardProps> = ({
    icon,
    title,
    value,
    className,
    children,
}) => {
    return (
        <div
            className={twMerge(
                "rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6",
                className
            )}
        >
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl dark:bg-gray-800">
                {icon}
            </div>

            <div className="mt-5">
                <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {title}
                    </span>

                    {value !== undefined && (
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm">
                            {value}
                        </h4>
                    )}
                </div>

                {children && <div className="mt-3">{children}</div>}
            </div>
        </div>
    );
};

export default StatCard;
