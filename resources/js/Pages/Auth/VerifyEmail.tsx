import Button from "@/Components/ui/button/Button";
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ImageVerify from "../../../assets/images/image-verify.png";

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <div className="flex min-h-screen flex-col justify-center items-center bg-gray-100 mx-4 sm:justify-center sm:pt-0">
            <div>
                <img src={ImageVerify} alt="Image Verify" className="w-72 h-auto"/>
            </div>

            <div className="w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                <Head title="Verifikasi Email" />

                <div className="mb-4 text-sm text-center text-gray-600">
                    Terima kasih telah mendaftar! Sebelum mulai, silakan verifikasi
                    alamat email kamu dengan mengklik tautan yang baru saja kami kirimkan.
                    Jika kamu belum menerima email, klik tombol di bawah ini untuk mengirim ulang.
                </div>

                {status === 'verification-link-sent' && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        Tautan verifikasi baru telah dikirim ke alamat email yang kamu daftarkan.
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="mt-4 flex justify-center">
                        <Button type="submit" variant="default" disabled={processing} className="w-full">
                            {processing ? (
                                <>
                                    <AiOutlineLoading3Quarters className="animate-spin text-lg" />
                                    Loading...
                                </>
                            ) : (
                                "Kirim Ulang Kode Verifikasi"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
