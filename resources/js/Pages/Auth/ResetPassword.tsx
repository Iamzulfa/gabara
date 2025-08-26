import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Button from "@/Components/ui/button/Button";
import Input from "@/Components/form/input/InputField";
import Label from "@/Components/form/Label";

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="flex min-h-screen flex-col justify-center items-center bg-gray-100 mx-4 sm:justify-center sm:pt-0">
            <div className="w-full overflow-hidden bg-white px-6 py-6 shadow-md sm:max-w-md sm:rounded-lg">
                <Head title="Reset Password" />

                <div className="mb-4 text-sm text-center text-gray-600">
                    Masukkan kata sandi baru kamu di bawah ini untuk mengganti password lama.
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            error={!!errors.email}
                            hint={errors.email}
                            disabled
                        />
                    </div>

                    <div>
                        <Label htmlFor="password">Kata Sandi Baru</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            placeholder="Masukkan kata sandi baru"
                            onChange={(e) => setData("password", e.target.value)}
                            error={!!errors.password}
                            hint={errors.password}
                        />
                    </div>

                    <div>
                        <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            placeholder="Ulangi kata sandi baru"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            error={!!errors.password_confirmation}
                            hint={errors.password_confirmation}
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
                            "Simpan Kata Sandi Baru"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
