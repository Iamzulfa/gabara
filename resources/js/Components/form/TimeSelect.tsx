import React, { useRef, useEffect, useState } from "react";

interface TimeSelectProps {
    value: string;
    onChange: (val: string) => void;
}

const TimeSelect: React.FC<TimeSelectProps> = ({ value, onChange }) => {
    const [hour, minute] = value ? value.split(":") : ["00", "00"];
    const [isHourOpen, setIsHourOpen] = useState(false);
    const [isMinuteOpen, setIsMinuteOpen] = useState(false);

    const hourRef = useRef<HTMLDivElement>(null);
    const minuteRef = useRef<HTMLDivElement>(null);
    const hourContainerRef = useRef<HTMLDivElement>(null);
    const minuteContainerRef = useRef<HTMLDivElement>(null);

    // Data untuk hours dan minutes
    const hours = Array.from({ length: 24 }, (_, i) => {
        const h = i.toString().padStart(2, "0");
        return { value: h, label: h };
    });

    const minutes = Array.from({ length: 60 }, (_, i) => {
        const m = i.toString().padStart(2, "0");
        return { value: m, label: m };
    });

    // Auto-scroll ke value yang dipilih saat picker dibuka
    useEffect(() => {
        if (isHourOpen && hourRef.current) {
            const selected = hourRef.current.querySelector(`[data-value="${hour}"]`);
            if (selected) {
                selected.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
        if (isMinuteOpen && minuteRef.current) {
            const selected = minuteRef.current.querySelector(`[data-value="${minute}"]`);
            if (selected) {
                selected.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [isHourOpen, isMinuteOpen, hour, minute]);

    // Tutup picker saat klik di luar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (hourContainerRef.current && !hourContainerRef.current.contains(event.target as Node)) {
                setIsHourOpen(false);
            }
            if (minuteContainerRef.current && !minuteContainerRef.current.contains(event.target as Node)) {
                setIsMinuteOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleHourChange = (h: string) => {
        onChange(`${h}:${minute}`);
        setIsHourOpen(false);
    };

    const handleMinuteChange = (m: string) => {
        onChange(`${hour}:${m}`);
        setIsMinuteOpen(false);
    };

    return (
        <div className="flex items-center gap-1">
            {/* Hour Input */}
            <div ref={hourContainerRef} className="relative w-14">
                <input
                    type="text"
                    value={hour}
                    readOnly
                    onClick={() => setIsHourOpen(!isHourOpen)}
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-primary focus:ring-primary/20 cursor-pointer"
                />
                {isHourOpen && (
                    <div className="absolute z-10 top-full mt-1 w-full max-h-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg overflow-y-auto scrollbar-none no-scrollbar">
                        <div
                            ref={hourRef}
                            className="flex flex-col items-center py-8 snap-y snap-mandatory"
                            style={{ scrollSnapType: "y mandatory", touchAction: "pan-y" }}
                        >
                            {hours.map((h) => (
                                <button
                                    key={h.value}
                                    data-value={h.value}
                                    onClick={() => handleHourChange(h.value)}
                                    className={`w-full py-1.5 text-sm font-medium transition-all duration-200
                                        ${hour === h.value
                                            ? "text-primary dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30"
                                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        } snap-center`}
                                >
                                    {h.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">:</span>

            {/* Minute Input */}
            <div ref={minuteContainerRef} className="relative w-14">
                <input
                    type="text"
                    value={minute}
                    readOnly
                    onClick={() => setIsMinuteOpen(!isMinuteOpen)}
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-primary focus:ring-primary/20 cursor-pointer"
                />
                {isMinuteOpen && (
                    <div className="absolute z-10 top-full mt-1 w-full max-h-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg overflow-y-auto scrollbar-none no-scrollbar">
                        <div
                            ref={minuteRef}
                            className="flex flex-col items-center py-8 snap-y snap-mandatory"
                            style={{ scrollSnapType: "y mandatory", touchAction: "pan-y" }}
                        >
                            {minutes.map((m) => (
                                <button
                                    key={m.value}
                                    data-value={m.value}
                                    onClick={() => handleMinuteChange(m.value)}
                                    className={`w-full py-1.5 text-sm font-medium transition-all duration-200
                                        ${minute === m.value
                                            ? "text-primary dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30"
                                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        } snap-center`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimeSelect;
