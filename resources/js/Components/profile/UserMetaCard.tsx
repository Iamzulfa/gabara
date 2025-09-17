// resources/js/Components/profile/UserMetaCard.tsx
import { useEffect, useRef, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Modal } from "@/Components/ui/modal";
import Button from "@/Components/ui/button/Button";
import Input from "@/Components/form/input/InputField";
import Select from "@/Components/form/Select";
import Label from "@/Components/form/Label";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Indonesian } from "flatpickr/dist/l10n/id.js";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { LuPencil } from "react-icons/lu";
import ImageUser from "../../../assets/images/image-user.png";

type UserForm = {
    name: string;
    phone: string;
    email: string;
    gender: string;
    birthdate: string;
    avatar: File | null;

    // role-specific
    parent_name?: string;
    parent_phone?: string;
    address?: string;

    expertise?: string;
    scope?: string;
};

export default function UserMetaCard() {
    const { auth }: any = usePage().props;
    const role: string = auth.user?.role ?? "";
    const [isOpen, setIsOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState(ImageUser);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const { data, setData, errors } = useForm<UserForm>({
        name: auth.user?.name || "",
        phone: auth.user?.phone || "",
        email: auth.user?.email || "",
        gender: auth.user?.gender || "",
        birthdate: auth.user?.birthdate || "",
        avatar: null,
        parent_name: auth.user?.parent_name || "",
        parent_phone: auth.user?.parent_phone || "",
        address: auth.user?.address || "",
        expertise: auth.user?.expertise || "",
        scope: auth.user?.scope || "",
    });

    useEffect(() => {
        if (auth.user?.avatar) {
            setImagePreview(auth.user.avatar);
        }
    }, [auth.user]);

    // Init flatpickr
    const birthdateRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (!isOpen || !birthdateRef.current) return;

        const fp = flatpickr(birthdateRef.current, {
            dateFormat: "Y-m-d",
            position: "above",
            defaultDate: data.birthdate || undefined,
            locale: Indonesian,
            onChange: (_dates, dateStr) => setData("birthdate", dateStr),
        });

        if (data.birthdate) {
            fp.setDate(data.birthdate, true);
        }

        return () => fp.destroy();
    }, [isOpen, data.birthdate, setData]);

    const handleSave: FormEventHandler = (e) => {
        e.preventDefault();

        setLoading(true);

        const formData = new FormData();
        formData.append("_method", "PATCH");

        // append common fields
        const keys = [
            "name",
            "phone",
            "email",
            "gender",
            "birthdate",
            "parent_name",
            "parent_phone",
            "address",
            "expertise",
            "scope",
        ] as (keyof UserForm)[];

        keys.forEach((key) => {
            const value = data[key];
            if (value !== undefined && value !== null && value !== "") {
                formData.append(key as string, value as string);
            } else {
                // send empty string to clear field if user emptied it
                // optional: comment this out if you don't want empty fields overwritten
                formData.append(key as string, "");
            }
        });

        // avatar
        if (data.avatar && data.avatar instanceof File) {
            formData.append("avatar", data.avatar);
        }

        router.post(route("profile.update"), formData, {
            forceFormData: true,
            onSuccess: () => {
                setIsOpen(false);
                setLoading(false);
            },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <>
            {/* Card User (display) */}
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                            <img src={imagePreview} alt="user" className="object-cover w-full h-full" />
                        </div>
                        <div className="order-3 xl:order-2">
                            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                {data.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center xl:text-left">
                                {role}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                    >
                        <LuPencil className="w-4 h-4" />
                        Edit
                    </button>
                </div>
            </div>

            {/* Modal Edit */}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-[720px] m-4">
                <div className="relative w-full max-w-[720px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900">
                    <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">Edit Profil</h4>

                    <form className="flex flex-col" onSubmit={handleSave}>
                        <div className="space-y-5">
                            {/* Profile */}
                            <div>
                                <Label>Foto Profil</Label>
                                <input
                                    name="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setData("avatar", file);
                                            setImageFile(file);
                                            setImagePreview(URL.createObjectURL(file));
                                        }
                                    }}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary/80"
                                />
                                {errors.avatar && <p className="mt-1 text-xs text-red-500">{errors.avatar}</p>}
                            </div>

                            {/* Name */}
                            <div>
                                <Label>Nama Lengkap</Label>
                                <Input name="name" value={data.name} onChange={(e) => setData("name", e.target.value)} />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <Label>WhatsApp</Label>
                                <Input name="phone" value={data.phone} onChange={(e) => setData("phone", e.target.value)} />
                                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                            </div>

                            {/* Gender */}
                            <div>
                                <Label>Jenis Kelamin</Label>
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

                            {/* Birthdate */}
                            <div>
                                <Label>Tanggal Lahir</Label>
                                <Input
                                    ref={birthdateRef}
                                    id="birthdate"
                                    name="birthdate"
                                    defaultValue={data.birthdate}
                                    placeholder="YYYY-MM-DD"
                                />
                                {errors.birthdate && <p className="mt-1 text-xs text-red-500">{errors.birthdate}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <Label>Email</Label>
                                <Input name="email" value={data.email} readOnly />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            {/* --- Role-specific Fields --- */}
                            {role === "student" && (
                                <>
                                    <div>
                                        <Label>Nama Orang Tua / Wali</Label>
                                        <Input
                                            name="parent_name"
                                            value={data.parent_name}
                                            onChange={(e) => setData("parent_name", e.target.value)}
                                        />
                                        {errors.parent_name && <p className="mt-1 text-xs text-red-500">{errors.parent_name}</p>}
                                    </div>

                                    <div>
                                        <Label>Nomor HP Orang Tua / Wali</Label>
                                        <Input
                                            name="parent_phone"
                                            value={data.parent_phone}
                                            onChange={(e) => setData("parent_phone", e.target.value)}
                                            placeholder="+628xxxx"
                                        />
                                        {errors.parent_phone && <p className="mt-1 text-xs text-red-500">{errors.parent_phone}</p>}
                                    </div>

                                    <div>
                                        <Label>Alamat</Label>
                                        <Input
                                            name="address"
                                            value={data.address}
                                            onChange={(e) => setData("address", e.target.value)}
                                        />
                                        {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                                    </div>
                                </>
                            )}

                            {role === "mentor" && (
                                <>
                                    <div>
                                        <Label>Bidang Keilmuan (Expertise)</Label>
                                        <Input
                                            name="expertise"
                                            value={data.expertise}
                                            onChange={(e) => setData("expertise", e.target.value)}
                                        />
                                        {errors.expertise && <p className="mt-1 text-xs text-red-500">{errors.expertise}</p>}
                                    </div>

                                    <div>
                                        <Label>Pekerjaan / Scope</Label>
                                        <Input
                                            name="scope"
                                            value={data.scope}
                                            onChange={(e) => setData("scope", e.target.value)}
                                        />
                                        {errors.scope && <p className="mt-1 text-xs text-red-500">{errors.scope}</p>}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-6 justify-end">
                            <Button size="sm" variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
                                Close
                            </Button>
                            <Button size="sm" type="submit" variant="default" disabled={loading}>
                                {loading ? (
                                    <>
                                        <AiOutlineLoading3Quarters className="animate-spin text-lg" />
                                        Loading...
                                    </>
                                ) : (
                                    "Simpan Perubahan"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
