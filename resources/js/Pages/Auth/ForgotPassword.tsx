import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Button from "@/Components/ui/button/Button";
import Input from "@/Components/form/input/InputField";
import Label from "@/Components/form/Label";
import ImageVerify from "../../../assets/images/image-forgotpassword.png";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <div className="flex min-h-screen flex-col justify-center items-center bg-gray-100 mx-4 sm:justify-center sm:pt-0">
            <div>
                <img src={ImageVerify} alt="Forgot Password" className="w-72 h-auto" />
            </div>

            <div className="w-full overflow-hidden bg-white px-6 py-6 shadow-md sm:max-w-md sm:rounded-lg">
                <Head title="Lupa Password" />

                <div className="mb-4 text-sm text-center text-gray-600">
                    Lupa kata sandi kamu? Tidak masalah. Masukkan alamat email dan kami akan
                    mengirimkan tautan reset password ke email kamu untuk membuat kata sandi baru.
                </div>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600 text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            placeholder="Masukkan email kamu"
                            onChange={(e) => setData("email", e.target.value)}
                            error={!!errors.email}
                            hint={errors.email}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="default"
                        disabled={processing}
                        className="w-full"
                    >
                        {processing ? (
                            <>
                                <AiOutlineLoading3Quarters className="animate-spin text-lg" />
                                Loading...
                            </>
                        ) : (
                            "Kirim Tautan Reset Password"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
