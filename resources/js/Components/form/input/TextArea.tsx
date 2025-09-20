import { ChangeEventHandler } from "react";

interface TextareaProps {
    placeholder?: string;
    rows?: number;
    value?: string;
    onChange?: ChangeEventHandler<HTMLTextAreaElement>;
    className?: string;
    disabled?: boolean;
    error?: boolean;
    hint?: string;
    maxLength?: number;
}

const TextArea: React.FC<TextareaProps> = ({
    placeholder = "Tulis sesuatu...",
    rows = 3,
    value = "",
    onChange,
    className = "",
    disabled = false,
    error = false,
    hint = "",
    maxLength = 255,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) {
            // Batasi agar tidak lebih dari maxLength
            if (e.target.value.length <= maxLength) {
                onChange(e);
            }
        }
    };

    let textareaClasses = `w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden ${className} `;

    if (disabled) {
        textareaClasses += ` bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed opacity40 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
    } else if (error) {
        textareaClasses += ` bg-transparent  border-gray-300 focus:border-error-300 focus:ring-3 focus:ring-error-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-error-800`;
    } else {
        textareaClasses += ` bg-transparent text-gray-900 dark:text-gray-300 text-gray-900 border-gray-300 focus:ring-3 focus:border-primary focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
    }

    return (
        <div className="relative">
            <textarea
                placeholder={placeholder}
                rows={rows}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                className={textareaClasses}
            />
            {/* Counter */}
            <div className="mt-1 flex justify-between text-xs">
                {hint && (
                    <p className={`${error ? "text-error-500" : "text-error-500"}`}>
                        {hint}
                    </p>
                )}
                <p
                    className={`ml-auto ${value.length >= maxLength
                            ? "text-success-500 font-medium"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                >
                    {value.length}/{maxLength}
                </p>
            </div>
        </div>
    );
};

export default TextArea;
