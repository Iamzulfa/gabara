import { useState } from "react";

import Input from "../form/input/InputField";

import { Class, ParticipantsTabProps } from "@/types/types";

export default function ParticipantsTab({ classData }: ParticipantsTabProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredEnrollments = classData.enrollments?.filter((enr) =>
        enr.student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-col items-start md:flex-row md:justify-between gap-2">
                {/* Title */}
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">Daftar Peserta</h2>
                {/* Search Input */}
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                    <Input
                        type="text"
                        placeholder="Cari peserta berdasarkan nama..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            {/* Participants List */}
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {filteredEnrollments?.length > 0 ? (
                    filteredEnrollments.map((enr) => (
                        <div
                            key={enr.student.id}
                            className="max-w-xs flex justify-start items-center gap-2 bg-white rounded-lg border border-gray-200 py-2 px-4"
                        >
                            <img
                                src={
                                    enr.student.avatar ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(enr.student.name)}`
                                }
                                alt={enr.student.name}
                                className="w-10 h-10 rounded-full border border-white"
                            />
                            <p>{enr.student.name}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">Tidak ada data peserta</p>
                )}
            </div>
        </div>
    );
}
