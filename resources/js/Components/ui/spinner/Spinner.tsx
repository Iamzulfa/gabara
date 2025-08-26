// components/ui/Spinner.tsx
import { LuLoaderCircle } from "react-icons/lu";
import { cn } from "../../../lib/utils";

interface SpinnerProps {
    className?: string;
}

export const Spinner = ({ className }: SpinnerProps) => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <LuLoaderCircle className={cn("h-12 w-12 animate-spin text-primary", className)} />
        </div>
    );
};
