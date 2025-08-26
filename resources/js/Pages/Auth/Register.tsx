import AuthLayout from "@/Components/auth/AuthLayout";
import Register from "@/Components/auth/Register";
import ImageRegister from "../../../assets/images/image-register.png";
import Logo from "../../../assets/logo/logo-white.png";

export default function RegisterPage() {
    return (
        <>
            <AuthLayout
                image={ImageRegister}
                logo={Logo}
                subtitle="Mari bergabung dengan Gabara dan temukan kembali semangat belajar tanpa batas. Pendidikan terbuka untuk siapa saja, kapan saja, dan di mana saja."
            >
                <Register />
            </AuthLayout>
        </>
    );
}
