import { Head } from "@inertiajs/react";
import ImageServerError from "../../../assets/svg/image-500.svg";

type Props = {
    status: number;
    message: string;
};

export default function ServerError({ status, message }: Props) {
    return (
        <>
            <Head title="Server Error" />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
                <img src={ImageServerError} alt="" className="w-72 h-auto" />
                <p className="mt-4 text-xl font-semibold">Oppps! {message}</p>
            </div>
        </>
    );
}
