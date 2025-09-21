import { Head } from '@inertiajs/react';
import ImageForbidden from "../../../assets/svg/image-403.svg";

type Props = {
    status: number;
    message: string;
};

export default function Forbidden({ status, message }: Props) {
    return (
        <>
            <Head title="Not Found" />

            <div className="flex flex-col items-center justify-center min-h-screen">
                <img src={ImageForbidden} alt="" className="w-72 h-auto" />
                <p className="mt-4 text-xl font-semibold">Oppps! Page {message}</p>
            </div>
        </>
    );
}
