import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { AiOutlineLoading3Quarters, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { LuPencil } from "react-icons/lu";
import { Modal } from "@/Components/ui/modal";
import Button from "@/Components/ui/button/Button";
import Input from "@/Components/form/input/InputField";
import Label from "@/Components/form/Label";

export default function ChangePasswordCard() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const { data, setData, put, reset, errors } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsOpen(false);
                setLoading(false);
            },
            onError: () => setLoading(false),
            onFinish: () => setLoading(false),
        });
    };

    return (
        <>
            {/* Card Change Password */}
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">
                            Ganti Password
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Atur ulang password akun kamu untuk keamanan.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                    >
                        <LuPencil className="w-4 h-4" />
                        Ubah
                    </button>
                </div>
            </div>

            {/* Modal Change Password */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-[500px] m-4">
                <div className="relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900">
                    <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Ganti Password
                    </h4>

                    <form className="flex flex-col space-y-5" onSubmit={handleSave}>
                        {/* Current Password */}
                        <div>
                            <Label>Password Lama</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword.current ? "text" : "password"}
                                    name="current_password"
                                    value={data.current_password}
                                    onChange={(e) => setData("current_password", e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                                    className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    tabIndex={-1}
                                >
                                    {showPassword.current ? <AiFillEyeInvisible /> : <AiFillEye />}
                                </button>
                            </div>
                            {errors.current_password && (
                                <p className="mt-1 text-xs text-red-500">{errors.current_password}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div>
                            <Label>Password Baru</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword.new ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                                    className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    tabIndex={-1}
                                >
                                    {showPassword.new ? <AiFillEyeInvisible /> : <AiFillEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <Label>Konfirmasi Password Baru</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword.confirm ? "text" : "password"}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData("password_confirmation", e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                                    className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    tabIndex={-1}
                                >
                                    {showPassword.confirm ? <AiFillEyeInvisible /> : <AiFillEye />}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-6 justify-end">
                            <Button size="sm" variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
                                Batal
                            </Button>
                            <Button size="sm" type="submit" variant="default" disabled={loading}>
                                {loading ? (
                                    <>
                                        <AiOutlineLoading3Quarters className="animate-spin text-lg" />
                                        Loading...
                                    </>
                                ) : (
                                    "Simpan"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
