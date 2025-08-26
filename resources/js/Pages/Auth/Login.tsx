import AuthLayout from "@/Components/auth/AuthLayout";
import Login from "@/Components/auth/Login";
import ImageLogin from "../../../assets/images/image-login.png";
import Logo from "../../../assets/logo/logo-white.png";

export default function LoginPage() {
    return (
        <>
            <AuthLayout
                image={ImageLogin}
                logo={Logo}
                subtitle="Sekolah boleh tertunda, tapi mimpi jangan berhenti. Gabara hadir agar kamu bisa belajar lagi dengan cara yang lebih mudah."
            >
                <Login />
            </AuthLayout>
        </>
    );
}
