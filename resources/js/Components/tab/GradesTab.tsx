import React from 'react';
import { usePage } from '@inertiajs/react';
import ReactApexChart from 'react-apexcharts';
import { PageProps, Grade, ChartData } from '@/types/types';

const GradesTab: React.FC = () => {
    const { props } = usePage<PageProps>();
    const { auth, class: classData, userRole } = props;
    const isStudent = userRole === 'student';

    if (!classData) {
        return (
            <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">Nilai</h2>
                <p className="text-gray-500">Data kelas tidak tersedia.</p>
            </div>
        );
    }

    const allAssignments = classData.meetings.flatMap(meeting => meeting.assignments);
    const allSubmissions = classData.meetings.flatMap(meeting =>
        meeting.assignments.flatMap(assignment => assignment.submissions)
    );
    const enrolledStudents = classData.enrollments.map(enrollment => enrollment.student);

    const grades: Grade[] = isStudent
        ? allAssignments.map((assignment) => {
            const submission = allSubmissions.find(s => s.assignment_id === assignment.id && s.student_id === auth.user.id);
            const deadline = new Date(`${assignment.date_close}T${assignment.time_close}Z`);
            const now = new Date();
            const isPastDeadline = now > deadline;

            return {
                item: assignment.title || `Tugas ${assignment.id}`,
                score: submission?.grade,
                feedback: submission?.feedback || '-',
                status: submission?.submitted_at
                    ? isPastDeadline
                        ? 'Terlambat'
                        : 'Dikumpulkan'
                    : isPastDeadline
                        ? 'Terlambat'
                        : 'Belum Dikumpulkan',
            };
        })
        : allAssignments.flatMap((assignment) => {
            const deadline = new Date(`${assignment.date_close}T${assignment.time_close}Z`);
            const now = new Date();
            const isPastDeadline = now > deadline;

            return enrolledStudents.map((student) => {
                const submission = allSubmissions.find(
                    s => s.assignment_id === assignment.id && s.student_id === student.id
                );

                return {
                    item: assignment.title || `Tugas ${assignment.id}`,
                    student_name: student.name || 'Unknown',
                    score: submission?.grade,
                    feedback: submission?.feedback || '-',
                    status: submission?.submitted_at
                        ? isPastDeadline
                            ? 'Terlambat'
                            : 'Dikumpulkan'
                        : isPastDeadline
                            ? 'Terlambat'
                            : 'Belum Dikumpulkan',
                };
            });
        });

    const chartData: ChartData = {
        series: [
            {
                name: 'Rata-rata Nilai',
                data: [
                    grades
                        .filter((g) => g.item.includes('Tugas') && g.score !== undefined)
                        .reduce((sum, g) => sum + (g.score || 0), 0) /
                        (grades.filter((g) => g.item.includes('Tugas') && g.score !== undefined).length || 1) || 0,
                    grades
                        .filter((g) => g.item.includes('Kuis') && g.score !== undefined)
                        .reduce((sum, g) => sum + (g.score || 0), 0) /
                        (grades.filter((g) => g.item.includes('Kuis') && g.score !== undefined).length || 1) || 0,
                ],
            },
        ],
        categories: ['Tugas', 'Kuis'],
    };

    return (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Nilai</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {/* Left section: Grade list */}
                <div className="col-span-2 p-4 border rounded-lg">
                    <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                        {isStudent ? (
                            <table className="w-full mt-2 text-sm">
                                <thead>
                                    <tr>
                                        <th className="text-left py-2 pe-4 whitespace-nowrap">Item Penilaian</th>
                                        <th className="text-left py-2 pe-4 whitespace-nowrap">Nilai</th>
                                        <th className="text-left py-2 pe-4 whitespace-nowrap">Umpan Balik</th>
                                        <th className="text-left py-2 pe-4 whitespace-nowrap">Status Penilaian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grades.length > 0 ? (
                                        grades.map((grade, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="py-2 pe-4 whitespace-nowrap">{grade.item}</td>
                                                <td className="py-2 pe-4 whitespace-nowrap">{grade.score ?? '-'}</td>
                                                <td className="py-2 pe-4 whitespace-nowrap">{grade.feedback}</td>
                                                <td className="py-2 pe-4 whitespace-nowrap">{grade.status}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-2 text-center text-gray-500">
                                                Tidak ada data penilaian.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <table className="w-full mt-2 text-sm">
                                <thead>
                                    <tr>
                                        <th className="text-left py-2 pe-4 whitespace-nowrap">Item Penilaian</th>
                                        <th className="text-left py-2 pe-4 whitespace-nowrap">Nama Siswa</th>
                                        <th className="text-left py-2 pe-4 whitespace-nowrap">Nilai</th>
                                        <th className="text-left py-2 pe-4 whitespace-nowrap">Umpan Balik</th>
                                        <th className="text-left py-2 pe-4 whitespace-nowrap">Status Penilaian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grades.length > 0 ? (
                                        grades.map((grade, index) => (
                                            <tr key={`${grade.item}-${grade.student_name}-${index}`} className="border-b">
                                                <td className="py-2 pe-4 whitespace-nowrap">{grade.item}</td>
                                                <td className="py-2 pe-4 whitespace-nowrap">{grade.student_name}</td>
                                                <td className="py-2 pe-4 whitespace-nowrap">{grade.score ?? '-'}</td>
                                                <td className="py-2 pe-4 whitespace-nowrap">{grade.feedback}</td>
                                                <td className="py-2 pe-4 whitespace-nowrap">{grade.status}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-2 text-center text-gray-500">
                                                Tidak ada data penilaian.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                {/* Right section: Chart */}
                <div className="col-span-2 md:col-span-1 w-full border p-4 rounded-lg">
                    <h3 className="text-lg text-center font-bold text-gray-700 mb-2">Ringkasan Nilai</h3>
                    <ReactApexChart
                        options={{
                            chart: { type: 'bar' },
                            xaxis: {
                                categories: chartData.categories,
                            },
                            colors: ['#F97316', '#D946EF'],
                            legend: { position: 'bottom' },
                            responsive: [{ breakpoint: 480, options: { chart: { width: '100%' } } }],
                        }}
                        series={chartData.series}
                        type="bar"
                        height={300}
                    />
                </div>
            </div>
        </div>
    );
};

export default GradesTab;
