import { Head } from '@inertiajs/react';
import ImageNotFound from "../../../assets/svg/image-404.svg";

type Props = {
    status: number;
    message: string;
};

export default function NotFound({ status, message }: Props) {
    return (
        <>
            <Head title="Not Found" />

            <div className="flex flex-col items-center justify-center min-h-screen">
                <img src={ImageNotFound} alt="" className="w-72 h-auto" />
                <p className="mt-4 text-xl font-semibold">Oppps! Page {message}</p>
            </div>
        </>
    );
}
