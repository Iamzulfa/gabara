import { LuLayoutDashboard, LuUserRound } from "react-icons/lu";
import { MdOutlineClass, MdOutlineQuiz } from "react-icons/md";
import { GrAnnounce } from "react-icons/gr";

export const navConfig: Record<string, any[]> = {
    admin: [
        { icon: <LuLayoutDashboard />, name: "Dashboard", path: "/dashboard/admin" },
        { icon: <LuUserRound />, name: "User", path: "/admin/users" },
        { icon: <MdOutlineClass />, name: "Kelas", path: "/admin/classes" },
        { icon: <GrAnnounce />, name: "Pengumuman", path: "/admin/announcements" },
    ],
    mentor: [
        { icon: <LuLayoutDashboard />, name: "Dashboard", path: "/dashboard/mentor" },
        { icon: <MdOutlineClass />, name: "Kelasku", path: "/mentor/kelas" },
        { icon: <MdOutlineQuiz />, name: "Kuis", path: "/mentor/kuis" },
    ],
    student: [
        { icon: <LuLayoutDashboard />, name: "Dashboard", path: "/dashboard/student" },
        { icon: <MdOutlineClass />, name: "Kelasku", path: "/student/kelas" },
    ],
};
