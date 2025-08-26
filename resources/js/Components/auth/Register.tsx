import { useEffect, useRef, useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { AiOutlineLoading3Quarters, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Indonesian } from "flatpickr/dist/l10n/id.js";
import Label from "@/Components/form/Label";
import Input from "@/Components/form/input/InputField";
import Select from "@/Components/form/Select";
import Button from "@/Components/ui/button/Button";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        gender: "",
        birthdate: "",
        password: "",
    });

    // Init Flatpickr
    const birthRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (!birthRef.current) return;

        const fp = flatpickr(birthRef.current, {
            dateFormat: "Y-m-d",
            position: "above",
            defaultDate: data.birthdate || undefined,
            locale: Indonesian,
            onChange: (_dates, dateStr) => setData("birthdate", dateStr),
        });

        return () => fp.destroy();
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Registrasi" />

            <div className="flex flex-col flex-1 min-h-screen">
                <div className="flex flex-col justify-center flex-1 w-full max-w-md px-6 mx-auto">
                    <h1 className="mb-8 font-semibold text-center text-gray-900 text-2xl dark:text-white">
                        Registrasi
                    </h1>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Nama Lengkap */}
                        <div>
                            <Label>Nama Lengkap <span className="text-error-500">*</span></Label>
                            <Input
                                id="name"
                                name="name"
                                value={data.name}
                                placeholder="Masukkan nama lengkap"
                                onChange={(e) => setData("name", e.target.value)}
                                error={!!errors.name}
                            />
                            {errors.name && <p className="mt-1 text-xs text-error-500">{errors.name}</p>}
                        </div>

                        {/* Email & No HP */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <Label>Email <span className="text-error-500">*</span></Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="Masukkan email"
                                    onChange={(e) => setData("email", e.target.value)}
                                    error={!!errors.email}
                                />
                                {errors.email && <p className="mt-1 text-xs text-error-500">{errors.email}</p>}
                            </div>
                            <div>
                                <Label>No Hp <span className="text-error-500">*</span></Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={data.phone}
                                    placeholder="Masukkan no hp"
                                    onChange={(e) => setData("phone", e.target.value)}
                                    error={!!errors.phone}
                                />
                                {errors.phone && <p className="mt-1 text-xs text-error-500">{errors.phone}</p>}
                            </div>
                        </div>

                        {/* Gender & Birthdate */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <Label>Jenis Kelamin <span className="text-error-500">*</span></Label>
                                <Select
                                    value={data.gender}
                                    onChange={(value) => setData("gender", value)}
                                    options={[
                                        { value: "Laki-laki", label: "Laki-laki" },
                                        { value: "Perempuan", label: "Perempuan" },
                                    ]}
                                    placeholder="Pilih jenis kelamin"
                                    className="w-full"
                                />
                                {errors.gender && <p className="mt-1 text-xs text-error-500">{errors.gender}</p>}
                            </div>

                            <div>
                                <Label>Tanggal Lahir <span className="text-error-500">*</span></Label>
                                <Input
                                    ref={birthRef}
                                    id="birthdate"
                                    name="birthdate"
                                    defaultValue={data.birthdate}
                                    placeholder="YYYY-MM-DD"
                                    readOnly />
                                {errors.birthdate && <p className="mt-1 text-xs text-error-500">{errors.birthdate}</p>}
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <Label>Password <span className="text-error-500">*</span></Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    placeholder="Masukkan password"
                                    onChange={(e) => setData("password", e.target.value)}
                                    error={!!errors.password}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center text-gray-500 hover:text-gray-700"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-error-500">{errors.password}</p>}
                        </div>

                        {/* Submit */}
                        <Button type="submit" variant="default" disabled={processing} className="w-full">
                            {processing ? (
                                <>
                                    <AiOutlineLoading3Quarters className="animate-spin text-lg" />
                                    Loading...
                                </>
                            ) : (
                                "Registrasi"
                            )}
                        </Button>

                        <div className="flex justify-center mt-4 gap-1 text-sm">
                            <p>Sudah punya akun?</p>
                            <Link href="/login" className="text-primary font-bold hover:underline">
                                Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
